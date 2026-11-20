// The Council Method — tests automatisés du moteur (zéro dépendance,
// node:test intégré). Aucun appel réseau : seuls la logique pure et
// l'assemblage sans effet de bord sont testés.
// Lancement :  node --test test/conseil.test.mjs
// (chemin explicite : un « node --test » nu découvrirait aussi
// moteur/test-cles.mjs, qui est un diagnostic réseau, pas un test.)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { lireConfig, construireMembres, substantiel, statutQuorum, lettre,
         classeErreur, slug, idDepuis, A_UNE_CLE, enteteMembre, sha256,
         rapportFragilite, MIN_SUBSTANTIEL } from "../moteur/conseil.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

// Purge l'environnement des clés connues pour des tests déterministes,
// puis le restaure tel quel.
const ENVS_CLES = ["GEMINI_API_KEY", "GITHUB_MODELS_TOKEN", "GITHUB_TOKEN",
  "OPENROUTER_API_KEY", "GROQ_API_KEY", "MISTRAL_API_KEY", "CEREBRAS_API_KEY",
  "HF_TOKEN", "NVIDIA_API_KEY", "COHERE_API_KEY", "SAMBANOVA_API_KEY",
  "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"];
function sansClesEnv() {
  const sauve = {};
  for (const k of ENVS_CLES) { sauve[k] = process.env[k]; delete process.env[k]; }
  return () => { for (const k of ENVS_CLES) {
    if (sauve[k] === undefined) delete process.env[k]; else process.env[k] = sauve[k]; } };
}

// ---------- configuration : analyse et validité ----------
test("config : sans aucune clé, les listes par défaut sont en place", () => {
  const restaurer = sansClesEnv();
  try {
    const cfg = lireConfig();
    assert.equal(A_UNE_CLE(cfg), false);
    assert.deepEqual(cfg.kiloModeles,
      ["kilo-auto/free", "inclusionai/ling-3.2-flash:free", "baidu/ernie-5.5-flash-preview:free"]);
    assert.equal(cfg.geminiModele, "gemini-3.6-flash");
    assert.ok(Array.isArray(cfg.openrouterModeles) && cfg.openrouterModeles.length >= 1);
  } finally { restaurer(); }
});

test("config : une clé d'environnement est lue et signale A_UNE_CLE", () => {
  const restaurer = sansClesEnv();
  try {
    process.env.GEMINI_API_KEY = "cle-fictive-de-test";
    const cfg = lireConfig();
    assert.equal(cfg.geminiKey, "cle-fictive-de-test");
    assert.equal(A_UNE_CLE(cfg), true);
  } finally { restaurer(); }
});

test("config : l'exemple versionné est un JSON valide sans aucune clé réelle", () => {
  const brut = readFileSync(join(ICI, "..", "moteur", "config.exemple.json"), "utf8");
  const cfg = JSON.parse(brut); // lève si invalide
  for (const [champ, v] of Object.entries(cfg))
    if (/Key$/.test(champ)) assert.equal(v, "", `${champ} doit rester vide dans l'exemple`);
  assert.equal(cfg.kiloModeles.length, 3);
});

test("membres : sans clé, seuls les 3 sièges Kilo (sans clé) sont construits", () => {
  const restaurer = sansClesEnv();
  try {
    const membres = construireMembres(lireConfig());
    assert.equal(membres.length, 3);
    assert.ok(membres.every(m => m.ligne.startsWith("Kilo")));
    assert.equal(new Set(membres.map(m => m.id)).size, 3); // ids uniques
    assert.ok(membres.every(m => typeof m.appel === "function" && m.modeleDeclare));
  } finally { restaurer(); }
});

test("membres : une clé Gemini ajoute ses sièges, ids toujours uniques", () => {
  const restaurer = sansClesEnv();
  try {
    process.env.GEMINI_API_KEY = "cle-fictive-de-test";
    const cfg = lireConfig();
    const membres = construireMembres(cfg);
    assert.equal(membres.filter(m => m.ligne === "Gemini API").length, cfg.geminiModeles.length);
    assert.equal(new Set(membres.map(m => m.id)).size, membres.length);
  } finally { restaurer(); }
});

// ---------- réponses substantielles et quorum ----------
const rep = (n, ok = true) => ({ ok, texte: "x".repeat(n) });

test("substantiel : seuil exact de caractères non blancs", () => {
  assert.equal(substantiel(rep(MIN_SUBSTANTIEL - 1)), false);
  assert.equal(substantiel(rep(MIN_SUBSTANTIEL)), true);
  assert.equal(substantiel(rep(MIN_SUBSTANTIEL + 500)), true);
  // les blancs ne comptent pas
  assert.equal(substantiel({ ok: true, texte: " ".repeat(5000) + "ab" }), false);
  // un échec n'est jamais substantiel, même long
  assert.equal(substantiel(rep(5000, false)), false);
});

test("quorum : moins de 3 réponses substantielles = QUORUM_NON_ATTEINT", () => {
  assert.equal(statutQuorum(0), "QUORUM_NON_ATTEINT");
  assert.equal(statutQuorum(1), "QUORUM_NON_ATTEINT");
  assert.equal(statutQuorum(2), "QUORUM_NON_ATTEINT");
  assert.equal(statutQuorum(3), "ATTEINT");
  assert.equal(statutQuorum(12), "ATTEINT");
});

test("quorum : comptage de bout en bout sur des résultats fabriqués", () => {
  const resR1 = [rep(900), rep(800), rep(120), rep(0, false), rep(700)];
  const nb = resR1.filter(substantiel).length;
  assert.equal(nb, 3);
  assert.equal(statutQuorum(nb), "ATTEINT");
  const nb2 = resR1.slice(0, 4).filter(substantiel).length;
  assert.equal(nb2, 2);
  assert.equal(statutQuorum(nb2), "QUORUM_NON_ATTEINT");
});

// ---------- lettres d'anonymisation (ronde 2) ----------
test("lettre : séquence A..Z puis AA, AB… (génération dynamique)", () => {
  assert.equal(lettre(0), "A");
  assert.equal(lettre(1), "B");
  assert.equal(lettre(25), "Z");
  assert.equal(lettre(26), "AA");
  assert.equal(lettre(27), "AB");
  assert.equal(lettre(51), "AZ");
  assert.equal(lettre(52), "BA");
});

test("lettre : aucune collision sur 1000 indices", () => {
  const vues = new Set();
  for (let i = 0; i < 1000; i++) vues.add(lettre(i));
  assert.equal(vues.size, 1000);
});

test("lettre : la rotation de la ronde 2 n'attribue jamais deux fois la même lettre", () => {
  // Réplique l'usage du moteur : pour le membre d'indice `moi`, les autres
  // reçoivent lettre(k + moi), k = 0..n-2. Aucun doublon, pour tout panel.
  for (let n = 2; n <= 40; n++)
    for (let moi = 0; moi < n; moi++) {
      const attribuees = new Set();
      for (let k = 0; k < n - 1; k++) attribuees.add(lettre(k + moi));
      assert.equal(attribuees.size, n - 1, `collision : n=${n}, moi=${moi}`);
    }
});

// ---------- identité du modèle servi (déclaration des membres) ----------
const membreFactice = (id, declare) => ({ id, ligne: "Ligne test", modeleDeclare: declare, nom: `Test (${declare})` });

test("en-tête membre : provenance figée, déclaré et servi y sont inscrits", () => {
  const res = { membre: membreFactice("kilo-auto-free", "kilo-auto/free"), ok: true,
                texte: "revue", modeleServi: "un-modele-reel" };
  const entete = enteteMembre(res, 1);
  assert.match(entete, /provenance figee a l'ecriture/);
  assert.match(entete, /MODELE_DECLARE: kilo-auto\/free/);
  assert.match(entete, /MODELE_SERVI: un-modele-reel/);
  assert.match(entete, /RONDE: 1/);
});

test("en-tête membre : modèle servi non renseigné par la voie = mention explicite", () => {
  const res = { membre: membreFactice("m1", "mod-a"), ok: true, texte: "revue", modeleServi: null };
  assert.match(enteteMembre(res, 2), /MODELE_SERVI: \(non renseigne par la voie\)/);
});

test("rapport de fragilité : un écart déclaré/servi est nommé, sinon « aucun écart »", () => {
  const dossier = { tronque: false, exclus: [], plusGros: [] };
  const base = { resR2: null, dossier, dureeMs: 1000, quorum: true };
  const conforme = { membre: membreFactice("m1", "mod-a"), ok: true, texte: "x".repeat(600), modeleServi: "mod-a" };
  const devie = { membre: membreFactice("m2", "mod-b"), ok: true, texte: "x".repeat(600), modeleServi: "autre-modele" };
  const avecEcart = rapportFragilite({ ...base, resR1: [conforme, devie] });
  assert.match(avecEcart, /\*\*m2\*\* : déclaré « mod-b », servi « autre-modele »/);
  const sansEcart = rapportFragilite({ ...base, resR1: [conforme] });
  assert.match(sansEcart, /Aucun écart mesurable/);
});

// ---------- utilitaires ----------
test("classeErreur : classes d'échec reconnues", () => {
  assert.equal(classeErreur("HTTP 429: limite"), "429 (saturation/quotas)");
  assert.equal(classeErreur("HTTP 413: trop grand"), "413 (dossier trop grand pour la voie)");
  assert.equal(classeErreur("HTTP 404: introuvable"), "4xx (voie ou modele indisponible)");
  assert.equal(classeErreur("HTTP 503: down"), "5xx (fournisseur)");
  assert.equal(classeErreur("The operation was aborted"), "timeout");
  assert.equal(classeErreur("quelque chose d'inclassable"), "autre");
});

test("idDepuis et slug : formes stables", () => {
  assert.equal(idDepuis("nvidia/nemotron-3-ultra-550b-a55b:free"), "nemotron-3-ultra-550b-a55b-free");
  assert.equal(idDepuis("glm-4.5-flash"), "glm-4-5-flash");
  assert.equal(slug("Revue de la Proposition X !"), "revue-de-la-proposition-x");
});

test("sha256 : déterministe, sensible au contenu", () => {
  assert.match(sha256("abc"), /^[0-9a-f]{64}$/);
  assert.equal(sha256("abc"), sha256("abc"));
  assert.notEqual(sha256("abc"), sha256("abd"));
});
