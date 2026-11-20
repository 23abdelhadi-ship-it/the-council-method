#!/usr/bin/env node
// The Council Method — moteur de délibération multi-modèles.
// Assemble un dossier (fichiers texte uniquement) depuis un répertoire
// source, interroge chaque membre configuré en ronde 1 (revues
// indépendantes), puis en ronde 2 (débat anonymisé par rotation), et
// dépose les sorties brutes dans revues/<horodatage>_<sujet>/.
// Le président (un humain) vérifie ensuite les points disputés en
// exécutant et rédige synthese.md : le moteur ne produit aucun verdict.
// Zéro dépendance npm. Node >= 20 (fetch natif).
//
// Usage :
//   node conseil.mjs --sujet "Revue de la proposition X"
//                    [--source <dir>] [--dry-run] [--rondes 1|2]
//                    [--poids legere|standard|complete]
//   node conseil.mjs --init              (installe les gabarits à la racine)
//   node conseil.mjs --assistant-cles    (assistant interactif des clés)
//   node conseil.mjs --help              (aide FR/EN)
//
// Fichiers requis à la racine du projet (voir docs/*_TEMPLATE.md) :
//   brief.md       — brief permanent des membres (format imposé)
//   DECISIONS.md   — registre des décisions contraignantes de l'utilisateur
//   REFERENCE.md   — référence en vigueur que le conseil relit
// Clés : variables d'environnement ou moteur/config.json (jamais versionné).
// Une voie SANS CLÉ (Kilo Gateway) est toujours active : le conseil peut
// tenir une première session à coût zéro, sans aucun compte.

import { createHash } from "node:crypto";
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const SOURCE_DEFAUT = process.cwd();
const EXT_TEXTE = new Set([".mjs", ".js", ".json", ".md", ".txt", ".bat", ".sql", ".example", ".yml", ".yaml"]);
const EXCLURE_DIRS = new Set(["runtime", "node_modules", ".git"]);
const MAX_FICHIER = 120_000;     // caractères par fichier
const MAX_DOSSIER = 900_000;     // caractères au total
const TIMEOUT_MS = 180_000;
const MIN_SUBSTANTIEL = 500;     // caractères non blancs : seuil opérationnel
                                 // d'une « réponse substantielle » (règle du
                                 // quorum, décision du mainteneur du projet :
                                 // une session < 3 réponses substantielles
                                 // est marquée QUORUM_NON_ATTEINT).

// ---------- arguments ----------
const args = process.argv.slice(2);
function arg(nom, defaut) {
  const i = args.indexOf("--" + nom);
  return i >= 0 && args[i + 1] ? args[i + 1] : defaut;
}
const SUJET = arg("sujet", "Revue generale de la reference en vigueur");
const SOURCE = arg("source", SOURCE_DEFAUT);
const DRY = args.includes("--dry-run");
const RONDES = Number(arg("rondes", "2"));
const POIDS = arg("poids", "standard"); // legere | standard | complete

if (args.includes("--help") || args.includes("--aide")) {
  console.log(`The Council Method — moteur de délibération multi-modèles

FR — Usage :
  node conseil.mjs --sujet "..." [--source <dir>] [--rondes 1|2]
                   [--poids legere|standard|complete] [--dry-run]
  node conseil.mjs --init            installe brief.md / DECISIONS.md /
                                     REFERENCE.md depuis docs/ (gabarits)
  node conseil.mjs --assistant-cles  assistant interactif : saisit et
                                     teste vos clés, écrit config.json
  --dry-run : assemble le dossier et liste les membres, sans aucun appel.
  Poids de session : legere = ronde 1 seule, format allégé (pont d'entrée) ;
  standard = 2 rondes, format complet (défaut) ; complete = standard +
  rapport de fragilité détaillé et ligne coût/effort de session.
  Sans aucune clé, la voie Kilo (gratuite, sans compte) fait siéger le
  conseil : première session complète possible en quelques minutes.
  Fourni tel quel, sans support (voir README).

EN — Usage:
  node conseil.mjs --sujet "..." [--source <dir>] [--rondes 1|2]
                   [--poids legere|standard|complete] [--dry-run]
  node conseil.mjs --init            installs brief.md / DECISIONS.md /
                                     REFERENCE.md from docs/ templates
  node conseil.mjs --assistant-cles  interactive key setup wizard
  --dry-run: builds the dossier and lists members, no network call.
  Session weights: legere = round 1 only, light format (entry bridge);
  standard = 2 rounds, full format (default); complete = standard +
  detailed fragility report and session cost/effort line.
  With no key at all, the Kilo lane (free, no account) seats the council.
  Provided as-is, without support (see README).`);
  process.exit(0);
}

// ---------- gabarits racine ----------
const FICHIERS_RACINE = [
  ["brief.md", "docs/BRIEF_TEMPLATE.md"],
  ["DECISIONS.md", "docs/DECISIONS_TEMPLATE.md"],
  ["REFERENCE.md", "docs/REFERENCE_TEMPLATE.md"],
];
if (args.includes("--init")) {
  for (const [cible, gabarit] of FICHIERS_RACINE) {
    const dest = join(RACINE, cible), src = join(RACINE, gabarit);
    if (existsSync(dest)) { console.log(`--init : ${cible} existe déjà, inchangé.`); continue; }
    if (!existsSync(src)) { console.log(`--init : gabarit introuvable (${gabarit}), ${cible} non créé.`); continue; }
    copyFileSync(src, dest);
    console.log(`--init : ${cible} créé depuis ${gabarit} — complétez-le avant la première session.`);
  }
  process.exit(0);
}
function verifierFichiersRacine() {
  const manquants = FICHIERS_RACINE.filter(([f]) => !existsSync(join(RACINE, f)));
  if (!manquants.length) return;
  console.error("Fichiers racine manquants — le conseil ne peut pas siéger sans eux :");
  for (const [f, g] of manquants)
    console.error(`  - ${f}  (gabarit guidé : ${g})`);
  console.error("Installez les gabarits avec :  node moteur/conseil.mjs --init");
  console.error("puis complétez chaque fichier (les gabarits expliquent quoi écrire).");
  process.exit(3);
}

// ---------- configuration ----------
function lireConfig() {
  const cfg = {};
  const p = join(ICI, "config.json");
  if (existsSync(p)) Object.assign(cfg, JSON.parse(readFileSync(p, "utf8")));
  if (process.env.GEMINI_API_KEY) cfg.geminiKey = process.env.GEMINI_API_KEY;
  if (process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN)
    cfg.githubToken = process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN;
  if (process.env.OPENROUTER_API_KEY) cfg.openrouterKey = process.env.OPENROUTER_API_KEY;
  if (process.env.GROQ_API_KEY) cfg.groqKey = process.env.GROQ_API_KEY;
  if (process.env.MISTRAL_API_KEY) cfg.mistralKey = process.env.MISTRAL_API_KEY;
  if (process.env.CEREBRAS_API_KEY) cfg.cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (process.env.HF_TOKEN) cfg.hfKey = process.env.HF_TOKEN;
  if (process.env.NVIDIA_API_KEY) cfg.nvidiaKey = process.env.NVIDIA_API_KEY;
  if (process.env.COHERE_API_KEY) cfg.cohereKey = process.env.COHERE_API_KEY;
  if (process.env.SAMBANOVA_API_KEY) cfg.sambanovaKey = process.env.SAMBANOVA_API_KEY;
  if (process.env.CLOUDFLARE_API_TOKEN) cfg.cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
  if (process.env.CLOUDFLARE_ACCOUNT_ID) cfg.cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  cfg.geminiModele = cfg.geminiModele || "gemini-3.6-flash";
  cfg.geminiModeles = cfg.geminiModeles || [cfg.geminiModele, "gemini-3-flash-preview", "gemma-4-31b-it"];
  cfg.githubModeles = cfg.githubModeles || ["openai/gpt-4o", "meta/Llama-3.3-70B-Instruct"];
  cfg.openrouterModeles = cfg.openrouterModeles || ["nvidia/nemotron-3-ultra-550b-a55b:free", "cohere/north-mini-code:free", "inclusionai/ling-3.2-flash:free", "google/gemma-4-31b-it:free"];
  cfg.groqModeles = cfg.groqModeles || ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
  cfg.mistralModeles = cfg.mistralModeles || ["codestral-latest"];
  cfg.cerebrasModeles = cfg.cerebrasModeles || ["qwen-3-235b-a22b-instruct-2507"];
  cfg.hfModeles = cfg.hfModeles || ["meta-llama/Llama-3.3-70B-Instruct"];
  cfg.nvidiaModeles = cfg.nvidiaModeles || ["deepseek-ai/deepseek-r1"];
  cfg.cloudflareModeles = cfg.cloudflareModeles || ["@cf/meta/llama-3.3-70b-instruct-fp8-fast"];
  cfg.cohereModeles = cfg.cohereModeles || ["command-a-03-2025"];
  cfg.sambanovaModeles = cfg.sambanovaModeles || ["Meta-Llama-3.3-70B-Instruct"];
  cfg.zaiModeles = cfg.zaiModeles || ["glm-4.5-flash"];
  cfg.kiloModeles = cfg.kiloModeles || ["kilo-auto/free", "inclusionai/ling-3.2-flash:free", "baidu/ernie-5.5-flash-preview:free"];
  cfg.freellmapiModeles = cfg.freellmapiModeles || ["auto"];
  return cfg;
}
const A_UNE_CLE = cfg0 => ["geminiKey","openrouterKey","groqKey","mistralKey","cerebrasKey",
  "hfKey","nvidiaKey","cohereKey","sambanovaKey","zaiKey","githubToken","cloudflareToken"]
  .some(k => cfg0[k]);

// ---------- dossier ----------
function sha256(texte) { return createHash("sha256").update(texte).digest("hex"); }

function assemblerDossier(source) {
  if (!existsSync(source)) {
    console.error(`Répertoire source introuvable : ${source}`);
    console.error("Passez --source <dir> vers le dossier de fichiers texte à soumettre au conseil,");
    console.error("ou lancez le moteur depuis le répertoire du projet à relire.");
    process.exit(3);
  }
  const fichiers = [];
  (function marcher(dir) {
    for (const nom of readdirSync(dir).sort()) {
      const p = join(dir, nom);
      const st = statSync(p);
      if (st.isDirectory()) { if (!EXCLURE_DIRS.has(nom)) marcher(p); continue; }
      const ext = extname(nom).toLowerCase();
      if (!EXT_TEXTE.has(ext) && nom !== ".gitignore" && nom !== ".env.example") continue;
      fichiers.push(p);
    }
  })(source);
  const entrees = [], exclus = [];
  let total = 0, tronque = false;
  for (const p of fichiers) {
    let contenu = readFileSync(p, "utf8");
    if (contenu.length > MAX_FICHIER) { contenu = contenu.slice(0, MAX_FICHIER) + "\n[TRONQUE par le moteur]"; tronque = true; }
    if (total + contenu.length > MAX_DOSSIER) { tronque = true; exclus.push(relative(source, p)); continue; }
    total += contenu.length;
    entrees.push({ chemin: relative(source, p), taille: Buffer.byteLength(contenu), sha256: sha256(contenu), contenu });
  }
  const plusGros = [...entrees].sort((a, b) => b.taille - a.taille).slice(0, 5)
    .map(e => ({ chemin: e.chemin, taille: e.taille }));
  const texte = entrees.map(e => `\n===== FICHIER: ${e.chemin} =====\n${e.contenu}`).join("\n");
  return { entrees, texte, tronque, exclus, plusGros,
           empreinte: sha256(entrees.map(e => e.chemin + ":" + e.sha256).join("\n")) };
}

// ---------- fournisseurs ----------
// Chaque appel rend { texte, modeleServi } : le modèle ayant RÉELLEMENT
// servi la réponse, lu dans les métadonnées de la voie quand elle le
// fournit. Il est confronté au modèle déclaré dans le manifeste
// (déclaration d'identité des membres — voir docs/METHODE.md).
async function appelHttp(url, options, timeoutMs = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...options, signal: ctrl.signal });
    const corps = await r.text();
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${corps.slice(0, 300)}`);
    return JSON.parse(corps);
  } finally { clearTimeout(t); }
}

async function membreGemini(cfg, prompt) {
  const j = await appelHttp(
    `https://generativelanguage.googleapis.com/v1beta/models/${cfg.geminiModele}:generateContent`,
    { method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.geminiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }],
                             generationConfig: { temperature: 0.2 } }) });
  return { texte: j.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "",
           modeleServi: j.modelVersion || null };
}

// Fabrique générique pour tout fournisseur compatible OpenAI
// (OpenRouter, Groq, Mistral, Cerebras, Hugging Face Router, NVIDIA NIM,
// Cloudflare Workers AI, GitHub Models, Z.AI, Cohere compat).
function appelOpenAI(base, cle, modele, options = {}) {
  return async prompt => {
    const j = await appelHttp(base.replace(/\/$/, "") + "/chat/completions",
      { method: "POST",
        // cle null = fournisseur sans cle (Kilo) : aucun en-tete Authorization.
        headers: { "Content-Type": "application/json",
                   ...(cle ? { Authorization: `Bearer ${cle}` } : {}) },
        body: JSON.stringify({ model: modele, temperature: 0.2, ...options,
          messages: [{ role: "user", content: prompt }] }) });
    return { texte: j.choices?.[0]?.message?.content || "", modeleServi: j.model || null };
  };
}

function idDepuis(modele) {
  return modele.split("/").pop().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function construireMembres(cfg) {
  const membres = [];
  const ajouter = (prefixe, nom, base, cle, modeles) => {
    if (!cle) return;
    for (const m of modeles) membres.push({ id: `${prefixe}-${idDepuis(m)}`, ligne: nom,
      modeleDeclare: m, nom: `${nom} (${m})`, appel: appelOpenAI(base, cle, m) });
  };
  if (cfg.geminiKey) for (const mod of cfg.geminiModeles)
    membres.push({ id: `gemini-${idDepuis(mod)}`, ligne: "Gemini API", modeleDeclare: mod,
      nom: `Gemini API (${mod})`, appel: p => membreGemini({ ...cfg, geminiModele: mod }, p) });
  ajouter("openrouter", "OpenRouter", "https://openrouter.ai/api/v1", cfg.openrouterKey, cfg.openrouterModeles);
  // Modèles « a raisonnement » : avec un petit budget de sortie, la reponse
  // revient vide (le raisonnement consomme les jetons) ; budget eleve donc.
  if (cfg.openrouterKey) membres.push({
    id: `openrouter-${idDepuis("nvidia/nemotron-3.5-lightning:free")}`, ligne: "OpenRouter",
    modeleDeclare: "nvidia/nemotron-3.5-lightning:free",
    nom: "OpenRouter (nvidia/nemotron-3.5-lightning:free)",
    appel: appelOpenAI("https://openrouter.ai/api/v1", cfg.openrouterKey,
      "nvidia/nemotron-3.5-lightning:free", { max_tokens: 32000 }) });
  // Kilo Gateway : voie SANS CLE, toujours active. C'est le point de
  // depart par defaut : aucune cle, aucun compte, aucun cout pour sieger.
  // Sa liste de modeles gratuits tourne et la voie est limitee en debit :
  // un 429 y est une SATURATION DE VOIE, pas un echec du modele — il est
  // etiquete comme tel. Aucune tentative supplementaire n'est faite.
  const appelKilo = (modele, options = {}) => {
    const brut = appelOpenAI("https://api.kilo.ai/api/gateway", null, modele, options);
    return async prompt => {
      try { return await brut(prompt); }
      catch (e) {
        const msg = String(e && e.message || e);
        if (msg.startsWith("HTTP 429"))
          throw new Error(`SATURATION VOIE KILO (429 : limite atteinte sur la voie — quota de ligne ou du modele en amont — pas un echec du modele) : ${msg.slice(0, 200)}`);
        throw e;
      }
    };
  };
  for (const m of cfg.kiloModeles) membres.push({
    id: `kilo-${m === "kilo-auto/free" ? "auto-free" : idDepuis(m)}`, ligne: "Kilo (sans cle)",
    modeleDeclare: m, nom: `Kilo (voie sans cle) (${m})`,
    appel: appelKilo(m, m === "kilo-auto/free" ? { max_tokens: 32000 } : {}) });
  ajouter("groq", "Groq", "https://api.groq.com/openai/v1", cfg.groqKey, cfg.groqModeles);
  ajouter("mistral", "Mistral", "https://api.mistral.ai/v1", cfg.mistralKey, cfg.mistralModeles);
  ajouter("cerebras", "Cerebras", "https://api.cerebras.ai/v1", cfg.cerebrasKey, cfg.cerebrasModeles);
  ajouter("cohere", "Cohere", "https://api.cohere.ai/compatibility/v1", cfg.cohereKey, cfg.cohereModeles);
  ajouter("sambanova", "SambaNova", "https://api.sambanova.ai/v1", cfg.sambanovaKey, cfg.sambanovaModeles);
  ajouter("hf", "HuggingFace", "https://router.huggingface.co/v1", cfg.hfKey, cfg.hfModeles);
  ajouter("nvidia", "NVIDIA", "https://integrate.api.nvidia.com/v1", cfg.nvidiaKey, cfg.nvidiaModeles);
  ajouter("zai", "Z.AI", "https://api.z.ai/api/paas/v4", cfg.zaiKey, cfg.zaiModeles);
  // FreeLLMAPI : routeur local auto-heberge optionnel (http://localhost:3001/v1,
  // cle unifiee cfg.freellmapiKey). Voie additionnelle : si le service local
  // est arrete, ce membre echoue proprement sans bloquer les autres.
  ajouter("freellmapi", "FreeLLMAPI (local)", "http://localhost:3001/v1", cfg.freellmapiKey, cfg.freellmapiModeles);
  if (cfg.cloudflareToken && cfg.cloudflareAccountId)
    ajouter("cloudflare", "Cloudflare", `https://api.cloudflare.com/client/v4/accounts/${cfg.cloudflareAccountId}/ai/v1`,
      cfg.cloudflareToken, cfg.cloudflareModeles);
  // GitHub Models : inactif par defaut (voie constatee peu fiable en
  // pratique). Reactiver explicitement avec cfg.githubActif = true.
  if (cfg.githubToken && cfg.githubActif)
    ajouter("gh", "GitHub Models", "https://models.github.ai/inference", cfg.githubToken, cfg.githubModeles);
  return membres;
}

// ---------- utilitaires ----------
function slug(s) {
  return s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase()
          .replace(/[\s_]+/g, "-").slice(0, 40) || "revue";
}
function horodatage() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}`;
}
// Lettres de la ronde 2 : generation dynamique A..Z puis AA, AB...
// (un tableau fixe de 5 lettres se heurte des 7 reponses reussies).
function lettre(i) {
  let s = "", n = i;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}
function classeErreur(msg) {
  if (/HTTP 429/.test(msg)) return "429 (saturation/quotas)";
  if (/HTTP 413/.test(msg)) return "413 (dossier trop grand pour la voie)";
  if (/HTTP 40[234]/.test(msg)) return "4xx (voie ou modele indisponible)";
  if (/HTTP 5\d\d/.test(msg)) return "5xx (fournisseur)";
  if (/abort|timeout/i.test(msg)) return "timeout";
  if (/fetch|ENOTFOUND|ECONN|network/i.test(msg)) return "reseau";
  return "autre";
}
async function enParallele(membres, fn) {
  return Promise.all(membres.map(async m => {
    try { const r = await fn(m); return { membre: m, ok: true, texte: r.texte, modeleServi: r.modeleServi || null }; }
    catch (e) { return { membre: m, ok: false, erreur: String(e && e.message || e) }; }
  }));
}
const substantiel = res => res.ok && res.texte.replace(/\s/g, "").length >= MIN_SUBSTANTIEL;
// Statut de quorum d'une session : moins de 3 réponses substantielles,
// la session est marquée QUORUM_NON_ATTEINT (règle de validité, voir
// docs/METHODE.md) ; sinon ATTEINT.
function statutQuorum(nbSubstantiels) {
  return nbSubstantiels >= 3 ? "ATTEINT" : "QUORUM_NON_ATTEINT";
}
function enteteMembre(res, ronde) {
  return `<!-- THE COUNCIL METHOD · ORIGINE: membre · en-tete genere par le moteur (provenance figee a l'ecriture)
MEMBRE: ${res.membre.id}
LIGNE: ${res.membre.ligne}
MODELE_DECLARE: ${res.membre.modeleDeclare}
MODELE_SERVI: ${res.modeleServi || "(non renseigne par la voie)"}
RONDE: ${ronde}
DATE: ${new Date().toISOString()}
-->\n\n`;
}

// ---------- assistant interactif des clés ----------
// Décision du mainteneur du projet : un assistant au premier lancement.
// Il demande fournisseur par fournisseur, TESTE chaque clé en direct,
// et écrit lui-même moteur/config.json (clés validées uniquement).
// Fourni tel quel, sans support. La voie Kilo (sans clé) reste le
// point de départ par défaut : l'assistant n'ajoute que des membres.
async function testerCleChat(base, cle, modele) {
  try {
    const j = await appelHttp(base.replace(/\/$/, "") + "/chat/completions",
      { method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cle}` },
        body: JSON.stringify({ model: modele, max_tokens: 8,
          messages: [{ role: "user", content: "Dis seulement : OK" }] }) }, 30_000);
    return { ok: true, detail: j.model || modele };
  } catch (e) { return { ok: false, detail: String(e && e.message || e).slice(0, 160) }; }
}
async function testerCleGemini(cle, modele) {
  try {
    const j = await appelHttp(
      `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
      { method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": cle },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Dis seulement : OK" }] }] }) }, 30_000);
    return { ok: true, detail: j.modelVersion || modele };
  } catch (e) { return { ok: false, detail: String(e && e.message || e).slice(0, 160) }; }
}
const ASSISTANT_FOURNISSEURS = [
  { champ: "geminiKey", nom: "Google Gemini", obtention: "https://aistudio.google.com/apikey",
    tester: cle => testerCleGemini(cle, "gemini-3.6-flash") },
  { champ: "openrouterKey", nom: "OpenRouter", obtention: "https://openrouter.ai/keys",
    tester: cle => testerCleChat("https://openrouter.ai/api/v1", cle, "nvidia/nemotron-3-ultra-550b-a55b:free") },
  { champ: "groqKey", nom: "Groq", obtention: "https://console.groq.com/keys",
    tester: cle => testerCleChat("https://api.groq.com/openai/v1", cle, "openai/gpt-oss-120b") },
  { champ: "cohereKey", nom: "Cohere", obtention: "https://dashboard.cohere.com/api-keys",
    tester: cle => testerCleChat("https://api.cohere.ai/compatibility/v1", cle, "command-a-03-2025") },
  { champ: "mistralKey", nom: "Mistral", obtention: "https://console.mistral.ai/api-keys",
    tester: cle => testerCleChat("https://api.mistral.ai/v1", cle, "codestral-latest") },
  { champ: "cerebrasKey", nom: "Cerebras", obtention: "https://cloud.cerebras.ai",
    tester: cle => testerCleChat("https://api.cerebras.ai/v1", cle, "qwen-3-235b-a22b-instruct-2507") },
  { champ: "zaiKey", nom: "Z.AI", obtention: "https://z.ai/manage-apikey/apikey-list",
    tester: cle => testerCleChat("https://api.z.ai/api/paas/v4", cle, "glm-4.5-flash") },
  { champ: "nvidiaKey", nom: "NVIDIA", obtention: "https://build.nvidia.com",
    tester: cle => testerCleChat("https://integrate.api.nvidia.com/v1", cle, "meta/llama-3.1-8b-instruct") },
  { champ: "hfKey", nom: "Hugging Face", obtention: "https://huggingface.co/settings/tokens",
    tester: cle => testerCleChat("https://router.huggingface.co/v1", cle, "meta-llama/Llama-3.3-70B-Instruct") },
  { champ: "sambanovaKey", nom: "SambaNova", obtention: "https://cloud.sambanova.ai/apis",
    tester: cle => testerCleChat("https://api.sambanova.ai/v1", cle, "Meta-Llama-3.3-70B-Instruct") },
];
// Lecteur de lignes robuste : fonctionne au terminal ET en entrée
// préparée (pipe/fichier) — à EOF, les questions restantes valent ""
// (passer) au lieu de lever ERR_USE_AFTER_CLOSE.
function lecteurLignes() {
  const rl = createInterface({ input: process.stdin });
  const file = [], attentes = [];
  let ferme = false;
  rl.on("line", l => { if (attentes.length) attentes.shift()(l); else file.push(l); });
  rl.on("close", () => { ferme = true; while (attentes.length) attentes.shift()(""); });
  return {
    question: invite => new Promise(res => {
      if (invite) process.stdout.write(invite);
      if (file.length) res(file.shift());
      else if (ferme) res("");
      else attentes.push(res);
    }),
    fermer: () => { try { rl.close(); } catch { /* déjà fermé */ } },
  };
}

async function assistantCles(cfgActuel) {
  console.log("Assistant de configuration des clés — The Council Method");
  console.log("Rappel : la voie Kilo (sans clé, sans compte) fait déjà siéger le conseil.");
  console.log("Cet assistant ne sert qu'à AJOUTER des membres. Chaque clé est testée");
  console.log("en direct ; seules les clés qui fonctionnent sont écrites dans");
  console.log("moteur/config.json (jamais versionné). Fourni tel quel, sans support.\n");
  const rl = lecteurLignes();
  const nouvelles = {};
  for (const f of ASSISTANT_FOURNISSEURS) {
    if (cfgActuel[f.champ]) { console.log(`— ${f.nom} : déjà configuré, inchangé.`); continue; }
    console.log(`— ${f.nom}\n  Clé gratuite : ${f.obtention}`);
    for (;;) {
      const rep = (await rl.question("  Collez la clé (Entrée = passer) : ")).trim();
      if (!rep) break;
      process.stdout.write("  Test en cours… ");
      const res = await f.tester(rep);
      if (res.ok) { console.log(`✓ la clé fonctionne (modèle servi : ${res.detail}).`); nouvelles[f.champ] = rep; break; }
      console.log(`✗ échec : ${res.detail}`);
      const suite = (await rl.question("  [Entrée = continuer sans cette clé · r = réessayer] : ")).trim().toLowerCase();
      if (suite !== "r") break;
    }
  }
  rl.fermer();
  const validees = Object.keys(nouvelles);
  if (!validees.length) {
    console.log("\nAucune clé validée : aucun fichier écrit. La voie Kilo (sans clé) reste votre point de départ.");
    return false;
  }
  const p = join(ICI, "config.json");
  const brut = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  Object.assign(brut, nouvelles);
  writeFileSync(p, JSON.stringify(brut, null, 2) + "\n");
  try { chmodSync(p, 0o600); } catch { /* permissions au mieux */ }
  console.log(`\n✓ ${validees.length} clé(s) validée(s) écrite(s) dans moteur/config.json : ${validees.join(", ")}`);
  console.log("Ne versionnez jamais ce fichier. Les listes de modèles par défaut s'appliquent automatiquement.");
  return true;
}

// ---------- rapport de fragilité ----------
function rapportFragilite({ resR1, resR2, dossier, dureeMs, quorum }) {
  const lignes = [];
  lignes.push("# Rapport de fragilité de session");
  lignes.push("");
  lignes.push(`Sujet : ${SUJET}`);
  lignes.push(`Poids : ${POIDS} · Durée totale : ${Math.round(dureeMs / 1000)} s · Quorum : ${quorum ? "ATTEINT" : "QUORUM_NON_ATTEINT"}`);
  const tous = [...resR1, ...(resR2 || [])];
  lignes.push(`Appels : ${tous.length} (ronde 1 : ${resR1.length}${resR2 ? `, ronde 2 : ${resR2.length}` : ""}) · Échecs : ${tous.filter(r => !r.ok).length}`);
  const classes = {};
  for (const r of tous) if (!r.ok) { const c = classeErreur(r.erreur); classes[c] = (classes[c] || 0) + 1; }
  if (Object.keys(classes).length)
    lignes.push(`Échecs par classe : ${Object.entries(classes).map(([k, v]) => `${k} × ${v}`).join(" ; ")}`);
  lignes.push("");
  lignes.push("## Membres (ronde 1)");
  lignes.push("");
  lignes.push("| Membre | Ligne | Modèle déclaré | Modèle servi | Statut | Caractères |");
  lignes.push("|---|---|---|---|---|---|");
  for (const r of resR1)
    lignes.push(`| ${r.membre.id} | ${r.membre.ligne} | ${r.membre.modeleDeclare} | ${r.ok ? (r.modeleServi || "—") : "—"} | ${r.ok ? (substantiel(r) ? "OK (substantielle)" : "OK (courte)") : "ÉCHEC"} | ${r.ok ? r.texte.length : 0} |`);
  const ecarts = resR1.filter(r => r.ok && r.modeleServi && r.modeleServi !== r.membre.modeleDeclare);
  lignes.push("");
  lignes.push("## Écarts d'identité déclaré/servi");
  lignes.push("");
  if (ecarts.length)
    for (const r of ecarts)
      lignes.push(`- **${r.membre.id}** : déclaré « ${r.membre.modeleDeclare} », servi « ${r.modeleServi} » — à vérifier par le président (les lignes agrégées peuvent servir un autre modèle que leur nom).`);
  else lignes.push("- Aucun écart mesurable (ou voies ne renseignant pas le modèle servi).");
  if (dossier.tronque) {
    lignes.push("");
    lignes.push("## Avertissement dossier");
    lignes.push("");
    lignes.push(`Dossier tronqué. Fichiers exclus faute de place : ${dossier.exclus.join(", ") || "(tronqué par fichier seul)"}.`);
    lignes.push(`Plus gros fichiers retenus : ${dossier.plusGros.map(e => `${e.chemin} (${e.taille} car.)`).join(" ; ")}.`);
    lignes.push("Si des membres échouent en 413, réduisez le dossier : ce sont les plus gros fichiers qui saturent les petites voies.");
  }
  if (POIDS === "complete") {
    lignes.push("");
    lignes.push("## Ligne coût/effort de session");
    lignes.push("");
    lignes.push(`Comptée en appels, pas en demandes isolées : ${tous.length} appels, ${tous.filter(r => !r.ok).length} échecs, ${Math.round(dureeMs / 1000)} s de bout en bout. Sur voies gratuites, le coût est le temps du président ; sur clés payantes, ajoutez le coût des appels ci-dessus à votre propre comptabilité — la méthode exige ce chiffre en ligne séparée, jamais fondu dans un total.`);
  }
  lignes.push("");
  return lignes.join("\n");
}

// ---------- synthèse guidée (gabarit généré) ----------
function syntheseGuidee({ resR1, resR2, dossier, nbSubstantiels }) {
  return `# Synthèse du président — à rédiger après vérification par exécution

Sujet : ${SUJET}
Dossier : empreinte ${dossier.empreinte} (${dossier.entrees.length} fichiers) · Poids : ${POIDS} · Quorum : ATTEINT (${nbSubstantiels} réponses substantielles)

## Index des sorties (généré par le moteur)
### Ronde 1
${resR1.map(r => `- ${r.fichier} — ${r.membre.nom} — ${r.ok ? `OK, ${r.texte.length} car.` : "ÉCHEC"}${r.modeleServi ? ` · modèle servi : ${r.modeleServi}` : ""}`).join("\n")}
### Ronde 2
${resR2 && resR2.length ? resR2.map(r => `- ${r.fichier} — ${r.membre.nom} — ${r.ok ? `OK, ${r.texte.length} car.` : "ÉCHEC"}`).join("\n") : "(pas de ronde 2)"}

## Procédure du président (étape par étape)
1. Lis chaque revue de la ronde 1, puis les débats de la ronde 2.
2. Pour chaque point disputé, vérifie PAR EXÉCUTION ou dans la source primaire ; n'arbitre jamais au vote.
3. Classe chaque fait retenu : [établi] seulement avec une preuve hors conseil (fichier:ligne, exécution, document).
4. Préserve les désaccords mot pour mot (section dédiée) ; ne les moyenne pas.
5. Termine par le journal des résultats : position retenue + probabilité, à confronter plus tard au réel.

## Faits vérifiés (par exécution)
-

## Points disputés et arbitrage
-

## Désaccords préservés (texte intégral, non moyennés)
> Recopier ici, mot pour mot, les positions minoritaires non retenues et leurs motifs.

## Contexte manquant ayant causé le désaccord
> Ce que le dossier ne contenait pas et qui explique le désaccord — à demander à l'utilisateur plutôt qu'à deviner.
-

## Double contrôle des allégations retenues
| Allégation | Étayée par une preuve ? (fichier:ligne / exécution) | Traite-t-elle la question posée ? |
|---|---|---|
|  |  |  |

## Décisions requises de l'utilisateur
-

## Journal des résultats (à compléter après coup, sans réécrire la position)
- Position retenue :
- Probabilité estimée :
- Ce qui s'est réellement passé (à ajouter quand le réel tranche) :
`;
}

// ---------- déroulement ----------
// Le déroulement ne s'exécute que lorsque le fichier est lancé
// directement ; importé (par les tests), le module n'expose que ses
// fonctions pures, sans aucun effet de bord ni appel réseau.
const EST_PRINCIPAL = !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export { lireConfig, construireMembres, substantiel, statutQuorum, lettre,
         classeErreur, slug, idDepuis, A_UNE_CLE, enteteMembre, sha256,
         rapportFragilite, MIN_SUBSTANTIEL };
if (EST_PRINCIPAL) {
const debut = Date.now();
let cfg = lireConfig();
if (args.includes("--assistant-cles")) { await assistantCles(cfg); process.exit(0); }
verifierFichiersRacine();
// Premier lancement interactif sans aucune clé : proposer l'assistant.
// Défaut = non : la voie Kilo (sans clé) siège immédiatement.
if (!DRY && !A_UNE_CLE(cfg) && !existsSync(join(ICI, "config.json")) && process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const rep = (await rl.question("Aucune clé configurée : la voie Kilo (sans clé) siège dès maintenant.\nLancer l'assistant de configuration des clés ? [o/N] : ").catch(() => "")).trim().toLowerCase();
  rl.close();
  if (rep === "o" || rep === "oui") { await assistantCles(cfg); cfg = lireConfig(); }
}

const brief = readFileSync(join(RACINE, "brief.md"), "utf8");
const decisions = readFileSync(join(RACINE, "DECISIONS.md"), "utf8");
const reference = readFileSync(join(RACINE, "REFERENCE.md"), "utf8");

console.log(`Assemblage du dossier depuis ${SOURCE} ...`);
const dossier = assemblerDossier(SOURCE);
if (!dossier.entrees.length) {
  console.error(`Aucun fichier texte assemblé depuis ${SOURCE} : le conseil n'a rien à relire.`);
  console.error("Vérifiez --source (extensions acceptées : .md .txt .js .mjs .json .sql .bat .yml .yaml .example).");
  process.exit(3);
}
console.log(`Dossier : ${dossier.entrees.length} fichiers texte, ${dossier.texte.length} caracteres, ` +
            `empreinte ${dossier.empreinte.slice(0, 16)}...${dossier.tronque ? " (TRONQUE)" : ""}`);
if (dossier.tronque) {
  console.log(`⚠ Dossier tronqué. Exclus faute de place : ${dossier.exclus.join(", ") || "(tronqué par fichier seul)"}`);
  console.log(`  Plus gros fichiers retenus : ${dossier.plusGros.map(e => `${e.chemin} (${e.taille})`).join(" ; ")}`);
  console.log("  Les petites voies échoueront en 413 sur ce dossier : réduisez-le si le quorum est menacé.");
}

const dirSortie = join(RACINE, "revues", `${horodatage()}_${slug(SUJET)}`);
mkdirSync(dirSortie, { recursive: true });
const manifeste = { projet: "The Council Method", sujet: SUJET, date: new Date().toISOString(), source: SOURCE,
  poids: POIDS,
  dossier: { fichiers: dossier.entrees.map(e => ({ chemin: e.chemin, taille: e.taille, sha256: e.sha256 })),
             empreinte: dossier.empreinte, tronque: dossier.tronque, exclus: dossier.exclus },
  membres: [], rondes: RONDES, dryRun: DRY, quorum: null, reponsesSubstantielles: 0 };

const tete = `${brief}\n\n# DECISIONS.md\n${decisions}\n\n# REFERENCE.md\n${reference}\n`;
let promptR1 = `${tete}\n# SUJET DE LA REVUE\n${SUJET}\n\n# DOSSIER (reference en vigueur, fichiers texte)\n${dossier.texte}\n\nProduis ta revue independante selon le format impose du brief.`;
if (POIDS === "legere")
  promptR1 += `\n\nMODE LEGER (pont d'entree) : format allégé — au plus 5 points, chacun classé, sans débat ; la rigueur de classification reste entière.`;

const membresTous = construireMembres(cfg);
if (DRY) {
  manifeste.membres = membresTous.map(m => ({ id: m.id, nom: m.nom, ligne: m.ligne, modeleDeclare: m.modeleDeclare }));
  writeFileSync(join(dirSortie, "MANIFEST.json"), JSON.stringify(manifeste, null, 2));
  writeFileSync(join(dirSortie, "DOSSIER.txt"), promptR1);
  console.log(`[dry-run] Aucun appel reseau. Dossier de revue ecrit dans ${dirSortie}`);
  console.log(`[dry-run] Membres qui seraient consultes : ${membresTous.map(m => m.nom).join(" ; ") || "(aucun)"}`);
  process.exit(0);
}

const membres = membresTous;
if (!membres.length) {
  console.error("Aucun membre à consulter : la liste kiloModeles est vide dans la configuration.");
  console.error("La voie Kilo (sans clé) doit toujours fournir au moins un membre : vérifiez moteur/config.json");
  console.error("ou relancez avec le config.exemple.json par défaut. Pour ajouter des clés : --assistant-cles.");
  process.exit(2);
}
const nbSansCle = membres.filter(m => m.ligne.startsWith("Kilo")).length;
console.log(`Membres : ${membres.length} (dont ${nbSansCle} par la voie sans clé Kilo — coût zéro, aucun compte)`);
console.log(`Ronde 1 (independante) : ${membres.map(m => m.nom).join(" ; ")}`);
const r1 = await enParallele(membres, m => m.appel(promptR1));
const resR1 = r1.map(res => ({ ...res, fichier: `r1-${res.membre.id}.md` }));
for (const res of resR1) {
  writeFileSync(join(dirSortie, res.fichier),
    res.ok ? enteteMembre(res, 1) + res.texte : `# ECHEC — ${res.membre.nom}\n\n${res.erreur}\n`);
  console.log(res.ok ? `  OK  ${res.membre.nom} (${res.texte.length} car.)` : `  ECHEC ${res.membre.nom} : ${res.erreur.slice(0, 120)}`);
}
const substantiels = resR1.filter(substantiel);
manifeste.reponsesSubstantielles = substantiels.length;
manifeste.membres = resR1.map(r => ({ id: r.membre.id, nom: r.membre.nom, ligne: r.membre.ligne,
  modeleDeclare: r.membre.modeleDeclare, modeleServi: r.modeleServi || null,
  statut: r.ok ? (substantiel(r) ? "ok-substantielle" : "ok-courte") : "echec",
  caracteres: r.ok ? r.texte.length : 0 }));

// ---------- quorum (règle de validité de session) ----------
// Moins de 3 réponses substantielles : la session est marquée
// QUORUM_NON_ATTEINT, aucun débat ni synthèse — ses sorties brutes
// restent consultables mais ne valent pas jugement de conseil.
if (substantiels.length < 3) {
  manifeste.quorum = statutQuorum(substantiels.length);
  writeFileSync(join(dirSortie, "MANIFEST.json"), JSON.stringify(manifeste, null, 2));
  writeFileSync(join(dirSortie, "rapport-fragilite.md"),
    rapportFragilite({ resR1, resR2: null, dossier, dureeMs: Date.now() - debut, quorum: false }));
  writeFileSync(join(dirSortie, "QUORUM_NON_ATTEINT.md"),
`# QUORUM_NON_ATTEINT

Cette session n'a réuni que ${substantiels.length} réponse(s) substantielle(s) sur ${resR1.length} membres consultés (seuil de validité : 3).

Ses sorties brutes (r1-*.md) restent dans ce dossier à titre de traces, mais elles ne constituent PAS un jugement de conseil : aucune ronde 2, aucune synthèse. Relancez la session (autres voies, dossier réduit, ou clés supplémentaires via --assistant-cles) plutôt que de conclure sur cette base.
`);
  console.log(`\n⚠ QUORUM_NON_ATTEINT : ${substantiels.length} réponse(s) substantielle(s) < 3. Session marquée, pas de ronde 2 ni de synthèse.`);
  console.log(`Sorties brutes : ${dirSortie}`);
  process.exit(0);
}
manifeste.quorum = statutQuorum(substantiels.length);

// ---------- ronde 2 (débat anonymisé par rotation) ----------
let resR2 = null;
if (RONDES >= 2 && POIDS !== "legere" && substantiels.length >= 2) {
  console.log("Ronde 2 (debat anonymise)...");
  const r2 = await enParallele(substantiels.map(r => r.membre), async m => {
    const moi = substantiels.findIndex(r => r.membre === m);
    const autres = substantiels.filter((_, i) => i !== moi)
      .map((r, k) => ({ r, l: lettre(k + moi) }));
    const corps = autres.map(({ r, l }) =>
      `\n===== REVUE DU MODELE ${l} =====\n${r.texte}`).join("\n");
    const prompt = `${tete}\n# RONDE 2 — DEBAT\nVoici les revues d'autres membres du conseil (anonymisees) sur le meme dossier et le meme sujet : « ${SUJET} ».\n${corps}\n\nApplique la section « ronde 2 » du brief : pour chaque point, ACCORD ou DESACCORD motive depuis le texte du dossier. Le dossier complet reste celui de la ronde 1 (conserve en contexte de ta revue).`;
    return m.appel(prompt);
  });
  resR2 = r2.map(res => ({ ...res, fichier: `r2-${res.membre.id}.md` }));
  for (const res of resR2) {
    writeFileSync(join(dirSortie, res.fichier),
      res.ok ? enteteMembre(res, 2) + res.texte : `# ECHEC — ${res.membre.nom}\n\n${res.erreur}\n`);
    console.log(res.ok ? `  OK  ${res.membre.nom} (${res.texte.length} car.)` : `  ECHEC ${res.membre.nom}`);
  }
} else if (RONDES >= 2 && POIDS === "legere") {
  console.log("Ronde 2 sautee : poids legere (ronde 1 seule, pont d'entree).");
}

writeFileSync(join(dirSortie, "MANIFEST.json"), JSON.stringify(manifeste, null, 2));
writeFileSync(join(dirSortie, "rapport-fragilite.md"),
  rapportFragilite({ resR1, resR2, dossier, dureeMs: Date.now() - debut, quorum: true }));
writeFileSync(join(dirSortie, "synthese.md"),
  syntheseGuidee({ resR1, resR2, dossier, nbSubstantiels: substantiels.length }));
console.log(`Termine (${Math.round((Date.now() - debut) / 1000)} s). Sorties : ${dirSortie}`);
console.log("Au président : vérifiez les points disputés par exécution, puis rédigez synthese.md (gabarit guidé déjà en place).");
}
