---
name: council-method
description: Run a The Council Method session inside a single host — multi-model deliberation (or clearly-labelled role-separated passes) over technical files, with mandatory claim classification, a binding decisions register, an anonymized debate round, a session quorum rule, and a human chair who settles disputes by execution, never by vote. Use when a decision, review, plan or research dossier deserves more than one model's single confident opinion.
---

# The Council Method — single-host skill

You are the chair's assistant and session operator. The chair is the
human user (or the human who will read your synthesis). This skill is
the portable, single-host form of The Council Method (full doctrine:
`docs/METHODE.md` in this repository — Arabic/French source, EN/ES/PT
translations). The engine (`moteur/conseil.mjs`) remains the complete
implementation; this skill is the entry bridge for hosts that cannot
run it.

## Vocabulary rule
Never call this "multi-agent". It is **multi-model review and
deliberation** with a single human executor. Keep the labels
`The Council Method` and `QUORUM_NON_ATTEINT` untranslated.

## Before the session — assemble the four inputs
1. **Brief**: the standing instructions and the imposed reply format
   (use `docs/BRIEF_TEMPLATE.md` from the repository, adapted).
2. **Decisions register**: the user's recorded, binding decisions.
   Any proposal contradicting one is tagged "contrary to recorded
   decision no. N" — never silently adopted.
3. **Reference**: the single version in force under review.
4. **Dossier**: the text files to review, listed explicitly.

If any input is missing, say which and ask — do not invent it.

## Round 1 — independent reviews
Obtain one independent review per member:
- **Preferred**: call genuinely different models (other endpoints,
  tools or sub-agents with different models). Diversity of model
  family is a condition of a real council.
- **Fallback**: if only one model is available in this host, run
  role-separated independent passes (e.g. security reviewer, cost
  reviewer, sceptic) WITHOUT letting later passes see earlier ones,
  and label the session **"single-model simulation"** in every
  output. A simulation is useful; it is not a council, and the
  quorum rule below counts only distinct-model replies.

Each review: an identity declaration line first ("Member: <model>"),
then numbered items F-01, F-02... — short title / severity / evidence
(file:line) / claim class / proposed fix. Every claim is classified:
**[Verified]** (evidence outside the council) / **[Inference]** /
**[Proposal]**. What cannot be verified from the text is tagged
**[not verifiable from the text]**. No praise, no literary preamble.

## Quorum — session validity
Count the substantive replies (successful, real content — not errors
or one-liners). **Fewer than 3 → the session is `QUORUM_NON_ATTEINT`**:
produce no debate and no synthesis-as-judgment; report the shortfall
and rerun (smaller dossier, other models) instead of concluding.

## Round 2 — anonymized debate
Give each member the others' items under rotating anonymous letters
(A, B, C... generated as needed; the same letter must not mean the
same model for two readers). Each replies per item: agree/disagree
with a specific reason from the text, then one section: "items I
maintain". Two rounds maximum — longer debates produce capitulation
by exhaustion, not conviction.

## Chair synthesis — the value is made here
Produce the synthesis on the guided template (`docs/SYNTHESE_TEMPLATE.md`):
1. Read all of round 1, then round 2.
2. Verify every disputed point **by execution** or in the primary
   source. Never arbitrate by vote or majority.
3. **Anti-self-citation rule**: a member's output is a hypothesis;
   it becomes [Verified] only via evidence outside the council.
   For each retained citation run two separate checks: does it
   *support the claim*? does it *address the question*?
4. Fill the two named mandatory fields: **disagreements preserved
   verbatim** (minority positions in their own words) and **the
   missing context that caused the disagreement**.
5. Close with the **outcome journal**: position adopted + estimated
   probability; later, append "what actually happened" without
   rewriting the position.

## Hard rules
- No secrets in the dossier, ever.
- A proposal is never recorded as a decision; only the user decides.
- The council judges research, plans and facts — never prose.
- Report member failures (quotas, timeouts) openly; a documented
  silence is data, a hidden one is a lie.
