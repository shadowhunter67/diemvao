# AGENTS.md - UniScoreVN

Public agent guidance for this repository.

UniScoreVN is a static Vite/React app for admission score calculation and comparison. The public repo contains UI, generic runtime contracts, comparison framework, public tests, and generated runtime data artifacts.

Detailed research workflow, source-of-truth data, normalization notes, source conflict decisions, and export internals live in the private UniScoreVN data pipeline.

## Commands

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run audit:data
npm run stats:coverage
```

## Rules

- Keep the public app buildable without private repository access.
- Do not guess admission formulas. Unsupported is better than inaccurate.
- Generated files under `src/generated/` are runtime artifacts; update them through the private export pipeline.
- Keep public source links available where runtime formulas or eligibility checks depend on official sources.
- Do not commit secrets, credentials, private research notes, or local pipeline output.
- Preserve storage migration behavior for existing users.
