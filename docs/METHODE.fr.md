# The Council Method — la méthode (version publique)

> **Définition en une ligne** : plusieurs modèles de langage délibèrent sur vos fichiers techniques (code, décisions, recherches) en deux rondes — indépendante puis débat anonymisé — avec classification obligatoire de chaque allégation, un registre de décisions contraignant, et un président humain unique qui tranche par l'exécution, jamais au vote.

**Règle de vocabulaire contraignante, dans tous les textes du projet et dans toutes les langues** : le mot « multi-agent » (multi-agent) n'est jamais employé pour décrire ce projet. Ce projet est une **revue et une délibération multi-modèles** avec un seul exécutant humain (le président) — pas une exécution multi-agents. `The Council Method` est un nom propre, intraduisible ; `QUORUM_NON_ATTEINT` est une étiquette technique conservée telle quelle dans toutes les langues.

L'arabe et le français sont les langues sources de cette doctrine ; les autres versions en sont des traductions fidèles.

---

## 1. Pourquoi un conseil ?

Un modèle seul donne un avis unique et confiant ; s'il se trompe, vous ne le saurez pas : pas de seconde voix, pas d'opposition, pas de mémoire de ce que vous avez déjà décidé. Le conseil transforme la question en une petite institution de revue : un brief unique au format imposé, une ronde indépendante où les membres ne se voient pas, une ronde de débat anonymisé où chacun attaque les points des autres sans connaître leurs auteurs, puis un président humain qui vérifie par l'exécution et rédige la synthèse.

**Le consensus est un piège** : quand les modèles s'accordent facilement, ils apparient le plus souvent la même réponse standard. Le signal utile est **le désaccord** — où les modèles divergent, et pourquoi. La synthèse conserve donc les désaccords mot pour mot au lieu de les dissoudre dans une moyenne.

## 2. Composition et rôles

- **Les membres** : des modèles de familles différentes (la diversité est une condition ; un conseil fait d'un seul modèle à rôles multiples est une simulation, pas un conseil). Les niveaux gratuits suffisent pour commencer ; le silence technique d'un membre (quotas, délais, erreur serveur) est documenté, jamais masqué.
- **Le président** : un humain, unique. Il conduit la session, lit toutes les sorties, vérifie les points disputés **par l'exécution** ou dans la source primaire, et rédige la synthèse de sa propre voix. Il n'est pas remplacé par une synthèse automatique et ne tranche jamais au vote.
- **L'utilisateur (le décideur)** : ses décisions antérieures contraignent le conseil (section 3) ; ce dont le président n'est pas sûr lui est demandé, et sa réponse devient la base adoptée.

## 3. Les fichiers sur lesquels travaille le conseil

| Fichier | Fonction |
|---|---|
| `brief.md` — le brief permanent | Le format de réponse imposé et les règles contraignantes pour les membres (gabarit : `docs/BRIEF_TEMPLATE.md`) |
| `DECISIONS.md` — le registre des décisions | Les décisions contraignantes de l'utilisateur. Toute proposition d'un membre qui contredit une décision enregistrée est marquée explicitement : « proposition contraire à la décision enregistrée n° N » — elle ne passe jamais en silence, et une proposition ne devient décision que par la parole de l'utilisateur |
| `REFERENCE.md` — la référence | La seule référence dans le périmètre de la revue ; aucune autre version n'est supposée exister |
| Le dossier de session | Les fichiers texte soumis à la revue, assemblés avec une empreinte (SHA-256) par fichier et une empreinte globale |
| `synthese.md` — la synthèse | La sortie du seul président, sur gabarit guidé (index, procédure pas à pas, champs obligatoires) |

**Étiquette d'origine** : chaque sortie de session porte, au moment de son écriture, une étiquette d'origine (membre/président/humain) **fixée à la création et que l'édition ne change jamais** — voir la règle de la section 6.

Et parce que de simples fichiers dans un dépôt sont tout ce qui survit, le brief porte un champ explicite : **« état actuel / prochaine action »** — les spécifications seules ne montrent pas où le travail s'est arrêté.

## 4. Les deux rondes

### Ronde 1 — indépendante
Chaque membre relit le dossier seul, en points numérotés (F-01, F-02...), chaque point : titre court / gravité / preuve (fichier:ligne) / classification de l'allégation / correction proposée s'il y en a. **Chaque réponse commence par une ligne de déclaration d'identité** : le modèle que le membre croit être. Et le moteur tamponne chaque réponse du modèle qui l'a **réellement servie** (lu dans les métadonnées de la réponse) et signale tout écart entre le déclaré et le servi dans le rapport de fragilité — l'usurpation d'identité d'un modèle dans un conseil est documentée, et seuls ces deux lignes la révèlent.

### Ronde 2 — débat anonymisé par rotation
Chaque membre reçoit les points des autres sous des lettres anonymes **générées dynamiquement et tournées d'un lecteur à l'autre** (aucune lettre ne désigne le même modèle pour deux lecteurs). Pour chaque point : accord ou désaccord + motif précis tiré du texte. Puis une seule section : « les points que je maintiens ».

### Pourquoi deux rondes seulement ?
Parce qu'un long débat épuise au lieu de convaincre : après environ trois rondes, les modèles opposants commencent à capituler par « politesse d'épuisement », non par conviction (Xiong et al., 2025). Le plafond de deux rondes est une règle de méthode, pas une limite technique. Pour la même raison, les verdicts « passe/bloque, avec motif » sont préférés aux notes numériques, qui dérivent au fil des rondes.

## 5. Classification des allégations — obligatoire

Chaque allégation, dans toute réponse, est classée dans l'une de ces trois catégories :

- **[établi]** : elle a une preuve hors du conseil (fichier:ligne, exécution, document, registre). La sortie d'un autre membre n'est **pas** une preuve.
- **[inférence]** : un raisonnement à partir d'éléments établis, dont la base est énoncée.
- **[proposition]** : un avis ou une recommandation ; jamais consignée comme si c'était une décision.

Et ce qui ne peut pas être vérifié à partir du texte est marqué explicitement : **[non vérifiable à partir du texte]**. Pas de préambules littéraires ni de louanges dans les réponses des membres.

## 6. La règle anti-auto-citation (nommée)

> **La sortie de tout membre est une hypothèse en cours d'examen ; elle ne devient [établi] que par une preuve extérieure au conseil.**

L'échec que cette règle nomme est documenté chez les praticiens : un système cite des notes générées par des membres antérieurs, si bien que les réponses semblent « de mieux en mieux sourcées » avec le temps alors qu'elles se citent elles-mêmes. Les deux mécanismes de réparation adoptés ici :

1. **L'étiquette d'origine à l'écriture** (section 3) : chaque élément porte son origine (humain/membre/président) fixée au moment de sa création, et l'édition ne la change pas.
2. **Deux contrôles distincts pour chaque preuve citée** dans la synthèse : (a) **étaye-t-elle l'allégation** réellement ? (b) **traite-t-elle la question** réellement posée ? — car une citation réelle mais hors sujet est un échec distinct d'une citation fabriquée.

## 7. Seuil de validité de session — la règle du quorum

Une session valide réunit **au moins 3 réponses substantielles** à sa première ronde (une réponse substantielle : réussie et dotée d'un contenu réel — pas un message d'erreur ni une ligne unique). En dessous :

- la session est marquée **`QUORUM_NON_ATTEINT`** automatiquement dans son manifeste (MANIFEST) et dans un fichier dédié ;
- pas de ronde 2, pas de synthèse — les sorties brutes restent des traces lisibles, mais **ne sont pas présentées comme un jugement du conseil** ;
- le remède est une relance (dossier plus petit, autres voies, clés supplémentaires), pas une conclusion tirée d'une session incomplète.

## 8. Poids de session (guidance documentée, pas de seuils-lois)

- **Légère** — pont d'entrée et démonstration : ronde 1 seule, format allégé avec moins de points, rigueur de classification entière. Sert à présenter la méthode et aux petites questions.
- **Standard** — le défaut : format F complet et deux rondes.
- **Complète** — audit : standard + rapport de fragilité détaillé + ligne coût/effort de session (comptée en appels, échecs et durée, non en demandes isolées ; sur voies payantes, le coût du juge/de l'évaluation apparaît en ligne séparée, jamais fondu dans un total).

L'échelle est une guidance pour proportionner l'effort à l'enjeu de la décision — pas une loi numérotée qui interdise ou impose une session.

## 9. La synthèse du président et la vérification par l'exécution

La valeur se fabrique ici, pas dans les rondes. Procédure du président :

1. Lire toutes les réponses de la ronde 1, puis les débats de la ronde 2.
2. Pour chaque point disputé : **vérifier par l'exécution** (lancer, comparer, reproduire) ou revenir à la source primaire. Jamais d'arbitrage au vote ni à la majorité.
3. Remplir le gabarit de synthèse, dont les deux champs obligatoires nommés : **« désaccords préservés mot pour mot »** (les positions minoritaires dans leurs propres termes, pas une moyenne dissoute) et **« le contexte manquant qui a causé le désaccord »** (ce qui manquait au dossier et a produit le désaccord — à demander à l'utilisateur ensuite plutôt qu'à le deviner).
4. Appliquer les deux contrôles (section 6) à chaque allégation conservée dans la synthèse.
5. Clore par le journal des résultats (section 10).

La charge de lecture est le vrai goulot d'étranglement du président ; les réponses sont donc construites sur des pointeurs vérifiables ponctuellement (fichier:ligne), pas sur des murs de texte.

## 10. Le journal des résultats

Chaque session se clôt, dans sa synthèse, par deux lignes : **la position adoptée** et **la probabilité estimée**. Quand le réel tranche plus tard, une troisième ligne est ajoutée — **« ce qui s'est réellement passé »** — sans jamais réécrire la position d'origine. Le registre des décisions cesse ainsi d'être une archive pour devenir un instrument de calibration cumulatif : le conseil est consigné, puis noté par le réel.

## 11. Doctrine générale (pourquoi ceci est-il difficile à copier ?)

- **L'usage avant l'outil ; la profondeur avant l'élargissement ; l'exécution avant le guide.** Une idée nouvelle est d'abord mise en œuvre avec les outils actuels ; passer à un nouvel outil est une exception qui exige une justification écrite.
- **Le test du fossé en cinq questions** pour toute étape future (publication, partenariat, fonctionnalité) : passe-t-elle les questions de **l'impact, du rattrapage, du contournement, de la durabilité, de la rétention** ? Ce qui échoue est une couche copiable : elle est donnée délibérément, sa paternité est datée, et aucune protection n'est bâtie dessus.
- **Le noyau qui n'est pas donné**, dans ses concepts généraux : des données d'exploitation accumulées dans le temps, un réseau de confiance qui ne s'achète pas, la permission d'une partie qui vous choisit, un coût de changement réel chez ceux qui vous ont adopté, et un corpus de jugements (registre de décisions et synthèses) que nul autre ne possède.
- **Rituels** : un radar d'usages périodique qui demande « quel usage nouveau pour notre travail réel ? » et non « quel outil nouveau ? » ; et une auto-revue périodique qui demande : qu'avons-nous accumulé qui ne se copie pas ? Un cycle qui ne produit que des couches copiables est un cycle raté, quelle que soit sa production.
- Le conseil juge **la recherche, les plans et les faits — jamais la prose**. Les textes destinés aux humains sont d'une seule voix d'auteur, contrôlés ensuite au niveau des citations, des chiffres et des dates uniquement.

## 12. Limites de la méthode, honnêtement

- Elle n'ajoute rien aux questions rapides et simples ; sa valeur apparaît là où le coût d'une erreur dépasse le coût de la session.
- **La roulette des fournisseurs** est réelle : les probabilités d'échec de chaque étape se multiplient au fil des phases. Ses parades adoptées : réessayer à la frontière de l'étape plutôt que relancer le tout, et un rapport de fragilité par session qui agrège les échecs classés (quotas/taille/délais/réseau) au lieu de les découvrir épars.
- Le conseil amplifie le jugement du président, il ne le remplace pas : sans président qui lit et vérifie, c'est cinq avis confiants au lieu d'un.
- Aucun secret dans le dossier, jamais : les clés et les secrets restent toujours hors des fichiers, et le fichier de configuration local n'est ni publié ni poussé vers aucun dépôt.

---

## Annexe A — Protocole d'évaluation « le conseil contre un modèle unique » (D-10)

Une demande récurrente des praticiens ; voici sa forme exécutable, pour quiconque veut tester par lui-même que le conseil ajoute quelque chose :

1. Prenez environ **20 tâches** réelles de votre travail (revues, décisions, plans) déjà tranchées ou pouvant l'être.
2. Faites tourner les deux parties sur **exactement les mêmes preuves** : (a) un modèle fort unique avec une liste de contrôle structurée ; (b) un conseil standard selon cette méthode.
3. Comparez **l'exactitude des verdicts** (le jugement final correspond-il à ce que le réel/la référence a établi ?) — pas le taux d'accord entre les deux parties, car un accord peut être un aveuglement partagé.
4. Consignez aussi : le coût (appels et temps du président) de chaque partie, et le nombre d'erreurs attrapées par l'une et manquées par l'autre.
5. Publiez le résultat tel quel, y compris si le conseil perd.

## Annexe B — Terminologie unifiée entre les langues

| Concept | Arabe | Français | Anglais | Espagnol | Portugais |
|---|---|---|---|---|---|
| Nom du projet | The Council Method | The Council Method | The Council Method | The Council Method | The Council Method |
| Le président | الرئيس | le président | the chair | el presidente | o presidente |
| Le membre | العضو | le membre | the member | el miembro | o membro |
| La ronde | الجولة | la ronde | the round | la ronda | a rodada |
| Le brief | الإحاطة | le brief | the brief | el brief | o brief |
| Le registre des décisions | سجلّ القرارات | le registre des décisions | the decisions register | el registro de decisiones | o registro de decisões |
| La synthèse | التوليف | la synthèse | the synthesis | la síntesis | a síntese |
| Allégation établie | [مثبت] | [établi] | [Verified] | [Verificado] | [Verificado] |
| Inférence | [استنتاج] | [inférence] | [Inference] | [Inferencia] | [Inferência] |
| Proposition | [اقتراح] | [proposition] | [Proposal] | [Propuesta] | [Proposta] |
| Étiquette de quorum | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT |
