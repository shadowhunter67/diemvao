import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateNeuEquivalence, type NeuEquivalenceEvaluationContext } from './evaluate';
import { neuAdmissionMethods } from './methods';

function buildContext(_selection: Omit<ComparisonSelection, 'id'>): NeuEquivalenceEvaluationContext {
  return {};
}

export const neuComparisonAdapter: SchoolComparisonAdapter<NeuEquivalenceEvaluationContext> = {
  schoolId: 'neu',
  methodId: neuAdmissionMethods[0].id,
  methodName: neuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateNeuEquivalence(profile, context) };
  },
};

