import { findRecentCutoffComparisons } from '../../core/cutoffComparison';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext, withProgramCutoffComparison } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUsshAdmission, type UsshEvaluationContext } from './evaluate';
import { usshAdmissionMethods } from './methods';
import { usshCutoffs } from './data/cutoffs';

export type UsshComparisonContext = UsshEvaluationContext & { selectedProgramId?: string };

function buildContext(selection: Omit<ComparisonSelection, 'id'>): UsshComparisonContext {
  return {
    selectedProgramId: selection.programId,
    subjectContext: getSubjectContext(selection.context?.combinationId),
    hasBonusAchievement: selection.context?.hasUsshBonusAchievement,
  };
}

export const usshComparisonAdapter: SchoolComparisonAdapter<UsshComparisonContext> = {
  schoolId: 'ussh',
  methodId: usshAdmissionMethods[0].id,
  methodName: usshAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    const method = usshAdmissionMethods[0];
    const evaluation = evaluateUsshAdmission(profile, context);
    /** Đọc thẳng structured identity do evaluator set (`comparisonContext.applicantTypeId`) —
     * KHÔNG còn parse `explanation[].label` bằng regex (đã bỏ, xem `docs/architecture.md` mục
     * loại bỏ classify-bằng-parse-text). Đổi wording label không còn ảnh hưởng cutoff matching. */
    const applicantTypeId = evaluation.comparisonContext?.applicantTypeId;

    return withProgramCutoffComparison({
      evaluation,
      selectedProgramId: context.selectedProgramId,
      missingProgramLabel: 'Chọn ngành USSH để so với đúng mức điểm chuẩn.',
      getCutoffComparisons: () => {
        if (!evaluation.score || !context.selectedProgramId || !applicantTypeId) return undefined;
        const records = usshCutoffs.filter((cutoff) => cutoff.programId === context.selectedProgramId);
        return findRecentCutoffComparisons({
          records,
          targetYear: method.year,
          applicantScore: evaluation.score.value,
          applicantScale: evaluation.score.scale,
          selection: { programId: context.selectedProgramId, applicantTypeId },
        });
      },
    });
  },
};
