/** Ngưỡng đảm bảo chất lượng — nguồn `iu-method2-2026`: Điểm xét tuyển (đầy đủ, gồm cộng+ưu
 * tiên) ≥50/100. UniscoreVN chỉ tính được Điểm học lực + điểm xét thưởng đã biết (chưa gồm điểm
 * thưởng/khuyến khích/ưu tiên còn thiếu số liệu) — nên đây là NGƯỠNG DƯỚI, không phải kết luận
 * cuối cùng. */
export const IU_ADMISSION_THRESHOLD_100 = 50;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

export function checkIuThresholdLowerBound(partialScore: number): EligibilityResult {
  return {
    pass: partialScore >= IU_ADMISSION_THRESHOLD_100,
    requiredText: `Điểm xét tuyển đầy đủ (thang 100) ≥ ${IU_ADMISSION_THRESHOLD_100} — điểm đã tính (${partialScore}) là NGƯỠNG DƯỚI, chưa gồm điểm thưởng/khuyến khích/ưu tiên`,
  };
}
