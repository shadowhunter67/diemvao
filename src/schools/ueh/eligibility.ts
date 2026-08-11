export const UEH_THRESHOLD_HCMC = 65;
export const UEH_THRESHOLD_MEKONG = 60;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

/**
 * Ngưỡng đảm bảo chất lượng đầu vào — thang 100, CHƯA gồm điểm ưu tiên/điểm cộng (đúng nguyên
 * văn nguồn). `admissionScore100` là điểm xét tuyển đã tính (60% thi quy đổi + 40% học bạ quy
 * đổi), KHÔNG phải điểm ĐGNL/THPT thô.
 */
export function checkUehThreshold(admissionScore100: number, campus: 'hcmc' | 'mekong'): EligibilityResult {
  const threshold = campus === 'hcmc' ? UEH_THRESHOLD_HCMC : UEH_THRESHOLD_MEKONG;
  return {
    pass: admissionScore100 >= threshold,
    requiredText: `Điểm xét tuyển (thang 100, chưa gồm ưu tiên/điểm cộng) ≥ ${threshold} (${campus === 'hcmc' ? 'TP.HCM, mã KSA' : 'UEH Mekong – Vĩnh Long, mã KSV'})`,
  };
}
