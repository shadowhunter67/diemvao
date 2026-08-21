import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHubThptExamAdmission, type HubThptExamEvaluationContext } from './evaluate';
import { hubAdmissionMethods } from './methods';

/** HUB chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như VLU/AGU. Adapter dùng Phương thức 1 (thi TN THPT) — phương thức có input đọc thẳng từ
 * `ApplicantProfile.thpt.scores` không cần context bổ sung (khu vực/IELTS) như nhóm Luật/Elite.
 * `group` mặc định `'standard'` — `SchoolComparisonContext` chưa có field chọn nhóm ngành HUB
 * (mapping ngành→nhóm ngưỡng còn là knowledge gap, xem `hub-program-catalog-not-imported`). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HubThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), group: 'standard' };
}

export const hubComparisonAdapter: SchoolComparisonAdapter<HubThptExamEvaluationContext> = {
  schoolId: 'hub',
  methodId: hubAdmissionMethods[0].id,
  methodName: hubAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHubThptExamAdmission(profile, context) };
  },
};
