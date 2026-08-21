import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHsuThptExamAdmission, type HsuThptExamEvaluationContext } from './evaluate';
import { hsuAdmissionMethods } from './methods';

/** HSU chưa có cutoff comparison ở `/compare` — giữ hành vi đơn giản như VLU/HUIT. Adapter dùng
 * Phương thức thi TN THPT. `thresholdGroup` mặc định `'standard'` — `SchoolComparisonContext` chưa
 * có field chọn nhóm ngành HSU (mapping ngành→nhóm ngưỡng còn là knowledge gap). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HsuThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), thresholdGroup: 'standard' };
}

export const hsuComparisonAdapter: SchoolComparisonAdapter<HsuThptExamEvaluationContext> = {
  schoolId: 'hsu',
  methodId: hsuAdmissionMethods[0].id,
  methodName: hsuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHsuThptExamAdmission(profile, context) };
  },
};
