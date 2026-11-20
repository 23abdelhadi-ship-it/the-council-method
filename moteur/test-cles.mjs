#!/usr/bin/env node
// The Council Method — diagnostic des sièges du conseil (LECTURE SEULE).
// Un appel minimal par fournisseur configuré + la voie sans clé (Kilo).
// Pour chaque siège : l'état, et en cas de problème la ligne de correction
// exacte. Ne modifie rien, n'écrit rien, et n'affiche JAMAIS les clés.
// Lecture seule = ne modifie rien ; mais il effectue des appels réseau
// en direct pour vérifier les sièges et peut consommer du quota.
// Usage : node moteur/test-cles.mjs
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const cfg = {};
const p = join(ICI, "config.json");
if (existsSync(p)) { try { Object.assign(cfg, JSON.parse(readFileSync(p, "utf8"))); } catch { console.log("config.json : ILLISIBLE (JSON invalide) — corrigez le fichier ou supprimez-le."); } }
const ENV = { geminiKey: "GEMINI_API_KEY", openrouterKey: "OPENROUTER_API_KEY", groqKey: "GROQ_API_KEY",
  mistralKey: "MISTRAL_API_KEY", cerebrasKey: "CEREBRAS_API_KEY", cohereKey: "COHERE_API_KEY",
  sambanovaKey: "SAMBANOVA_API_KEY", hfKey: "HF_TOKEN", nvidiaKey: "NVIDIA_API_KEY",
  githubToken: "GITHUB_MODELS_TOKEN" };
for (const [champ, env] of Object.entries(ENV)) if (process.env[env]) cfg[champ] = process.env[env];
if (process.env.CLOUDFLARE_API_TOKEN) cfg.cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
if (process.env.CLOUDFLARE_ACCOUNT_ID) cfg.cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;

const PROMPT = "Reponds uniquement: OK";
let ok = 0, echecs = 0, absents = 0;
async function testSiege(nom, champ, present, fn) {
  if (!present) {
    absents++;
    console.log(`${nom} => ABSENT — correction : ajoutez "${champ}" dans moteur/config.json (via --assistant-cles) ou export ${ENV[champ] || champ}=…`);
    return;
  }
  try { const r = await fn(); ok++; console.log(`${nom} => OK : ${String(r).slice(0, 70).replace(/\n/g, " ")}`); }
  catch (e) {
    echecs++;
    const msg = String(e.message || e).slice(0, 200);
    const fix = /HTTP 401|HTTP 403/.test(msg) ? "clé refusée — régénérez-la chez le fournisseur, ou remplacez-la via --assistant-cles"
      : /HTTP 429/.test(msg) ? "voie saturée ou quotas épuisés — réessayez plus tard, le siège est probablement sain"
      : "vérifiez la connexion et le nom du modèle dans la configuration";
    console.log(`${nom} => ECHEC : ${msg}\n     correction : ${fix}`);
  }
}
async function chat(base, cle, modele) {
  const r = await fetch(base.replace(/\/$/, "") + "/chat/completions", { method: "POST",
    headers: { "Content-Type": "application/json", ...(cle ? { Authorization: `Bearer ${cle}` } : {}) },
    body: JSON.stringify({ model: modele, max_tokens: 8, messages: [{ role: "user", content: PROMPT }] }) });
  const t = await r.text(); if (!r.ok) throw new Error(`HTTP ${r.status} ${t.slice(0, 150)}`);
  return JSON.parse(t).choices?.[0]?.message?.content || "(reponse vide)";
}
async function gemini(cle, modele) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
    { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": cle },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT }] }] }) });
  const t = await r.text(); if (!r.ok) throw new Error(`HTTP ${r.status} ${t.slice(0, 150)}`);
  return JSON.parse(t).candidates?.[0]?.content?.parts?.map(x => x.text || "").join("") || "(reponse vide)";
}

const premier = (liste, defaut) => (Array.isArray(liste) && liste.length ? liste[0] : defaut);

// Voie sans clé : toujours testée — c'est le siège garanti du conseil.
for (const m of (cfg.kiloModeles || ["kilo-auto/free", "inclusionai/ling-3.2-flash:free", "baidu/ernie-5.5-flash-preview:free"]))
  await testSiege(`Kilo sans cle (${m})`, "kiloModeles", true, () => chat("https://api.kilo.ai/api/gateway", null, m));

if (!cfg.geminiKey)
  await testSiege("Gemini API", "geminiKey", false, () => gemini(cfg.geminiKey, "gemini-3.6-flash"));
else for (const mod of (cfg.geminiModeles || ["gemini-3.6-flash"]).slice(0, 3))
  await testSiege(`Gemini API (${mod})`, "geminiKey", true, () => gemini(cfg.geminiKey, mod));
await testSiege(`OpenRouter (${premier(cfg.openrouterModeles, "nvidia/nemotron-3-ultra-550b-a55b:free")})`, "openrouterKey", !!cfg.openrouterKey,
  () => chat("https://openrouter.ai/api/v1", cfg.openrouterKey, premier(cfg.openrouterModeles, "nvidia/nemotron-3-ultra-550b-a55b:free")));
await testSiege(`Groq (${premier(cfg.groqModeles, "openai/gpt-oss-120b")})`, "groqKey", !!cfg.groqKey,
  () => chat("https://api.groq.com/openai/v1", cfg.groqKey, premier(cfg.groqModeles, "openai/gpt-oss-120b")));
await testSiege(`Mistral (${premier(cfg.mistralModeles, "codestral-latest")})`, "mistralKey", !!cfg.mistralKey,
  () => chat("https://api.mistral.ai/v1", cfg.mistralKey, premier(cfg.mistralModeles, "codestral-latest")));
await testSiege(`Cerebras (${premier(cfg.cerebrasModeles, "qwen-3-235b-a22b-instruct-2507")})`, "cerebrasKey", !!cfg.cerebrasKey,
  () => chat("https://api.cerebras.ai/v1", cfg.cerebrasKey, premier(cfg.cerebrasModeles, "qwen-3-235b-a22b-instruct-2507")));
await testSiege(`Cohere (${premier(cfg.cohereModeles, "command-a-03-2025")})`, "cohereKey", !!cfg.cohereKey,
  () => chat("https://api.cohere.ai/compatibility/v1", cfg.cohereKey, premier(cfg.cohereModeles, "command-a-03-2025")));
await testSiege(`SambaNova (${premier(cfg.sambanovaModeles, "Meta-Llama-3.3-70B-Instruct")})`, "sambanovaKey", !!cfg.sambanovaKey,
  () => chat("https://api.sambanova.ai/v1", cfg.sambanovaKey, premier(cfg.sambanovaModeles, "Meta-Llama-3.3-70B-Instruct")));
await testSiege(`HuggingFace (${premier(cfg.hfModeles, "meta-llama/Llama-3.3-70B-Instruct")})`, "hfKey", !!cfg.hfKey,
  () => chat("https://router.huggingface.co/v1", cfg.hfKey, premier(cfg.hfModeles, "meta-llama/Llama-3.3-70B-Instruct")));
await testSiege(`NVIDIA (${premier(cfg.nvidiaModeles, "deepseek-ai/deepseek-r1")})`, "nvidiaKey", !!cfg.nvidiaKey,
  () => chat("https://integrate.api.nvidia.com/v1", cfg.nvidiaKey, premier(cfg.nvidiaModeles, "deepseek-ai/deepseek-r1")));
await testSiege(`Z.AI (${premier(cfg.zaiModeles, "glm-4.5-flash")})`, "zaiKey", !!cfg.zaiKey,
  () => chat("https://api.z.ai/api/paas/v4", cfg.zaiKey, premier(cfg.zaiModeles, "glm-4.5-flash")));
if (cfg.freellmapiUrl)
  await testSiege(`FreeLLMAPI (local) (${cfg.freellmapiModele || "auto"})`, "freellmapiUrl", true,
    () => chat(cfg.freellmapiUrl, cfg.freellmapiKey || "freellmapi", cfg.freellmapiModele || "auto"));
if (cfg.cloudflareToken && cfg.cloudflareAccountId)
  await testSiege(`Cloudflare (${premier(cfg.cloudflareModeles, "@cf/meta/llama-3.3-70b-instruct-fp8-fast")})`, "cloudflareToken", true,
    () => chat(`https://api.cloudflare.com/client/v4/accounts/${cfg.cloudflareAccountId}/ai/v1`, cfg.cloudflareToken, premier(cfg.cloudflareModeles, "@cf/meta/llama-3.3-70b-instruct-fp8-fast")));

console.log(`\nBilan : ${ok} siège(s) OK, ${echecs} échec(s), ${absents} absent(s) (un absent n'empêche pas le conseil : la voie Kilo suffit).`);
console.log("Règle de session : moins de 3 réponses substantielles = QUORUM_NON_ATTEINT (voir docs/METHODE.md).");
