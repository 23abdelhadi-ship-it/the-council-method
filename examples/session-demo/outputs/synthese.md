# Synthèse du président — Informatiser les stocks de la coopérative Amal ?

> **Session de démonstration, entièrement fictive** (coopérative,
> personnes, chiffres et décisions inventés — voir `../README.md`).
> Cette synthèse est le travail réel du président sur les sorties
> réelles du moteur, dans ce dossier : les points ci-dessous renvoient
> aux fichiers `r1-*.md` et `r2-*.md` voisins, vérifiables un à un.
> Le moteur avait laissé ici un gabarit guidé ; le président l'a
> remplacé par cette synthèse rédigée — c'est exactement l'étape que
> la méthode réserve à l'humain.

Session : 20 membres consultés (ronde 1) · **10 réponses
substantielles** · quorum **ATTEINT** · ronde 2 : 10 membres invités,
7 débats substantiels · durée 360 s.

## Faits vérifiés par le président (par exécution, pas par vote)

1. **Le seuil de la Décision 2 tranche la question de procédure.**
   Vérifié dans `inputs/` : DECISIONS.md fixe 50 000 ; la proposition
   chiffre B à ≈18 000 et C à ≈120 000. Donc : B peut être engagé par
   le bureau ; **C exige l'accord préalable de l'assemblée générale**.
   Plusieurs membres l'ont marqué dans les termes du brief :
   « proposition contraire à la décision enregistrée n° 2 » si le
   bureau engageait C seul. [établi — fichiers cités par les membres
   et re-vérifiés par le président]
2. **La Décision 3 (registre papier maintenu) est respectée par B,
   passée sous silence par C.** B le prévoit explicitement ; le texte
   de C n'en dit rien (F-02 du membre kilo-ernie, re-vérifié ligne à
   ligne). C est donc incomplet, pas seulement cher.
3. **Aucune option ne traite la cause des 340 kg d'écarts
   inexpliqués** (F-03, repris en ronde 2 sans contradiction) : les
   trois options améliorent l'enregistrement ou la détection, aucune
   n'analyse la cause (mesure ? saisie ? disparition ?).
4. **Le contrôle croisé de l'Option A ne détecte que les erreurs de
   transcription** (le tableur transcrit le registre — F-04) ; il ne
   voit pas les écarts physiques, qui relèvent de l'inventaire du
   vendredi (Décision 1).
5. **Le problème de réservation** (livraison retardée : stock « déjà
   réservé » cru disponible) **n'est traité explicitement que par
   C**. Que le logiciel de B — **non nommé** dans la proposition —
   gère les réservations est [non vérifiable à partir du texte]
   (F-05). C'est la question ouverte n° 1.

## Désaccords préservés (texte intégral, non moyennés)

Le membre **openrouter-north-mini-code** a marqué en ronde 2 des
désaccords répétés, au motif littéral : « ne peut pas être vérifié à
partir du texte ; **proposal.md n'est pas fourni** » (et de même pour
« presentation.md »).

**Arbitrage du président, par exécution** : le motif est factuellement
faux. Le MANIFEST de session (dans ce dossier) empreinte exactement
deux fichiers sources : `presentation.md` et `proposition.md` — le
membre a cherché un nom de fichier légèrement différent
(« proposal.md ») et conclu à l'absence. Ses désaccords fondés sur ce
motif sont écartés ; son accord sur le seuil de la Décision 2, lui,
est correctement prouvé et il est conservé. *C'est à cela que sert le
président : ce désaccord n'aurait jamais dû être « moyenné » avec les
accords documentés des autres membres — il devait être vérifié, et
il ne survit pas à la vérification.*

## Contexte manquant ayant causé le désaccord

- Le nom du fichier source (`proposition.md`) n'était pas rappelé
  dans le prompt de ronde 2 : les membres y reçoivent les points des
  autres, pas la liste des fichiers. Le désaccord ci-dessus naît de
  ce manque, pas d'un différend de fond. (Leçon consignée pour le
  gabarit de brief : rappeler les noms exacts des fichiers du dossier
  dans les instructions de ronde 2.)
- Le logiciel envisagé pour l'Option B n'est nommé nulle part : c'est
  le manque qui rend le point « réservations » invérifiable.

## Double contrôle (règle anti-auto-citation)

| Allégation retenue | Répond à la question posée ? | Appuyée par une preuve hors conseil ? |
|---|---|---|
| C exige l'accord de l'AG (Décision 2) | Oui — c'est la procédure d'adoption | Oui — DECISIONS.md + chiffres de la proposition, re-lus par le président |
| B respecte la Décision 3, C est muet | Oui | Oui — textes comparés ligne à ligne |
| « Les fichiers sources n'ont pas été fournis » | Non — hors question | **Non — réfutée par le MANIFEST** |
| B règle le problème de réservation | Oui | Non — logiciel non nommé : reste [non vérifiable] |

Aucune allégation de membre n'a été promue [établi] sur la seule foi
d'un autre membre.

## Note d'identité (D-08)

Le siège « kilo-auto/free » a été **servi par un autre modèle que
déclaré** : en-tête figée à l'écriture — déclaré `kilo-auto/free`,
servi `reflection/beam-free` (voir MANIFEST et `rapport-fragilite.md`).
Sa réponse est comptée comme réponse de membre, mais le président
sait quel modèle l'a réellement produite. 10 des 20 sièges ont échoué
ou saturé en ronde 1 (402, 404, 429, service local absent) : le
rapport de fragilité les nomme un à un — la session reste valide
parce que le quorum est atteint sur des familles diverses.

## Conclusion du président (pour le bureau fictif)

- **Option B : adoptable par le bureau dès maintenant**, à deux
  conditions préalables : (1) nommer le logiciel et vérifier qu'il
  gère les réservations, sinon le retard de livraison se reproduira ;
  (2) ajouter une sauvegarde externe des données (PC unique = point
  de défaillance unique, F-07).
- **Option C : ne peut pas être engagée par le bureau** (Décision 2).
  Si l'assemblée générale la souhaite : devis détaillé, clause de
  maintien du registre papier (Décision 3), maintenance et transfert
  de compétence écrits — le devis actuel ne contient aucun des trois.
- **Option A seule : insuffisante** — elle corrige la transcription,
  pas les écarts physiques.
- **Dans tous les cas** : mandater une analyse de cause des 340 kg
  avant la récolte ; aucun outil ne la remplace.

## Journal des résultats (à compléter plus tard, sans réécriture)

- Position de la session : « B conditionnel » (conditions : réservations
  vérifiées + sauvegarde externe).
- Probabilité estimée par le président : ~65 % que B supprime les
  erreurs de transcription de type « double saisie » dès la première
  saison ; faible (<25 %) qu'un outil seul explique les 340 kg.
- **Ce qui s'est réellement passé** : *(à ajouter après la saison —
  la coopérative étant fictive, cette ligne restera vide ; dans une
  session réelle, c'est ici que la méthode se vérifie elle-même.)*
