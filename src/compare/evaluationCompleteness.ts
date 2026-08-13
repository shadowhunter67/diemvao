import type { AdmissionEvaluation } from '../core/admissionEvaluation';

export interface EvaluationCompletenessSummary {
  userCanImprove: boolean;
  missingUserInputs: number;
  missingContext: number;
  blockedByOfficialRules: boolean;
  unsupported: boolean;
}

export function summarizeEvaluationCompleteness(evaluation: AdmissionEvaluation): EvaluationCompletenessSummary {
  const requirements = evaluation.missingRequirements ?? [];
  const missingUserInputs = requirements.filter((requirement) => requirement.kind === 'profile-input').length;
  const missingContext = requirements.filter((requirement) => requirement.kind === 'school-context').length;
  return {
    userCanImprove: missingUserInputs + missingContext > 0,
    missingUserInputs,
    missingContext,
    blockedByOfficialRules: requirements.some((requirement) => requirement.kind === 'official-rule'),
    unsupported: requirements.some((requirement) => requirement.kind === 'unsupported'),
  };
}
