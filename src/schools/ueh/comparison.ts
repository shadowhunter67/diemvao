import { findRecentCutoffComparisons } from '../../core/cutoffComparison';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { withProgramCutoffComparison } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { buildUehEvaluationInput, buildUehExactEvaluationInput } from './applicantProfileAdapter';
import { evaluateUehAdmission, evaluateUehExactAdmission, type UehPartialInput } from './evaluate';
import { uehAdmissionMethods } from './methods';
import { uehCutoffs } from './data/cutoffs';
import { uehPrograms } from './data/programs';

export type UehComparisonContext = UehPartialInput & { selectedProgramId?: string };

function buildContext(selection: Omit<ComparisonSelection, 'id'>): UehComparisonContext {
  const selectedProgram = uehPrograms.find((program) => program.id === selection.programId);
  return { selectedProgramId: selection.programId, campus: selectedProgram?.campus };
}

export const uehComparisonAdapter: SchoolComparisonAdapter<UehComparisonContext> = {
  schoolId: 'ueh',
  methodId: uehAdmissionMethods[0].id,
  methodName: uehAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    const method = uehAdmissionMethods[0];
    const selectedProgram = uehPrograms.find((program) => program.id === context.selectedProgramId);
    const campus = context.campus ?? selectedProgram?.campus ?? 'hcmc';
    const exactInput = buildUehExactEvaluationInput(profile, { campus });
    let evaluation = evaluateUehExactAdmission(exactInput);
    if (evaluation.score === undefined && profile.exams?.vact?.total !== undefined && exactInput.examScore30 === undefined) {
      evaluation = evaluateUehAdmission(buildUehEvaluationInput(profile, context));
    }

    return withProgramCutoffComparison({
      evaluation,
      selectedProgramId: context.selectedProgramId,
      missingProgramLabel: 'Chọn ngành UEH để so với đúng mốc điểm chuẩn.',
      getCutoffComparisons: () => {
        if (!evaluation.score || !context.selectedProgramId) return undefined;
        const records = uehCutoffs.filter((cutoff) => cutoff.programId === context.selectedProgramId);
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
