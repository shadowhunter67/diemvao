# What-if simulation architecture

Goal: let a user clone their current applicant profile, adjust one or more assumptions, and compare outcomes without mutating the saved profile or inventing school-specific rules.

## Data Contract

```ts
export interface WhatIfScenarioPatch {
  label: string;
  thptScores?: Partial<ApplicantProfile['thpt']['scores']>;
  transcript?: Partial<ApplicantProfile['transcript']>;
  exams?: Partial<ApplicantProfile['exams']>;
  priority?: ApplicantProfile['priority'];
  certificates?: ApplicantProfile['certificates'];
}

export interface WhatIfScenarioResult {
  scenarioId: string;
  label: string;
  profile: ApplicantProfile;
  summaries: ReturnType<typeof evaluateComparisonSelections>;
}
```

The patch is intentionally applicant-profile-shaped. School modules keep owning their own formulas, thresholds, rounding, and missing-rule semantics.

## Evaluation Flow

1. Start from the saved `ApplicantProfile`.
2. Apply a typed patch with structural cloning.
3. Run existing `evaluateComparisonSelections(profile, selections)` or `evaluateApplicantAcrossSchools(profile, contexts)`.
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
