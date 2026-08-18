import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUhsAdmission, type UhsEvaluationContext } from './evaluate';
import { uhsAdmissionMethods } from './methods';
import { UHS_PROGRAMS } from './programs';

/** UHS chưa có cutoff comparison ở `/compare` (partial — dữ liệu ngưỡng weights-range/cutoffs 2026
 * chưa đủ verified, xem `knowledgeGaps.ts`) — giữ nguyên hành vi cũ, không thêm cutoff wiring. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): UhsEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  const selectedProgram = UHS_PROGRAMS.find((program) => program.id === selection.programId);
  return {
    selectedProgramId: selection.programId,
    subjectContext: subjectContext && (!selectedProgram || selectedProgram.combinations.includes(subjectContext.combinationId)) ? subjectContext : undefined,
  };
}

export const uhsComparisonAdapter: SchoolComparisonAdapter<UhsEvaluationContext> = {
  schoolId: 'uhs',
  methodId: uhsAdmissionMethods[0].id,
  methodName: uhsAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateUhsAdmission(profile, context) };
  },
};
