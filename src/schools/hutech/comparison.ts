import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHutechThptAdmission, type HutechThptEvaluationContext } from './evaluate';
import { hutechAdmissionMethods } from './methods';

/** HUTECH chưa có cutoff comparison (chưa import điểm chuẩn theo ngành) — chỉ map tổ hợp môn
 * generic sang phương thức xét THPT (phương thức chính, exact). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HutechThptEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, subjects: subjectContext.subjects } };
}

export const hutechComparisonAdapter: SchoolComparisonAdapter<HutechThptEvaluationContext> = {
  schoolId: 'hutech',
  methodId: hutechAdmissionMethods[0].id,
  methodName: hutechAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHutechThptAdmission(profile, context) };
  },
};
