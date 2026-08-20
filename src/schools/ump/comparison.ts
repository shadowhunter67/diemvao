import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateUmpAdmission, type UmpEvaluationContext } from './evaluate';
import { umpAdmissionMethods } from './methods';

/** UMP chưa có cutoff comparison (điểm trúng tuyển 2026 đã có nguồn nhưng chưa transcribe, xem
 * `knowledgeGaps.ts:ump-cutoffs-2026-not-imported`) — chỉ map tổ hợp môn + ngành đã chọn sang
 * phương thức xét THPT (phương thức duy nhất, exact không điều kiện). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): UmpEvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  return {
    selectedProgramId: selection.programId,
    subjectContext: subjectContext ? { combinationId: subjectContext.combinationId, subjects: subjectContext.subjects } : undefined,
  };
}

export const umpComparisonAdapter: SchoolComparisonAdapter<UmpEvaluationContext> = {
  schoolId: 'ump',
  methodId: umpAdmissionMethods[0].id,
  methodName: umpAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateUmpAdmission(profile, context) };
  },
};
