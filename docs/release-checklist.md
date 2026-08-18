# UniscoreVN Release Checklist

## Code

- Exact calculators (current, verify against `AdmissionMethodDescriptor.capabilities.exactCalculator`
  before relying on this list — see `docs/architecture.md` golden/domain conformance section):
  HCMUT, UEH, UEL (all 3 applicant types), HCMUS, USSH (scope: no bonus achievement), IU (scope:
  "Thí sinh tốt nghiệp THPT 2026"). UIT stays partial/unavailable where official rules are missing.
- No derived school score is stored in `ApplicantProfile`.
- No prediction, ranking, recommendation, login, backend, database, or crawler is part of this release.

## Data

- Admission sources live in school source registries.
- Score-affecting rule evidence resolves through `sourceId`.
- `npm run audit:data` must finish with zero errors.
- Known warnings are allowed only when they describe honest official-rule gaps.

## Tests

- Run `npm run lint`.
- Run `npm run test`.
- Run `npm run build`.
- Smoke `/`, `/compare`, `/hcmut`, `/ueh`, `/uel`, and `/uit`.

## UX

- Landing explains: nhập điểm một lần, nhiều trường đọc, mỗi trường áp dụng rule riêng, kết quả kèm nguồn.
- `/compare` separates exact, partial, and unavailable results.
- Partial schools never show a final cutoff gap.
- Evidence details must not expose raw enum values or empty placeholders.

## Production

- Canonical domain: `https://uniscorevn.vercel.app`.
- `vercel.json` rewrites all SPA routes to `index.html`.
- Direct navigation to `/compare`, `/hcmut`, `/ueh`, `/uel`, and `/uit` should return the app shell.

## Known Limitations

- UIT is partial/unavailable: percentile conversion and several certificate/transcript rules remain unparsed.
- USSH exact scope excludes applicants with a bonus achievement (specific award amount not yet published).
- IU exact scope excludes applicant types 2/3 (graduated before 2026 / foreign THPT).
- AGU/UHS/HCMUE stay partial/eligibility-only (see per-school `knowledgeGaps.ts`).
