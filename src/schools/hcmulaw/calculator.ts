/**
 * Phương thức 5 (mã 100, xét kết quả thi TN THPT 2026) — "điểm tổ hợp môn" = tổng thô 3 môn theo
 * tổ hợp, KHÔNG nhân hệ số môn nào ("trong đó phải có môn Toán hoặc Ngữ văn với trọng số tính điểm
 * xét (không nhân hệ số) trong tổ hợp xét tuyển là 1/3" — 3 môn đều trọng số bằng nhau 1/3, tức
 * tổng thô), verbatim từ `sources.ts:hcmulaw-method-notice-2026` mục II.
 */
export interface HcmulawThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

function round2(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

export function calculateHcmulawSubjectGroupScore(input: HcmulawThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** ĐXT (Phương thức 5, thang 30) = điểm tổ hợp môn + điểm cộng (Phương thức 5 KHÔNG có điểm cộng —
 * xem `evaluate.ts`) + điểm ưu tiên, kẹp trần 30. */
export function calculateHcmulawThpt5FinalScore(input: { subjectGroupScore30: number; priority30: number }): number {
  return round2(Math.min(30, input.subjectGroupScore30 + input.priority30));
}
