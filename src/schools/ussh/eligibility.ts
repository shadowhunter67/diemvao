/**
 * Ngưỡng đảm bảo chất lượng đầu vào 2026 — nguồn `ussh-threshold-2026`. Áp dụng chung mọi ngành/
 * tổ hợp, chưa gồm ưu tiên/điểm cộng. Hệ số α1 (ĐGNL↔THPT) và α2 (giữa các tổ hợp) trường tự nói
 * "sẽ phân tích trong quá trình xử lý nguyện vọng" — KHÔNG công bố giá trị cụ thể, nên UniscoreVN
 * chỉ dừng ở kiểm tra 3 ngưỡng riêng biệt, không tính được điểm xét tuyển tổng hợp cuối cùng.
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
