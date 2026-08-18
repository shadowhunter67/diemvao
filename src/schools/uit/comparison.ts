import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUitAdmission, type UitEvaluationContext } from './evaluate';
import { uitAdmissionMethods } from './methods';

/** UIT chưa có cutoff comparison ở `/compare` (chỉ ngưỡng ĐGNL) — giữ nguyên hành vi cũ. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): UitEvaluationContext {
  return { programId: selection.programId };
}

export const uitComparisonAdapter: SchoolComparisonAdapter<UitEvaluationContext> = {
  schoolId: 'uit',
  methodId: uitAdmissionMethods[0].id,
  methodName: uitAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateUitAdmission(profile, context) };
  },
};
