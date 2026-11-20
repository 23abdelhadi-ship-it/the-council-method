# The Council Method

**Ce projet ne génère pas de code et ne fait pas d'exécution multi-agents : plusieurs modèles de langage délibèrent sur vos fichiers techniques (code, décisions, recherches), chaque allégation classée [établi / inférence / proposition], un registre de décisions contraignant, et un président humain qui tranche par l'exécution, jamais au vote.**

Langues : [English](README.md) · [العربية](README.ar.md) · **Français** (ce fichier) · [Español](README.es.md) · [Português](README.pt.md)
Document de méthode : [العربية (source)](docs/METHODE.md) · [Français (source)](docs/METHODE.fr.md) · [English](docs/METHODE.en.md) · [Español](docs/METHODE.es.md) · [Português](docs/METHODE.pt.md)

> Un modèle seul donne un avis unique et confiant. S'il se trompe, rien ne vous le dit. The Council Method transforme la question en une petite institution de revue : une ronde indépendante, un débat anonymisé, et un président qui vérifie en exécutant — en usage réel depuis novembre 2026, sur des projets réels. Voici son édition publique.

## À lire avant d'installer — les attentes, nommées

- **Ce que c'est** : une méthode (documents, gabarits, règles) plus un moteur Node zéro dépendance qui l'exécute. Un seul fichier, aucun `npm install` : *installer, c'est télécharger*.
- **Ce que ce n'est pas** : ni une interface de discussion, ni un cadre d'agents, ni un générateur de code, ni un service hébergé. Il n'y a pas d'interface web et il n'y en aura pas.
- **Politique de maintenance — zéro, par conception** : publié **tel quel, version 1.1 fixe. Aucun traitement d'issues, aucune pull request.** Zéro maintenance = un contrat de stabilité, pas un abandon. Pour l'adapter : forkez. (Précédent documenté : une célèbre démo « council » en un fichier a atteint des dizaines de milliers d'étoiles avec exactement cette politique ; la maintenance communautaire est une dette que ce projet refuse dès le premier jour.)
- **À qui cela sert** : à un décideur dont les erreurs coûtent cher — un relecteur de code, de décisions, de plans ou de recherches, capable de lire des sorties et de vérifier des allégations. Cela n'ajoute rien aux questions rapides et simples.
- **Le président est humain** : le moteur ne produit aucun verdict. Si personne ne lit ni ne vérifie, vous obtenez plusieurs avis confiants au lieu d'un.
- **Vos clés, vos coûts** : les niveaux gratuits suffisent (une voie n'exige même aucune clé). Rien ici n'appelle « à la maison » ; vos fichiers ne vont qu'aux fournisseurs de modèles que vous configurez.

## Première session — zéro clé, environ 15 minutes

Requiert Node ≥ 20 (vérifié sur Node 20 et 24). Aucun compte, aucune clé, aucun coût : une voie sans clé intégrée fait siéger le conseil.

```bash
# 1. Récupérez les fichiers (téléchargez/forkez ce dépôt), puis :
node moteur/conseil.mjs --init        # installe brief.md, DECISIONS.md, REFERENCE.md depuis les gabarits guidés
# 2. Éditez ces trois fichiers pour votre projet (les gabarits expliquent quoi écrire)
node moteur/conseil.mjs --sujet "Revue de la proposition X" --source ./vos-fichiers/
# 3. Lisez revues/<date>_<sujet>/ — sorties brutes des membres, rapport de fragilité,
#    et gabarit guidé de synthese.md à compléter par le président
```

En option : `node moteur/conseil.mjs --assistant-cles` lance un assistant interactif qui demande fournisseur par fournisseur, **teste chaque clé en direct** et écrit lui-même la configuration. `node moteur/test-cles.mjs` donne un diagnostic en lecture seule de chaque siège (état + ligne de correction exacte). (Lecture seule = n'écrit rien ; il effectue bien des appels réseau en direct pour vérifier les sièges et peut consommer du quota.) `--dry-run` assemble le dossier sans aucun appel réseau. `--poids legere|standard|complete` choisit le poids de session (ci-dessous).

## Besoin → processus → résultat nommé

| Votre besoin | Le processus | Le résultat nommé que vous obtenez |
|---|---|---|
| Un second avis qui ne soit pas un écho | Ronde 1 : revues indépendantes, membres aveugles les uns aux autres | Points numérotés (F-01...) avec preuves (fichier:ligne) et classes d'allégations |
| Un désaccord utilisable, non moyenné | Ronde 2 : débat anonymisé par rotation | Accords/désaccords motivés ; un champ de synthèse **« désaccords préservés mot pour mot »** |
| Protéger vos décisions passées d'un contournement silencieux | Un registre de décisions contraignant, lu à chaque session | Toute proposition contraire est marquée « contraire à la décision enregistrée n° N » |
| Se protéger contre le conseil qui se cite lui-même | La règle anti-auto-citation nommée + étiquettes d'origine fixées à l'écriture | Une allégation ne devient [établi] que par une preuve extérieure au conseil |
| Une session qui a échoué en silence | La règle du quorum | Les sessions à moins de 3 réponses substantielles sont tamponnées **QUORUM_NON_ATTEINT** — des traces, pas un jugement |
| Savoir si le conseil avait raison | Le journal des résultats | Position + probabilité consignées à la clôture ; « ce qui s'est réellement passé » ajouté plus tard, sans réécriture |

## Ce qui le distingue — une comparaison structurelle figée

|  | Sujet revu | Gouvernance (qui tranche, comment) | Traçabilité | Forme de publication |
|---|---|---|---|---|
| llm-council (Karpathy) | Questions de discussion | Un modèle juge classe des réponses anonymisées | Classement ; ni classes d'allégations ni registre de décisions | Une application, zéro maintenance |
| Méthodologies de spécification (Spec Kit, BMAD) | Construire un logiciel à partir de spécifications | Le processus de spécification lui-même | Documents et gabarits ; pas de registre de décisions contraignant imposé au moment de la revue | Boîtes à outils avec lignes de versions et maintenance communautaire |
| **The Council Method** | **Vos fichiers techniques existants : code, décisions, recherches, plans** | **Un président humain, par l'exécution — jamais au vote** | **Classification d'allégations obligatoire + registre de décisions contraignant + étiquettes d'origine + règle de quorum** | **Documents de méthode + un fichier zéro dépendance ; zéro maintenance, par contrat** |

Aucun concurrent que nous ayons trouvé — dans un recensement complet des outils de délibération en conseil, pas un échantillon — ne combine les quatre : un registre de décisions contraignant, une classification d'allégations obligatoire, un président qui vérifie par l'exécution, et une règle de quorum de session.

## Poids de session

- **Légère** — pont d'entrée et démonstration : ronde 1 seule, format allégé, rigueur de classification entière.
- **Standard** — le défaut : format complet, deux rondes.
- **Complète** — audit : standard + rapport de fragilité détaillé + ligne coût/effort de session.

L'échelle proportionne l'effort à l'enjeu de la décision ; c'est une guidance documentée, pas une loi numérotée.

## Deux portes

1. **La méthode d'abord** (recommandé aux décideurs) : lisez `docs/METHODE.fr.md`, prenez les gabarits dans `docs/`, et faites siéger le conseil avec la compétence mono-hôte de `skills/` — le moteur est un exécutant optionnel qu'un intermédiaire technique peut opérer pour vous.
2. **Le moteur** : `moteur/conseil.mjs` automatise le protocole complet (assemblage du dossier avec empreintes, les deux rondes, tampons d'identité du modèle ayant réellement servi chaque réponse, tampon du quorum, rapport de fragilité, gabarit de synthèse guidé).

Une session d'exemple complète et entièrement fictive — personnes, entreprise et sujet inventés, sorties réelles du moteur — se trouve dans `examples/session-demo/`.

## Carte du dépôt

```
moteur/    conseil.mjs (le moteur) · test-cles.mjs (diagnostic des sièges, lecture seule) · config.exemple.json
docs/      METHODE en 5 langues · gabarits BRIEF / DECISIONS / REFERENCE / SYNTHESE
skills/    SKILL.md (compétence mono-hôte) · PROMPT.md (version prompt pour tout hôte de discussion)
examples/  session-demo/ — une session synthétique complète
revues/    vos sessions y atterrissent (créé à l'exécution, à garder ou à jeter)
```

## Licences

- **Code** (`moteur/`) : MIT — voir `LICENSE`.
- **Méthode et documents** (`docs/`, `skills/`, README) : CC BY 4.0 — voir `LICENSE-METHOD.md`. L'attribution est la paternité datée ; si vous réutilisez la méthode, nommez-la et liez-la.

*Règle de vocabulaire, contraignante pour les textes de ce projet lui-même : ceci est une revue et une délibération multi-modèles avec un seul exécutant humain — le terme « multi-agent » n'est jamais employé pour décrire ce projet.*
