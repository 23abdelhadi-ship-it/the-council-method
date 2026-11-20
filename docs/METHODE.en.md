# The Council Method — the method (public edition, English)

> **Definition in one line**: several language models deliberate over your technical files (code, decisions, research) in two rounds — an independent round, then an anonymized debate — with mandatory classification of every claim, a binding decisions register, and a single human chair who settles matters by execution, never by vote.

**A binding vocabulary rule, in every project text and every language**: the term "multi-agent" is never used to describe this project. This project is **multi-model review and deliberation** with a single human executor (the chair) — not multi-agent execution. `The Council Method` is a proper name and is not translated; `QUORUM_NON_ATTEINT` is a technical label kept as-is in every language.

Arabic and French are the source languages of this doctrine; the other versions are faithful translations of it.

---

## 1. Why a council?

A single model gives you one confident opinion; if it is wrong, you will not know — there is no second voice, no opposition, and no memory of what you have already decided. The council turns the question into a small review institution: one brief in an imposed format, an independent round in which the members do not see each other, an anonymized debate round in which each member attacks the others' items without knowing their authors, and then a human chair who verifies by execution and writes the synthesis.

**Consensus is a trap**: when models agree easily, they are usually pattern-matching the same standard answer. The useful signal is **disagreement** — where the models diverge, and why. The synthesis therefore preserves disagreements verbatim instead of dissolving them into an average.

## 2. Composition and roles

- **The members**: models from different families (diversity is a condition; a council made of one model in several roles is a simulation, not a council). Free tiers are enough to start; a member's technical silence (quotas, timeouts, server errors) is documented, never hidden.
- **The chair**: one human. They run the session, read every output, verify disputed points **by execution** or in the primary source, and write the synthesis in their own voice. They are not replaced by an automated synthesis, and they never settle by vote.
- **The user (the decision-maker)**: their prior decisions bind the council (section 3); whatever the chair is unsure of is asked of the user, whose answer becomes the adopted basis.

## 3. The files the council works on

| File | Function |
|---|---|
| `brief.md` — the standing brief | The imposed reply format and the binding rules for members (template: `docs/BRIEF_TEMPLATE.md`) |
| `DECISIONS.md` — the decisions register | The user's binding decisions. Any member proposal that contradicts a recorded decision is marked explicitly: "proposal contrary to recorded decision no. N" — it never passes silently, and a proposal becomes a decision only by the user's word |
| `REFERENCE.md` — the reference | The single reference in force within the review's scope; no other version is assumed to exist |
| The session dossier | The text files under review, assembled with a fingerprint (SHA-256) per file and an overall fingerprint |
| `synthese.md` — the synthesis | The chair's output alone, on a guided template (index, step-by-step procedure, mandatory fields) |

**Origin tag**: every session output carries, at the moment it is written, an origin tag (member/chair/human) **set at creation and never changed by editing** — see the rule in section 6.

And because plain files in a repository are all that survives, the brief carries an explicit field: **"current state / next action"** — specifications alone do not show where the work stopped.

## 4. The two rounds

### Round 1 — independent
Each member reviews the dossier alone, in numbered items (F-01, F-02...), each item: short title / severity / evidence (file:line) / claim classification / proposed fix if any. **Every reply begins with an identity declaration line**: the model the member believes it is. And the engine stamps each reply with the model that **actually served it** (read from the response metadata) and flags any mismatch between the declared and the served model in the fragility report — a model impersonating another inside a council is documented, and only these two lines reveal it.

### Round 2 — anonymized debate by rotation
Each member receives the others' items under anonymized letters **generated dynamically and rotated from reader to reader** (no letter designates the same model for two readers). For each item: agree or disagree, with a specific reason drawn from the text. Then a single section: "items I maintain".

### Why only two rounds?
Because a long debate exhausts rather than convinces: after about three rounds, opposing models begin to capitulate out of "politeness by exhaustion", not conviction (Xiong et al., 2025). The two-round cap is a rule of method, not a technical limit. For the same reason, "pass/block, with a reason" verdicts are preferred over numeric scores, which drift across rounds.

## 5. Claim classification — mandatory

Every claim, in every reply, is classified into one of three categories:

- **[Verified]**: it has evidence outside the council (file:line, execution, document, register). Another member's output is **not** evidence.
- **[Inference]**: reasoning from verified elements, with its basis stated.
- **[Proposal]**: an opinion or recommendation; never recorded as if it were a decision.

And whatever cannot be verified from the text is marked explicitly: **[not verifiable from the text]**. No literary preambles and no praise in member replies.

## 6. The anti-self-citation rule (named)

> **Any member's output is a hypothesis under examination; it becomes [Verified] only through evidence from outside the council.**

The failure this rule names is documented among practitioners: a system cites notes generated by earlier members, so answers look "better and better sourced" over time while citing themselves. The two repair mechanisms adopted here:

1. **The origin tag at writing time** (section 3): every item carries its origin (human/member/chair) fixed at the moment of its creation, and editing never changes it.
2. **Two separate checks for every cited piece of evidence** in the synthesis: (a) does it actually **support the claim**? (b) does it actually **address the question** posed? — because a real but irrelevant citation is a failure distinct from a fabricated one.

## 7. Session validity threshold — the quorum rule

A valid session gathers **at least 3 substantive replies** in its first round (a substantive reply: successful and with real content — not an error message or a single line). Below that:

- the session is marked **`QUORUM_NON_ATTEINT`** automatically in its manifest (MANIFEST) and in a dedicated file;
- no round 2 and no synthesis — the raw outputs remain readable traces, but **are not presented as a council judgment**;
- the remedy is a rerun (smaller dossier, other lanes, additional keys), not a conclusion drawn from an incomplete session.

## 8. Session weights (documented guidance, not threshold-laws)

- **Light** — entry bridge and demonstration: round 1 only, a lighter format with fewer items, full classification rigor. Used to present the method and for small questions.
- **Standard** — the default: full F format and two rounds.
- **Complete** — audit: standard + a detailed fragility report + a session cost/effort line (counted in calls, failures and duration, not in isolated requests; on paid lanes, the judge/evaluation cost appears as a separate line, never blended into a total).

The ladder is guidance for proportioning effort to the stakes of the decision — not a numbered law that forbids or compels a session.

## 9. The chair's synthesis and verification by execution

The value is made here, not in the rounds. The chair's procedure:

1. Read every round-1 reply, then the round-2 debates.
2. For every disputed point: **verify by execution** (run, compare, reproduce) or return to the primary source. Never arbitrate by vote or majority.
3. Fill in the synthesis template, whose two named mandatory fields are: **"disagreements preserved verbatim"** (minority positions in their own words, not a dissolved average) and **"the missing context that caused the disagreement"** (what the dossier lacked and that produced the disagreement — to be asked of the user afterwards rather than guessed).
4. Apply the two checks (section 6) to every claim retained in the synthesis.
5. Close with the outcome journal (section 10).

Reading load is the chair's real bottleneck; replies are therefore built on spot-checkable pointers (file:line), not walls of text.

## 10. The outcome journal

Every session closes, in its synthesis, with two lines: **the position adopted** and **the estimated probability**. When reality later settles the matter, a third line is appended — **"what actually happened"** — without ever rewriting the original position. The decisions register thus stops being an archive and becomes a cumulative calibration instrument: the council is recorded, then graded by reality.

## 11. General doctrine (why is this hard to copy?)

- **Use before tool; depth before widening; execution before guide.** A new idea is first implemented with the current tools; switching to a new tool is an exception requiring a written justification.
- **The five-question moat test** for every future step (publication, partnership, feature): does it pass the questions of **impact, catch-up, circumvention, durability, retention**? Whatever fails is a copyable layer: it is given deliberately, its authorship is dated, and no protection is built on it.
- **The core that is not given away**, in its general concepts: operational data accumulated over time, a trust network that cannot be bought, the permission of a party that chooses you, a real switching cost for those who adopted you, and a judgment corpus (a decisions register and syntheses) that no one else owns.
- **Rituals**: a periodic use radar that asks "what new use for our real work?" rather than "what new tool?"; and a periodic self-review that asks: what have we accumulated that cannot be copied? A cycle that produces only copyable layers is a failed cycle, however much it produces.
- The council judges **research, plans and facts — never prose**. Texts meant for humans are written in a single author's voice, checked afterwards only at the level of quotations, figures and dates.

## 12. Limits of the method, honestly

- It adds nothing to quick, simple questions; its value appears where the cost of an error exceeds the cost of the session.
- **Provider roulette** is real: each step's failure probabilities multiply across stages. Its adopted mitigations: retry at the stage boundary rather than rerunning everything, and a per-session fragility report that aggregates failures classified (quotas/size/timeouts/network) instead of discovering them scattered.
- The council amplifies the chair's judgment; it does not replace it: without a chair who reads and verifies, it is five confident opinions instead of one.
- No secrets in the dossier, ever: keys and secrets always stay out of the files, and the local configuration file is neither published nor pushed to any repository.

---

## Annex A — Evaluation protocol "the council vs a single model" (D-10)

A recurring request from practitioners; here is its executable form, for anyone who wants to test for themselves that the council adds something:

1. Take about **20 real tasks** from your work (reviews, decisions, plans) already settled or settleable.
2. Run both sides on **exactly the same evidence**: (a) one strong model with a structured review checklist; (b) a standard council under this method.
3. Compare **verdict accuracy** (does the final judgment match what reality/the reference established?) — not the agreement rate between the two sides, because agreement can be shared blindness.
4. Also record: the cost (calls and chair time) of each side, and the number of errors caught by one side and missed by the other.
5. Publish the result as it is, including if the council loses.

## Annex B — Unified terminology across languages

| Concept | Arabic | French | English | Spanish | Portuguese |
|---|---|---|---|---|---|
| Project name | The Council Method | The Council Method | The Council Method | The Council Method | The Council Method |
| The chair | الرئيس | le président | the chair | el presidente | o presidente |
| The member | العضو | le membre | the member | el miembro | o membro |
| The round | الجولة | la ronde | the round | la ronda | a rodada |
| The brief | الإحاطة | le brief | the brief | el brief | o brief |
| The decisions register | سجلّ القرارات | le registre des décisions | the decisions register | el registro de decisiones | o registro de decisões |
| The synthesis | التوليف | la synthèse | the synthesis | la síntesis | a síntese |
| Verified claim | [مثبت] | [établi] | [Verified] | [Verificado] | [Verificado] |
| Inference | [استنتاج] | [inférence] | [Inference] | [Inferencia] | [Inferência] |
| Proposal | [اقتراح] | [proposition] | [Proposal] | [Propuesta] | [Proposta] |
| Quorum label | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT | QUORUM_NON_ATTEINT |
