import { round2 } from '../../core/round2';

/**
 * Công thức xét tuyển kết hợp IUH 2026 (thang 30) — xem `evidence.ts:iuhFormulaEvidence` cho verbatim
 * đầy đủ. ĐTN/ĐHB đều là tổng thô 3 môn theo tổ hợp xét tuyển, KHÔNG nhân hệ số (formula gốc không
 * nêu hệ số môn nào, khác UFM có hệ số Toán×2 riêng cho chương trình Tiếng Anh toàn phần).
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

/**
 * ĐTK 2026 ("điểm thủ khoa của kỳ thi Đánh giá năng lực năm 2026", định nghĩa verbatim IUH: "Điểm
 * cao nhất trong kỳ thi đánh giá năng lực") = 1139/1200 — verified qua nguồn CHÍNH THỨC của chính
 * ĐHQG-HCM (Trung tâm Khảo thí và Đánh giá Chất lượng Đào tạo, `cetqa.vnuhcm.edu.vn`, 2026-08-20):
 * "Thí sinh có điểm cao nhất trong Kỳ thi V-ACT đợt 2 là 1.139 điểm" — đợt 2 diễn ra SAU đợt 1 (đợt
 * 1 báo chí ghi tối đa 1098) nên 1139 là điểm cao nhất của CẢ NĂM 2026, khớp đúng định nghĩa "điểm
 * cao nhất trong kỳ thi... năm 2026" (không tách riêng theo đợt) trong văn bản IUH. Cross-check độc
 * lập: UFM (Thông báo 2639/TB-ĐHTCM, đọc trực tiếp PDF gốc) dùng CHÍNH số 1139 làm trần "Khoảng 1"
 * trong bảng quy đổi bách phân vị ĐGNL↔thi TN THPT của họ — 2 nguồn hoàn toàn độc lập (ĐHQG-HCM và
 * UFM) cùng xác nhận 1 con số, đóng dứt điểm `knowledgeGaps.ts:iuh-dgnl-top-score-unresolved`.
 */
export const IUH_DTK_2026 = 1139;

/** ĐĐGNL = (Kết quả ĐGNL × 30) / ĐTK — quy đổi điểm ĐGNL ĐHQG-HCM (thang 1200) sang thang 30. */
export function calculateIuhDgnlConverted(vactScore1200: number): number {
  return round2((vactScore1200 * 30) / IUH_DTK_2026);
}

/** ĐK = Max(ĐTN, ĐĐGNL) — dùng trong XT1. */
export function calculateIuhAcademicScore(input: { thptTotal30: number; dgnlConverted30?: number }): number {
  return Math.max(input.thptTotal30, input.dgnlConverted30 ?? -Infinity);
}

/** XT1 = 0.7×ĐK + 0.3×ĐHB + Đ(Kv;Đt) + ĐC. */
export function calculateIuhXt1(input: { academicScore30: number; transcriptTotal30: number; priority30: number; bonus30: number }): number {
  return round2(0.7 * input.academicScore30 + 0.3 * input.transcriptTotal30 + input.priority30 + input.bonus30);
}

/** XT2 = ĐTN + Đ(Kv;Đt) + ĐC. */
export function calculateIuhXt2(input: { thptTotal30: number; priority30: number; bonus30: number }): number {
  return round2(input.thptTotal30 + input.priority30 + input.bonus30);
}

/** XT3 = ĐĐGNL + Đ(Kv;Đt) + ĐC — chỉ tính khi có điểm ĐGNL. */
export function calculateIuhXt3(input: { dgnlConverted30: number; priority30: number; bonus30: number }): number {
  return round2(input.dgnlConverted30 + input.priority30 + input.bonus30);
}

/** ĐXT = Max(XT1;XT2;XT3), kẹp trần 30 — "Thang điểm: 30 điểm" đọc như trần cứng (assumption, cùng
 * cách diễn giải với các trường khác trong repo dùng thang 30 — nguồn không ghi rõ câu "không vượt
 * quá 30" verbatim như UFM, nhưng "Thang điểm: 30 điểm" là mục a) đứng ngay đầu công thức nên diễn
 * giải như giới hạn trần). `xt3` bỏ trống khi thí sinh không có điểm ĐGNL. */
export function calculateIuhCombinedFinalScore(input: { xt1: number; xt2: number; xt3?: number }): number {
  return round2(Math.min(30, Math.max(input.xt1, input.xt2, input.xt3 ?? -Infinity)));
}
