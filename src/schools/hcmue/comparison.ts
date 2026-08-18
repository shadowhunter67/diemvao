import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHcmueAdmission, type HcmueEvaluationContext } from './evaluate';
import { hcmueAdmissionMethods } from './methods';

/** HCMUE chỉ kiểm tra ngưỡng THPT (eligibility-only, `capabilities.cutoffs: false`), chưa có cutoff
 * comparison ở `/compare`. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HcmueEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), selectedProgramId: selection.programId };
}

export const hcmueComparisonAdapter: SchoolComparisonAdapter<HcmueEvaluationContext> = {
  schoolId: 'hcmue',
  methodId: hcmueAdmissionMethods[0].id,
  methodName: hcmueAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHcmueAdmission(profile, context) };
  },
};
