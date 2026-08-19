import { findRecentCutoffComparisons } from '../../core/cutoffComparison';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext, withProgramCutoffComparison } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateIuAdmission, type IuEvaluationContext } from './evaluate';
import { iuAdmissionMethods } from './methods';
import { iuCutoffs2026 } from './data/cutoffs';

function buildContext(selection: Omit<ComparisonSelection, 'id'>): IuEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), programId: selection.programId };
}

export const iuComparisonAdapter: SchoolComparisonAdapter<IuEvaluationContext> = {
  schoolId: 'iu',
  methodId: iuAdmissionMethods[0].id,
  methodName: iuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    const method = iuAdmissionMethods[0];
    const evaluation = evaluateIuAdmission(profile, context);

    return withProgramCutoffComparison({
      evaluation,
      selectedProgramId: context.programId,
      missingProgramLabel: 'Chọn ngành IU để so với đúng mốc điểm chuẩn.',
      getCutoffComparisons: () => {
        if (!evaluation.score || !context.programId) return undefined;
        const records = iuCutoffs2026.filter((cutoff) => cutoff.programId === context.programId);
        return findRecentCutoffComparisons({
          records,
          targetYear: method.year,
          applicantScore: evaluation.score.value,
          applicantScale: evaluation.score.scale,
          selection: { programId: context.programId },
        });
      },
    });
  },
};
