import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHcmuteAdmission, type HcmuteEvaluationContext } from './evaluate';
import { hcmuteAdmissionMethods } from './methods';

/** HCMUTE chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đầu vào + HLy.1 route) — không suy
 * điểm ưu tiên/cộng từ selection generic vì cần thêm input riêng (thành tích, môn chính); giữ
 * context tối giản, chỉ map tổ hợp môn. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HcmuteEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, mainSubjectId: subjectContext.subjects[0], subjects: subjectContext.subjects } };
}

export const hcmuteComparisonAdapter: SchoolComparisonAdapter<HcmuteEvaluationContext> = {
  schoolId: 'hcmute',
  methodId: hcmuteAdmissionMethods[0].id,
  methodName: hcmuteAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHcmuteAdmission(profile, context) };
  },
};
