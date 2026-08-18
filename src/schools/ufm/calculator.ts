/** Xét THPT (chương trình Chuẩn) — tổng thô 3 môn thi tốt nghiệp THPT theo tổ hợp, KHÔNG nhân hệ
 * số môn nào (`evidence.ts` — câu ngưỡng verbatim đọc như tổng thô; hệ số Toán×2 chỉ áp dụng
 * chương trình Tiếng Anh toàn phần theo 1 nguồn thứ cấp CHƯA implement, xem
 * `knowledgeGaps.ts:ufm-math-coefficient-scope-conflicting`). */
export interface UfmThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

function round2(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

export function calculateUfmThptRawScore(input: UfmThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** Điểm xét tuyển cuối (xét THPT, thang 30) = Điểm học lực (raw) + Điểm ưu tiên — kẹp 30. Không có
 * thành phần điểm cộng trong phạm vi exact đã claim (ĐC=0, xem `methods.ts`/`evaluate.ts`). */
export function calculateUfmThptFinalScore(input: { raw30: number; priority30: number }): number {
  return round2(Math.min(30, input.raw30 + input.priority30));
}

/** Điểm xét tuyển cuối (xét ĐGNL, thang 1200) = Tổng điểm ĐGNL + Điểm ưu tiên. */
export function calculateUfmDgnlFinalScore(input: { dgnlScore1200: number; priority1200: number }): number {
  return round2(input.dgnlScore1200 + input.priority1200);
}
