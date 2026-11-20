# The Council Method

**This project does not generate code and does not run multi-agent execution: several language models deliberate over your technical files (code, decisions, research), every claim classified [Verified / Inference / Proposal], a binding decisions register, and a human chair who settles by execution, not by vote.**

Languages: **English** (this file) · [العربية](README.ar.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)
Method document: [العربية (source)](docs/METHODE.md) · [Français (source)](docs/METHODE.fr.md) · [English](docs/METHODE.en.md) · [Español](docs/METHODE.es.md) · [Português](docs/METHODE.pt.md)

> A single model gives you one confident opinion. If it is wrong, nothing tells you. The Council Method turns the question into a small review institution: an independent round, an anonymized debate, and a chair who verifies by running things — in real use since November 2026, reviewing real projects. This is its public edition.

## Read this before installing — expectations, named

- **What this is**: a method (documents, templates, rules) plus a zero-dependency Node engine that runs it. One file, no npm install: *installing is downloading*.
- **What this is not**: not a chat UI, not an agent framework, not a code generator, not a hosted service. There is no web interface and there will not be one.
- **Maintenance policy — zero, by design**: released **as-is, fixed version 1.0. No issue handling, no pull requests, no future releases.** To adapt it: fork it. (Precedent: a famous one-file council demo reached tens of thousands of stars with exactly this policy; community maintenance is a debt this project refuses on day one.)
- **Who it serves**: a decision-maker whose errors are expensive — a reviewer of code, decisions, plans or research who can read outputs and verify claims. It adds nothing to quick, simple questions.
- **The chair is human**: the engine produces no verdict. If nobody reads and verifies, you get several confident opinions instead of one.
- **Your keys, your costs**: free tiers are enough (one lane needs no key at all). Nothing here phones home; your files go only to the model providers you configure.

## First session — zero keys, about 15 minutes

Requires Node ≥ 20 (verified on Node 20 and 24). No account, no key, no cost: a built-in keyless lane seats the council.

```bash
# 1. Get the files (download/fork this repository), then:
node moteur/conseil.mjs --init        # installs brief.md, DECISIONS.md, REFERENCE.md from the guided templates
# 2. Edit those three files for your project (the templates explain what to write)
node moteur/conseil.mjs --sujet "Review of the X proposal" --source ./your-files/
# 3. Read revues/<date>_<subject>/ — raw member outputs, fragility report,
#    and a guided synthese.md template for the chair to complete
```

Optional: `node moteur/conseil.mjs --assistant-cles` runs an interactive wizard that asks provider by provider, **tests each key live**, and writes the configuration itself. `node moteur/test-cles.mjs` gives a read-only diagnosis of every seat (status + the exact fix line). (Read-only = writes nothing; it does make live network calls to check the seats and may consume quota.) `--dry-run` assembles the dossier with no network call. `--poids legere|standard|complete` selects the session weight (see below).

## Need → process → named result

| Your need | The process | The named result you get |
|---|---|---|
| A second opinion that is not an echo | Round 1: independent reviews, members blind to each other | Numbered items (F-01...) with evidence (file:line) and claim classes |
| Disagreement you can use, not averaged away | Round 2: anonymized debate by rotation | Agreements/disagreements with reasons; a synthesis field **"disagreements preserved verbatim"** |
| Protection against your own past decisions being silently overridden | A binding decisions register read at every session | Any contrary proposal is tagged "contrary to recorded decision no. N" |
| Protection against the council citing itself | The named anti-self-citation rule + origin tags fixed at writing time | A claim becomes [Verified] only via evidence from outside the council |
| A session that failed quietly | The quorum rule | Sessions under 3 substantive replies are stamped **QUORUM_NON_ATTEINT** — traces, not a judgment |
| Knowing whether the council was right | The outcome journal | Position + probability recorded at close; "what actually happened" appended later, unrewritten |

## How it differs — a frozen structural comparison

|  | Subject reviewed | Governance (who settles, how) | Traceability | Publishing form |
|---|---|---|---|---|
| llm-council (Karpathy) | Chat questions | A judge model ranks anonymized answers | Ranking; no claim classes, no decisions register | One app, zero maintenance |
| Spec methodologies (Spec Kit, BMAD) | Building software from specifications | The specification process itself | Documents and templates; no binding decision register enforced at review time | Toolkits with release lines and community maintenance |
| **The Council Method** | **Your existing technical files: code, decisions, research, plans** | **A human chair, by execution — never by vote** | **Mandatory claim classification + binding decisions register + origin tags + quorum rule** | **Method documents + one zero-dependency file; zero maintenance, by contract** |

No competitor we could find — in a full census of council deliberation tools, not a sample — combines all four: a binding decisions register, mandatory claim classification, a chair who verifies by execution, and a session quorum rule.

## Session weights

- **Light** — entry bridge and demonstration: round 1 only, lighter format, full classification rigor.
- **Standard** — the default: full format, two rounds.
- **Complete** — audit: standard + detailed fragility report + a session cost/effort line.

The ladder proportions effort to the stakes of the decision; it is documented guidance, not a numbered law.

## Two doors

1. **The method first** (recommended for decision-makers): read `docs/METHODE.en.md`, take the templates in `docs/`, and run sessions with the single-host skill in `skills/` — the engine is an optional runner that a technical intermediary can operate for you.
2. **The engine**: `moteur/conseil.mjs` automates the full protocol (dossier assembly with fingerprints, both rounds, identity stamps of the model that actually served each reply, quorum stamping, fragility report, guided synthesis template).

A complete, fully fictional example session — invented people, company and subject, real engine outputs — lives in `examples/session-demo/`.

## Repository map

```
moteur/    conseil.mjs (the engine) · test-cles.mjs (read-only seat diagnosis) · config.exemple.json
docs/      METHODE in 5 languages · BRIEF / DECISIONS / REFERENCE / SYNTHESE templates
skills/    SKILL.md (single-host skill) · PROMPT.md (prompt version for any chat host)
examples/  session-demo/ — a complete synthetic session
revues/    your sessions land here (created at runtime, yours to keep or discard)
```

## Licenses

- **Code** (`moteur/`): MIT — see `LICENSE`.
- **Method and documents** (`docs/`, `skills/`, READMEs): CC BY 4.0 — see `LICENSE-METHOD.md`. Attribution is the dated authorship; if you reuse the method, name it and link back.

*Vocabulary rule, binding on this project's own texts: this is multi-model review and deliberation with a single human executor — the term "multi-agent" is never used to describe this project.*
