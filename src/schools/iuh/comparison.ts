import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateIuhCombinedAdmission, type IuhEvaluationContext } from './evaluate';
import { iuhAdmissionMethods } from './methods';

/** IUH chưa có cutoff comparison (điểm trúng tuyển 2026 đã có nhưng chưa import theo mã ngành, xem
 * knowledgeGaps.ts) — chỉ map tổ hợp môn generic sang phương thức xét kết hợp (phạm vi không ĐGNL). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): IuhEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, subjects: subjectContext.subjects } };
}

export const iuhComparisonAdapter: SchoolComparisonAdapter<IuhEvaluationContext> = {
  schoolId: 'iuh',
  methodId: iuhAdmissionMethods[0].id,
  methodName: iuhAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateIuhCombinedAdmission(profile, context) };
  },
};
