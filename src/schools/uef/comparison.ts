import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUefThptExamAdmission, type UefThptExamEvaluationContext } from './evaluate';
import { uefAdmissionMethods } from './methods';

/** UEF chưa có cutoff comparison ở `/compare` — giữ hành vi đơn giản như VLU/HUIT/HSU. Adapter dùng
 * Phương thức thi TN THPT. `thresholdGroup` mặc định `'standard'` — `SchoolComparisonContext` chưa
 * có field chọn nhóm ngành UEF (mapping ngành→nhóm ngưỡng còn là knowledge gap). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): UefThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), thresholdGroup: 'standard' };
}

export const uefComparisonAdapter: SchoolComparisonAdapter<UefThptExamEvaluationContext> = {
  schoolId: 'uef',
  methodId: uefAdmissionMethods[0].id,
  methodName: uefAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateUefThptExamAdmission(profile, context) };
  },
};
