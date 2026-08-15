/**
 * Ngưỡng đảm bảo chất lượng đầu vào 2026 — nguồn `ussh-threshold-2026`. Áp dụng chung mọi ngành/
 * tổ hợp, chưa gồm ưu tiên/điểm cộng. Đây là 3 ngưỡng ĐẦU VÀO riêng biệt (điều kiện đăng ký), khác
 * với công thức tính Điểm học lực (ĐHL1/ĐHL2/ĐHL3, xem `calculator.ts`) — từ re-audit 2026-08-15,
 * ĐHL tính được đầy đủ không cần α (α chỉ dùng nội bộ khi trường xác định điểm chuẩn theo tổ hợp).
 */
export const USSH_THPT_COMBINATION_THRESHOLD_30 = 17;
export const USSH_TRANSCRIPT_COMBINATION_THRESHOLD_30 = 17;
export const USSH_DGNL_THRESHOLD_1200 = 620;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

export function checkUsshThptThreshold(thptRawTotal30: number): EligibilityResult {
  return {
    pass: thptRawTotal30 >= USSH_THPT_COMBINATION_THRESHOLD_30,
    requiredText: `Tổng điểm tổ hợp THPT (thang 30) ≥ ${USSH_THPT_COMBINATION_THRESHOLD_30}`,
  };
}

export function checkUsshTranscriptThreshold(transcriptTotal30: number): EligibilityResult {
  return {
    pass: transcriptTotal30 >= USSH_TRANSCRIPT_COMBINATION_THRESHOLD_30,
    requiredText: `Tổng điểm tổ hợp học bạ (thang 30, trung bình cả năm mỗi môn) ≥ ${USSH_TRANSCRIPT_COMBINATION_THRESHOLD_30}`,
  };
}

export function checkUsshDgnlThreshold(dgnlRaw1200: number): EligibilityResult {
  return {
    pass: dgnlRaw1200 >= USSH_DGNL_THRESHOLD_1200,
    requiredText: `Điểm ĐGNL ĐHQG-HCM (thang 1200) ≥ ${USSH_DGNL_THRESHOLD_1200}`,
  };
}
