/** Ngưỡng đảm bảo chất lượng IU 2026 — nguồn `iu-admission-info-2026` Khoản 3: "Đối với chương
 * trình đào tạo do Trường ĐHQT cấp bằng: Thí sinh có Điểm xét tuyển từ 50 điểm trở lên." (chương
 * trình liên kết quốc tế cùng ngưỡng 50 + yêu cầu tiếng Anh riêng — xem `evaluate.ts` note, chưa
 * implement điều kiện tiếng Anh liên kết trong lượt này). Từ khi có full Điểm cộng + Điểm ưu
 * tiên (2026-08-14), đây là so sánh trên ĐIỂM XÉT TUYỂN THẬT (không còn là ngưỡng dưới nữa). */
export const IU_ADMISSION_THRESHOLD_100 = 50;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

export function checkIuThresholdLowerBound(finalScore: number): EligibilityResult {
  return {
    pass: finalScore >= IU_ADMISSION_THRESHOLD_100,
    requiredText: `Ngưỡng đảm bảo chất lượng: Điểm xét tuyển (thang 100) ≥ ${IU_ADMISSION_THRESHOLD_100} — điểm đã tính (${finalScore}).`,
  };
}
