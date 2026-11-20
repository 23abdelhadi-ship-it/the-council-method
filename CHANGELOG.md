# Changelog

All notable changes to The Council Method are recorded here, newest first.
The project is zero-maintenance by design: a release is a rare, deliberate,
announced act — a stability contract, not abandonment.

## [1.1.0] — 2026-11-20

### Added

- `ADOPTIONS.md` — a declaration template and log for documented adoptions
  and method forks, the project's primary adoption indicator.
- `CHANGELOG.md` — this file: the in-repository record of announced releases.

### Changed

- The zero-maintenance policy is clarified in all five READMEs: **zero
  maintenance = a stability contract, not abandonment.** Every other promise
  is unchanged — released as-is, no issue handling, no pull requests.
- Version raised to 1.1.0 in `CITATION.cff` and the five READMEs. This
  announced release consciously amends the "no future releases" wording of
  1.0.0: the zero-maintenance contract stands, exercised here as a single
  deliberate exception, recorded rather than silent.

## [1.0.0] — 2026-11-20

### Added

- First public release. The method in five languages (Arabic and French are
  the source texts; English, Spanish, and Portuguese are faithful
  translations), the zero-dependency council engine (`moteur/conseil.mjs`)
  with an interactive keys wizard and read-only key diagnostics
  (`moteur/test-cles.mjs`), guided templates for the three root files and
  for the chair's synthesis, the single-host skill/prompt package, a fully
  synthetic demo session with real engine outputs, and a zero-dependency
  test suite (17 tests, verified on Node 20 and Node 24).
- Licences: MIT for the code, CC BY 4.0 for the method and documents.
