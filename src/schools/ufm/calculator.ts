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

/** Xét học bạ (chương trình Chuẩn) — công thức verified 2026-08-19: tổng ĐTB TRUNG BÌNH CẢ 3 NĂM
 * lớp 10/11/12 mỗi môn trong tổ hợp (mỗi môn thang 10, tổng 3 môn thang 30) — khớp trực tiếp với
 * `ApplicantProfile.transcript`, không cần approximation 6HK→3 năm như TDTU/HUTECH. */
export function calculateUfmHocbaRawScore(input: UfmThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** Điểm xét tuyển cuối (xét THPT, thang 30) = Điểm học lực (raw) + Điểm ưu tiên (nếu có) + Điểm cộng
 * (nếu có) — kẹp 30 ("Điểm xét tuyển được tính trên thang điểm 30, và không vượt quá mức điểm tối đa
 * là 30", verified 2026-08-19). */
export function calculateUfmThptFinalScore(input: { raw30: number; priority30: number; bonus30?: number }): number {
  return round2(Math.min(30, input.raw30 + input.priority30 + (input.bonus30 ?? 0)));
}
