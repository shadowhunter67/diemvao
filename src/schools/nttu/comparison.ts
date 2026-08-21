import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateNttuTranscriptAdmission, type NttuTranscriptEvaluationContext } from './evaluate';
import { nttuAdmissionMethods } from './methods';

/** NTTU chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như VLU/HUIT. Adapter dùng Phương thức học bạ (phương thức duy nhất đã implement).
 * `thresholdGroup` mặc định `'standard'` — `SchoolComparisonContext` chưa có field chọn nhóm ngành
 * NTTU (mapping ngành→nhóm ngưỡng còn là knowledge gap, xem `nttu-program-catalog-not-imported`).
 * NTTU không có subject-combination input (phương thức học bạ nhận tổng điểm trực tiếp), nên
 * `buildContext` không dùng `selection.context` — giữ tối giản, để `transcriptTotal30` trống cho
 * roster mặc định (kết quả sẽ là `unknown`, đúng hành vi khi thiếu input). */
function buildContext(_selection: Omit<ComparisonSelection, 'id'>): NttuTranscriptEvaluationContext {
  return { thresholdGroup: 'standard' };
}

export const nttuComparisonAdapter: SchoolComparisonAdapter<NttuTranscriptEvaluationContext> = {
  schoolId: 'nttu',
  methodId: nttuAdmissionMethods[0].id,
  methodName: nttuAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateNttuTranscriptAdmission(profile, context) };
  },
};
