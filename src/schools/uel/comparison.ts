import { findRecentCutoffComparisons } from '../../core/cutoffComparison';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext, withProgramCutoffComparison } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUelAdmission, type UelEvaluationContext } from './evaluate';
import { uelAdmissionMethods } from './methods';
import { uelCutoffs } from './data/cutoffs';

export type UelComparisonContext = UelEvaluationContext & { selectedProgramId?: string };

function buildContext(selection: Omit<ComparisonSelection, 'id'>): UelComparisonContext {
  return { selectedProgramId: selection.programId, subjectContext: getSubjectContext(selection.context?.combinationId) };
}

export const uelComparisonAdapter: SchoolComparisonAdapter<UelComparisonContext> = {
  schoolId: 'uel',
  methodId: uelAdmissionMethods[0].id,
  methodName: uelAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    const method = uelAdmissionMethods[0];
    const evaluation = evaluateUelAdmission(profile, context);

    return withProgramCutoffComparison({
      evaluation,
      selectedProgramId: context.selectedProgramId,
      missingProgramLabel: 'Chọn ngành UEL để so với đúng mức điểm chuẩn.',
      getCutoffComparisons: () => {
        if (!evaluation.score || !context.selectedProgramId) return undefined;
        const records = uelCutoffs.filter((cutoff) => cutoff.programId === context.selectedProgramId);
        return findRecentCutoffComparisons({
          records,
          targetYear: method.year,
          applicantScore: evaluation.score.value,
          applicantScale: evaluation.score.scale,
          selection: { programId: context.selectedProgramId },
        });
      },
    });
  },
};
