# UniScoreVN Public Engineering Notes

This repository is the public UniScoreVN app: Vite, React, TypeScript, client-side only.

The public repo should remain useful and buildable on its own. It includes UI, generic runtime contracts, comparison behavior, public tests, public methodology docs, and committed generated runtime artifacts.

Private source-of-truth data, research notes, source reconciliation, normalization decisions, and deep audit/export workflows live outside this repository.

## Commands

```bash
npm install
npm run test
npm run lint
npm run build
npm run audit:data
npm run stats:coverage
```

## Public Runtime Rules

- `src/core/` is generic runtime code: applicant profile, validation, storage migration, evidence types, and shared contracts.
- `src/compare/` is generic comparison infrastructure.
- `src/schools/<id>/` may contain school-specific runtime modules needed by the client app.
- `src/generated/` contains generated runtime artifacts. Do not edit them manually.
- Public builds must not depend on private repo access or private secrets.

## Data Rules

- Formula support requires official evidence in the claimed scope.
- If a source is incomplete or conflicting, keep the method partial or unsupported.
- Keep public source URLs available where runtime results depend on them.
- Do not commit credentials, raw private research, reviewer notes, or source conflict logs.

## Compatibility

Preserve existing localStorage migration chains and shared profile semantics. Missing input must remain missing/`undefined`, not coerced to `0`, except inside calculator-specific tolerant form boundaries.
