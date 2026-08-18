import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateTdtuPt1Admission, type TdtuPt1EvaluationContext } from './evaluate';
import { tdtuAdmissionMethods } from './methods';

/** TDTU chưa có cutoff comparison ở `/compare` (chưa import điểm chuẩn theo ngành) — chỉ map tổ
 * hợp môn generic sang PT1 (phương thức chính, Đối tượng 1.1); môn chính (weight×2) mặc định lấy
 * `subjects[0]` của tổ hợp generic — KHÔNG có nguồn để biết đúng "môn 3" theo văn bản TDTU cho tổ
 * hợp cụ thể (Phụ lục 2 chưa import), đây là quy ước bridge tối thiểu, không phải rule TDTU thật. */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): TdtuPt1EvaluationContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  if (!subjectContext) return {};
  return { subjectContext: { combinationId: subjectContext.combinationId, mainSubjectId: subjectContext.subjects[0], subjects: subjectContext.subjects } };
}

export const tdtuComparisonAdapter: SchoolComparisonAdapter<TdtuPt1EvaluationContext> = {
  schoolId: 'tdtu',
  methodId: tdtuAdmissionMethods[0].id,
  methodName: tdtuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateTdtuPt1Admission(profile, context) };
  },
};
