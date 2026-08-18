/** Xét THPT — tổng thô 3 môn thi tốt nghiệp THPT theo tổ hợp, KHÔNG nhân hệ số môn nào
 * (`sources.ts:hutech-admission-plan-2026`). */
export interface HutechThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

function round2(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

export function calculateHutechThptRawScore(input: HutechThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** Điểm xét tuyển cuối (xét THPT, thang 30) = Điểm học lực (raw) + Điểm ưu tiên — kẹp 30. Không có
 * thành phần điểm cộng trong phạm vi exact đã claim (ĐC=0, xem `methods.ts`/`evaluate.ts`). */
export function calculateHutechThptFinalScore(input: { raw30: number; priority30: number }): number {
  return round2(Math.min(30, input.raw30 + input.priority30));
}

/** Điểm xét tuyển cuối (xét ĐGNL, thang 1200) = Tổng điểm ĐGNL + Điểm ưu tiên. */
export function calculateHutechDgnlFinalScore(input: { dgnlScore1200: number; priority1200: number }): number {
  return round2(input.dgnlScore1200 + input.priority1200);
}
