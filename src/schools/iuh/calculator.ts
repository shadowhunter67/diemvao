import { round2 } from '../../core/round2';

/**
 * Công thức xét tuyển kết hợp IUH 2026 (thang 30) — xem `evidence.ts:iuhFormulaEvidence` cho verbatim
 * đầy đủ. Module này CHỈ tính XT1/XT2 (không có nhánh XT3/ĐGNL — xem comment ở `evidence.ts` và
 * `evaluate.ts`). ĐTN/ĐHB đều là tổng thô 3 môn theo tổ hợp xét tuyển, KHÔNG nhân hệ số (formula gốc
 * không nêu hệ số môn nào, khác UFM có hệ số Toán×2 riêng cho chương trình Tiếng Anh toàn phần).
 */
export interface IuhThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

/** ĐTN — tổng thô 3 môn thi tốt nghiệp THPT 2026 theo tổ hợp xét tuyển. */
export function calculateIuhThptTotal(input: IuhThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** ĐHB — tổng thô 3 môn kết quả học tập THPT năm lớp 12 theo tổ hợp xét tuyển (đọc từ
 * `ApplicantProfile.transcript.grade12`, KHÔNG cần dữ liệu theo học kỳ). */
export function calculateIuhTranscriptTotal(input: IuhThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** XT1 = 0.7×ĐK + 0.3×ĐHB + Đ(Kv;Đt) + ĐC. Phạm vi module này: ĐK = ĐTN (không có ĐGNL trong ĐK vì
 * nhánh ĐGNL bị chặn, xem `evidence.ts`). */
export function calculateIuhXt1(input: { thptTotal30: number; transcriptTotal30: number; priority30: number; bonus30: number }): number {
  return round2(0.7 * input.thptTotal30 + 0.3 * input.transcriptTotal30 + input.priority30 + input.bonus30);
}

/** XT2 = ĐTN + Đ(Kv;Đt) + ĐC. */
export function calculateIuhXt2(input: { thptTotal30: number; priority30: number; bonus30: number }): number {
  return round2(input.thptTotal30 + input.priority30 + input.bonus30);
}

/** ĐXT (phạm vi module: Max(XT1,XT2), KHÔNG có XT3) — "Thang điểm: 30 điểm" đọc như trần cứng
 * (assumption, cùng cách diễn giải với các trường khác trong repo dùng thang 30 — nguồn không ghi rõ
 * câu "không vượt quá 30" verbatim như UFM, nhưng "Thang điểm: 30 điểm" là mục a) đứng ngay đầu công
 * thức nên diễn giải như giới hạn trần). */
export function calculateIuhCombinedFinalScore(input: { xt1: number; xt2: number }): number {
  return round2(Math.min(30, Math.max(input.xt1, input.xt2)));
}
