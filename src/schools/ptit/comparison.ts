import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluatePtitDomesticExamAdmission, type PtitDomesticExamEvaluationContext } from './evaluate';
import { ptitAdmissionMethods } from './methods';

function buildContext(_selection: Omit<ComparisonSelection, 'id'>): PtitDomesticExamEvaluationContext {
  return { exam: 'vact' };
}

export const ptitComparisonAdapter: SchoolComparisonAdapter<PtitDomesticExamEvaluationContext> = {
  schoolId: 'ptit',
  methodId: ptitAdmissionMethods[0].id,
  methodName: ptitAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluatePtitDomesticExamAdmission(profile, context) };
  },
};

