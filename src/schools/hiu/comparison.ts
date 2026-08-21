import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHiuThptExamAdmission, type HiuThptExamEvaluationContext } from './evaluate';
import { hiuAdmissionMethods } from './methods';

/** HIU chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như CTU/TDMU/HUB. Adapter dùng phương thức thi TN THPT — input đọc thẳng từ
 * `ApplicantProfile.thpt.scores`, `group` mặc định `'standard'` (mapping ngành→nhóm còn là
 * knowledge gap, xem `hiu-program-catalog-not-imported`). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HiuThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), group: 'standard' };
}

export const hiuComparisonAdapter: SchoolComparisonAdapter<HiuThptExamEvaluationContext> = {
  schoolId: 'hiu',
  methodId: hiuAdmissionMethods[0].id,
  methodName: hiuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHiuThptExamAdmission(profile, context) };
  },
};
