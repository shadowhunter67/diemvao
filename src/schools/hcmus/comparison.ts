import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHcmusAdmission, type HcmusEvaluationContext } from './evaluate';
import { hcmusAdmissionMethods } from './methods';

/**
 * HCMUS chưa có cutoff comparison ở `/compare` (chỉ ngưỡng THPT/khối/ngành trong `evaluate.ts`
 * riêng nó) — KHÔNG thêm `withProgramCutoffComparison` ở đây, giữ đúng hành vi hiện tại (không phải
 * thiếu sót, xem `evaluateApplicantAcrossSchools.test.ts` cũ: `bySchool.hcmus.cutoffComparison`
 * luôn `undefined`).
 */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HcmusEvaluationContext {
  return { selectedProgramId: selection.programId, subjectContext: getSubjectContext(selection.context?.combinationId) };
}

export const hcmusComparisonAdapter: SchoolComparisonAdapter<HcmusEvaluationContext> = {
  schoolId: 'hcmus',
  methodId: hcmusAdmissionMethods[0].id,
  methodName: hcmusAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHcmusAdmission(profile, context) };
  },
};
