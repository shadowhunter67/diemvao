/**
 * Ngưỡng đảm bảo chất lượng đầu vào Phương thức 2 (2026) — nguồn `hcmus-threshold-method2-2026`.
 * CHỈ implement phần đọc được dạng text: ngưỡng THPT tổ hợp (thang 30) + điều kiện riêng ngành Kỹ
 * thuật hạt nhân (Toán, Lý ≥7.5 — số cụ thể, đọc được). Ngưỡng ĐGNL 2026 và điều kiện "top 20%/
 * top 25% quốc gia" của ngành Thiết kế vi mạch nằm trong ẢNH/BẢNG không đọc được dạng text — xem
 * `knowledgeGaps.ts`, KHÔNG suy đoán số liệu.
 */
export const HCMUS_THPT_COMBINATION_THRESHOLD_30 = 15.0;
export const HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE = 7.5;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** `thptRawTotal30`: tổng điểm 3 môn tổ hợp thi tốt nghiệp THPT 2026, thang 30 (chưa quy đổi). */
export function checkHcmusThptThreshold(thptRawTotal30: number): EligibilityResult {
  return {
    pass: thptRawTotal30 >= HCMUS_THPT_COMBINATION_THRESHOLD_30,
    requiredText: `Tổng điểm tổ hợp môn xét tuyển (thang 30) ≥ ${HCMUS_THPT_COMBINATION_THRESHOLD_30}`,
  };
}

export function checkHcmusNuclearEngineeringCondition(mathScore: number, physicsScore: number): EligibilityResult {
  return {
    pass: mathScore >= HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE && physicsScore >= HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE,
    requiredText: `Ngành Kỹ thuật hạt nhân: điểm Toán và Vật lý (thang 10, thi tốt nghiệp THPT) đều ≥ ${HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE}`,
  };
}
