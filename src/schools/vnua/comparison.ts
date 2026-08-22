import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateVnuaThptExamAdmission, type VnuaThptExamEvaluationContext } from './evaluate';
import { vnuaAdmissionMethods } from './methods';

function buildContext(selection: Omit<ComparisonSelection, 'id'>): VnuaThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId) };
}

export const vnuaComparisonAdapter: SchoolComparisonAdapter<VnuaThptExamEvaluationContext> = {
  schoolId: 'vnua',
  methodId: vnuaAdmissionMethods[0].id,
  methodName: vnuaAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateVnuaThptExamAdmission(profile, context) };
  },
};

