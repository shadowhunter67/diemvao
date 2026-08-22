# Public Architecture

UniScoreVN is a client-side Vite/React app.

```text
src/
  components/   shared UI
  core/         generic profile, validation, scoring contracts, evidence types
  compare/      generic comparison framework
  schools/      runtime school modules and wrappers
  generated/    generated runtime data artifacts
```

The public repository owns the app shell, generic runtime engine, routing, comparison UI, profile storage, public tests, public methodology, and generated artifacts required to build production.

The private data pipeline owns source-of-truth research, normalization, conflict resolution, deep audit logic, and export tooling. Public builds do not need private access after generated artifacts are committed.

## Runtime Artifacts

Generated files use this header:

```ts
// AUTO-GENERATED.
// DO NOT EDIT MANUALLY.
// Source of truth lives in private UniScoreVN data pipeline.
```

Public catalog wrappers under `src/schools/*Catalog.ts` re-export generated runtime data to keep existing imports stable.

## Calculator Boundary

School-specific runtime calculators may remain public while the app is fully client-side. This split is not intended to hide all executable formulas from browser JavaScript. It protects the research process, source reconciliation, normalized source-of-truth dataset, and update pipeline.
