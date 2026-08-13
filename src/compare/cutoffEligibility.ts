import type { AdmissionEvaluation } from '../core/admissionEvaluation';

export function canCompareEvaluationToCutoff(evaluation: AdmissionEvaluation): boolean {
  return (
    (evaluation.confidence === 'exact-verified' || evaluation.confidence === 'exact-cross-checked') &&
    evaluation.score !== undefined &&
    Number.isFinite(evaluation.score.value) &&
    Number.isFinite(evaluation.score.scale)
  );
}
