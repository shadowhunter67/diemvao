import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHuceAdmission, type HuceEvaluationContext } from './evaluate';
import { huceAdmissionMethods } from './methods';
import type { HuceMethodId } from './thresholds';

function isHuceMethodId(value: string | undefined): value is HuceMethodId {
  return huceAdmissionMethods.some((method) => method.id === value);
}

function buildContext(selection: Omit<ComparisonSelection, 'id'>): HuceEvaluationContext {
  return {
    methodId: isHuceMethodId(selection.methodId) ? selection.methodId : 'huce-thpt-exam-2026',
    programId: selection.programId,
    subjectContext: getSubjectContext(selection.context?.combinationId),
  };
}

export const huceComparisonAdapter: SchoolComparisonAdapter<HuceEvaluationContext> = {
  schoolId: 'huce',
  methodId: huceAdmissionMethods[0].id,
  methodName: huceAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHuceAdmission(profile, context) };
  },
};
