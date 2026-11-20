# Exemple de session — ENTIÈREMENT SYNTHÉTIQUE

**Tout ici est fictif** : la « Coopérative Amal des Dattes », la
commune de Tazert, ses 14 membres, ses chiffres (38,2 t, 340 kg,
18 000 / 120 000), ses trois décisions internes et sa proposition
d'informatisation ont été inventés pour cette démonstration. Aucune
personne, entreprise ou institution réelle n'est décrite.

**Ce qui est réel** : les sorties. Les fichiers de `outputs/` sont les
produits bruts d'une exécution réelle du moteur public de ce dépôt
(`moteur/conseil.mjs`), le 2026-11-20, sur les entrées de `inputs/`,
avec les lignes gratuites configurées par l'opérateur du test. La
synthèse du président (`outputs/synthese.md`) a été rédigée par un
président humain à partir de ces sorties, selon la procédure de la
méthode — y compris deux arbitrages par vérification directe :

1. un membre a « désapprouvé » en ronde 2 au motif que les fichiers
   sources n'avaient « pas été fournis » : le MANIFEST prouve le
   contraire (il avait mal lu un nom de fichier) — désaccord conservé
   mot pour mot dans la synthèse, puis écarté par la preuve ;
2. le siège « kilo-auto » a été servi par un modèle différent du
   modèle déclaré : l'en-tête d'identité figée à l'écriture et le
   rapport de fragilité le montrent.

## Contenu

```
inputs/    brief.md · DECISIONS.md · REFERENCE.md   (fichiers racine fictifs)
           dossier/presentation.md · dossier/proposition.md
outputs/   r1-<membre>.md ×20   ronde 1 (10 réponses substantielles, 10 échecs tracés)
           r2-<membre>.md ×10   ronde 2 (7 débats substantiels)
           MANIFEST.json        empreintes du dossier, statuts, quorum : ATTEINT
           rapport-fragilite.md échecs par classe, écarts d'identité déclaré/servi
           synthese.md          la synthèse du président (remplace le gabarit généré)
```

## Chiffres de la session

- Durée totale : 360 s (20 membres, configuration complète de
  l'opérateur — la voie zéro clé seule est plus légère).
- Réponses substantielles en ronde 1 : 10/20 — quorum atteint
  (règle : ≥ 3, sinon la session est tamponnée QUORUM_NON_ATTEINT et
  ne produit ni ronde 2 ni synthèse).
- Échecs nommés dans le rapport de fragilité : quotas (402/429),
  modèle introuvable (404), service local absent — aucun n'est
  maquillé ; c'est le fonctionnement normal des lignes gratuites.

Pour reproduire : copiez `inputs/brief.md`, `inputs/DECISIONS.md` et
`inputs/REFERENCE.md` à la racine d'un dossier de travail, puis
`node moteur/conseil.mjs --init` n'est même pas nécessaire —
lancez `node moteur/conseil.mjs --sujet "Informatiser les stocks de
la coopérative Amal ?" --source <dossier>` avec `inputs/dossier/`
comme source.
