import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateVluThptExamAdmission, type VluThptExamEvaluationContext } from './evaluate';
import { vluAdmissionMethods } from './methods';

/** VLU chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như AGU. Adapter dùng Phương thức 1 (thi TN THPT) — phương thức có input đọc thẳng từ
 * `ApplicantProfile.thpt.scores` không cần context bổ sung (rank/graduation score) như PT2/PT3.
 * `thresholdGroup` mặc định `'standard'` — `SchoolComparisonContext` chưa có field chọn nhóm ngành
 * VLU (mapping ngành→nhóm ngưỡng còn là knowledge gap, xem `vlu-program-catalog-not-imported`). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): VluThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), thresholdGroup: 'standard' };
}

export const vluComparisonAdapter: SchoolComparisonAdapter<VluThptExamEvaluationContext> = {
  schoolId: 'vlu',
  methodId: vluAdmissionMethods[0].id,
  methodName: vluAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateVluThptExamAdmission(profile, context) };
  },
};
