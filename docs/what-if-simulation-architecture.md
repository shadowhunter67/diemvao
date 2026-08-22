# What-if simulation architecture

Goal: let a user clone their current applicant profile, adjust one or more assumptions, and compare outcomes without mutating the saved profile or inventing school-specific rules.

## Runtime Entry Points

- `src/evaluation/schoolEvaluation.ts`
  - `evaluateSchool(profile, schoolId, options?)`
  - `evaluateSchools(profile, schoolIds, contexts?)`
  - Returns normalized statuses: `calculated`, `partial`, `eligible`, `ineligible`, `missing-input`, `unsupported`.
- `src/evaluation/scenarioSimulation.ts`
  - `applyScenarioPatch(baseProfile, patch)`
  - `evaluateScenario(baseProfile, patch, { schools, contexts? })`
  - Clones the base profile before applying a patch, then evaluates before/after through `evaluateSchool`.

The evaluator orchestrator calls the existing school-specific comparison adapter. It does not copy formulas into a generic engine.

## Data Contract

```ts
export interface ApplicantProfilePatch {
  thpt?: { scores?: Partial<Record<SubjectId, number>> } & Partial<Record<SubjectId, number>>;
  vactTotal?: number;
  certificates?: ApplicantProfile['certificates'];
  priority?: ApplicantProfile['priority'];
  transcript?: ApplicantProfile['transcript'];
  exams?: ApplicantProfile['exams'];
}

export interface ScenarioSchoolResult {
  schoolId: string;
  before: GenericSchoolEvaluationResult;
  after: GenericSchoolEvaluationResult;
  delta?: number;
  statusChanged: boolean;
  missingInputs: string[];
}
```

The patch is intentionally close to `ApplicantProfile`, with convenience support for `thpt: { math: 9 }` and `vactTotal: 1050`. School modules keep owning their own formulas, thresholds, rounding, and missing-rule semantics.

## Evaluation Flow

1. Start from the saved `ApplicantProfile`.
2. Apply a typed patch with structural cloning.
3. Run `evaluateScenario(profile, patch, { schools, contexts })`; compare already reuses the same `evaluateSchool` orchestration internally.
4. Render deltas from baseline results: score difference, status change, newly missing inputs, and newly satisfied thresholds.

## Guardrails

- Never persist a scenario over the real profile unless the user explicitly chooses to replace it.
- Do not synthesize outputs for `unavailable`/catalog-only entries; preserve existing `missingRequirements`.
- Keep scenario patches generic. Avoid school-specific fields unless that school already exposes a typed comparison context.
- Reuse exact calculator, partial calculator, and eligibility-only support statuses so CTA wording remains consistent with the landing page.

## Suggested First Slice

- A compare-page-only scenario drawer with two scenarios: current profile and one editable copy.
- THPT score adjustments first, because they map cleanly across the broadest set of supported schools.
- Later slices can add V-ACT/HSA/TSA scores, transcript granularity, certificates, and bonus/priority assumptions.
