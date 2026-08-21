import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateCtuThptExamAdmission, type CtuThptExamEvaluationContext } from './evaluate';
import { ctuAdmissionMethods } from './methods';

/** CTU chưa có cutoff comparison ở `/compare` (chỉ điều kiện đầu vào) — giữ hành vi đơn giản như
 * HUB/VLU/AGU. Adapter dùng Phương thức 2 (thi TN THPT) — phương thức có input đọc thẳng từ
 * `ApplicantProfile.thpt.scores` không cần context bổ sung (nhóm ngành/học lực) như Phương thức 3/4. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): CtuThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId) };
}

export const ctuComparisonAdapter: SchoolComparisonAdapter<CtuThptExamEvaluationContext> = {
  schoolId: 'ctu',
  methodId: ctuAdmissionMethods[0].id,
  methodName: ctuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateCtuThptExamAdmission(profile, context) };
  },
};
