import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateFtuDomesticExamAdmission, type FtuDomesticExamEvaluationContext } from './evaluate';
import { ftuAdmissionMethods } from './methods';

function buildContext(_selection: Omit<ComparisonSelection, 'id'>): FtuDomesticExamEvaluationContext {
  return { exam: 'vact', programGroup: 'standard30' };
}

export const ftuComparisonAdapter: SchoolComparisonAdapter<FtuDomesticExamEvaluationContext> = {
  schoolId: 'ftu',
  methodId: ftuAdmissionMethods[0].id,
  methodName: ftuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateFtuDomesticExamAdmission(profile, context) };
  },
};

