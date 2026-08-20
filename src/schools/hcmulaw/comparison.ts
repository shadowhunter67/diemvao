import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHcmulawThpt5Admission, type HcmulawThpt5EvaluationContext } from './evaluate';
import { hcmulawAdmissionMethods } from './methods';
import { findHcmulawProgram, type HcmulawProgramId } from './programs';

/** HCMULAW chưa có cutoff comparison (chưa import điểm chuẩn theo ngành, chỉ có ngưỡng đầu vào) —
 * map `programId` + `context.combinationId` generic sang context riêng của Phương thức 5 (mã 100).
 * Phương thức 4 (V-SAT) cũng exact từ batch 2026-08-20 nhưng CHƯA wire vào `/compare` (cần input
 * riêng — điểm V-SAT từng môn, không có trong hồ sơ dùng chung) — ngoài phạm vi batch đó, xem
 * `evaluate.ts:evaluateHcmulawVsat4Admission`. `combinationId` dùng CHUNG field với các trường khác trong `/compare`
 * (`COMMON_SUBJECT_COMBINATIONS`) nhưng HCMULAW tự tra lại theo `programId` đã chọn vì mỗi ngành có
 * danh mục tổ hợp/ngưỡng riêng — không dùng `getSubjectContext()` helper chung vì cần validate tổ
 * hợp đó có thuộc đúng ngành hay không (khác các trường chỉ cần biết 3 môn, không cần khớp ngành). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HcmulawThpt5EvaluationContext {
  const programId = selection.programId as HcmulawProgramId | undefined;
  if (!programId) return {};
  const program = findHcmulawProgram(programId);
  if (!program) return {};
  const combinationCode = selection.context?.combinationId;
  return { programId: program.id, combinationCode };
}

export const hcmulawComparisonAdapter: SchoolComparisonAdapter<HcmulawThpt5EvaluationContext> = {
  schoolId: 'hcmulaw',
  methodId: hcmulawAdmissionMethods[3].id,
  methodName: hcmulawAdmissionMethods[3].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHcmulawThpt5Admission(profile, context) };
  },
};
