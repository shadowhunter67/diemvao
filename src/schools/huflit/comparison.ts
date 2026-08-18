import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHuflitPt1Admission, type HuflitPt1EvaluationContext } from './evaluate';
import { huflitAdmissionMethods } from './methods';

/** HUFLIT chưa có cutoff comparison (chưa import điểm chuẩn theo ngành) — chỉ map tổ hợp môn
 * generic sang PT1 (phương thức chính). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HuflitPt1EvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, subjects: subjectContext.subjects } };
}

export const huflitComparisonAdapter: SchoolComparisonAdapter<HuflitPt1EvaluationContext> = {
  schoolId: 'huflit',
  methodId: huflitAdmissionMethods[0].id,
  methodName: huflitAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHuflitPt1Admission(profile, context) };
  },
};
