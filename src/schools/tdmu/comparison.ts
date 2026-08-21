import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateTdmuThptExamAdmission, type TdmuThptExamEvaluationContext } from './evaluate';
import { tdmuAdmissionMethods } from './methods';

/** TDMU chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như CTU/HUB. Adapter dùng phương thức thi TN THPT — input đọc thẳng từ
 * `ApplicantProfile.thpt.scores`, `group` mặc định `'standard'` (mapping ngành→nhóm còn là
 * knowledge gap, xem `tdmu-program-catalog-not-imported`). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): TdmuThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), group: 'standard' };
}

export const tdmuComparisonAdapter: SchoolComparisonAdapter<TdmuThptExamEvaluationContext> = {
  schoolId: 'tdmu',
  methodId: tdmuAdmissionMethods[0].id,
  methodName: tdmuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateTdmuThptExamAdmission(profile, context) };
  },
};
