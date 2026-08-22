# Data Methodology

UniScoreVN is evidence-first.

## Source Priority

1. Official ministry or regulator publications.
2. Official admission announcements from the school.
3. Official cutoff, threshold, and conversion documents.
4. Secondary summaries only as pointers to an official source, not as score-affecting proof.

## Support Levels

- Verified calculator: every score-affecting rule in the claimed scope has official evidence and regression coverage.
- Partial calculator: a method or school is supported only for the verified subset shown in the UI.
- Eligibility-only: UniScoreVN can check thresholds or requirements but cannot compute a final admission score.
- Catalog-only: the school appears in search/compare, but calculator behavior is unsupported.

## Unsupported Means No Guessing

If official sources are missing, stale, ambiguous, or conflicting, UniScoreVN marks the rule or method unsupported instead of estimating.

## Public Artifacts

Runtime catalog artifacts are generated from a private source-of-truth pipeline and committed under `src/generated/`. They include the minimum data needed for the public app to build and run, plus public source links where available.

The private pipeline keeps working notes, source conflicts, rejected interpretations, reviewer decisions, and normalization internals.
