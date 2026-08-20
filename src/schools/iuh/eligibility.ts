export interface IuhEligibilityResult {
  pass: boolean;
  requiredText: string;
}

const STANDARD_THRESHOLD_30 = 18;

/** Ngưỡng đảm bảo chất lượng đầu vào — xét kết hợp, Trụ sở chính TP.HCM, chương trình Chuẩn (mọi
 * ngành TRỪ Dược học/Pháp luật — 2 nhóm này áp ngưỡng riêng theo Bộ GD-ĐT, CHƯA xác định số cụ thể,
 * xem `knowledgeGaps.ts`). Chương trình tăng cường tiếng Anh (17,00) và Phân hiệu Quảng Ngãi (16,00)
 * KHÔNG implement trong module này. `total30` là điểm học lực gốc (Max(ĐTN,ĐHB) không tính hệ số,
 * KHÔNG gồm điểm ưu tiên/điểm cộng — đúng câu "Lưu ý" trong `iuh-quality-threshold-2026`). */
export function checkIuhStandardThreshold(total30: number): IuhEligibilityResult {
  return {
    pass: total30 >= STANDARD_THRESHOLD_30,
    requiredText: `Điểm học lực gốc (không hệ số, không ưu tiên/điểm cộng) ≥ ${STANDARD_THRESHOLD_30}/30 (Trụ sở chính TP.HCM, chương trình Chuẩn, trừ Dược học và các ngành Pháp luật)`,
  };
}
