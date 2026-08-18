import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateAguAdmission, type AguEvaluationContext } from './evaluate';
import { aguAdmissionMethods } from './methods';

/** AGU chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ nguyên hành vi cũ. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): AguEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), selectedProgramCode: selection.programId };
}

export const aguComparisonAdapter: SchoolComparisonAdapter<AguEvaluationContext> = {
  schoolId: 'agu',
  methodId: aguAdmissionMethods[0].id,
  methodName: aguAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateAguAdmission(profile, context) };
  },
};
