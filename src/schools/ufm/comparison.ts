import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUfmThptAdmission, type UfmThptEvaluationContext } from './evaluate';
import { ufmAdmissionMethods } from './methods';

/** UFM chưa có cutoff comparison (chưa import điểm chuẩn theo ngành) — chỉ map tổ hợp môn generic
 * sang phương thức xét THPT (phương thức chính, exact). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): UfmThptEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, subjects: subjectContext.subjects } };
}

export const ufmComparisonAdapter: SchoolComparisonAdapter<UfmThptEvaluationContext> = {
  schoolId: 'ufm',
  methodId: ufmAdmissionMethods[0].id,
  methodName: ufmAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateUfmThptAdmission(profile, context) };
  },
};
