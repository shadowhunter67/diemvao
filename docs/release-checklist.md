# UniscoreVN Release Checklist

## Code

- HCMUT exact calculator remains the only exact calculator.
- UEH, UEL, and UIT stay partial/unavailable where official rules are missing.
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

- UEH is partial: final thang-100 formula and bonus/priority table remain incomplete.
- UEL is partial: official Appendix 2 certificate bonus table is view-only/download denied and unparsed.
- UIT is partial/unavailable: percentile conversion and several certificate/transcript rules remain unparsed.
