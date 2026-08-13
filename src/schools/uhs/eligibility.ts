/**
 * Ngưỡng đảm bảo chất lượng — nguồn `uhs-info-2026`. CHỈ có số cụ thể cho Y khoa/Dược: tổng điểm
 * tổ hợp (thang 30) ≥20 HOẶC từng môn (thang 10) ≥8.5. Ba ngành còn lại chưa có số cụ thể — xem
 * `knowledgeGaps.ts`, KHÔNG suy đoán dùng chung ngưỡng Y khoa/Dược cho ngành khác.
 */
export const UHS_MEDICINE_PHARMACY_COMBINATION_THRESHOLD_30 = 20;
export const UHS_MEDICINE_PHARMACY_SUBJECT_THRESHOLD_10 = 8.5;

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** `subjectScores`: điểm từng môn trong tổ hợp (thang 10) — đạt nếu tổng ≥20 HOẶC có ít nhất 1
 * môn ≥8.5 (đúng nguyên văn "hoặc" trong nguồn, không phải AND). */
export function checkUhsMedicinePharmacyThreshold(combinationTotal30: number, subjectScores: readonly number[]): EligibilityResult {
  const passByTotal = combinationTotal30 >= UHS_MEDICINE_PHARMACY_COMBINATION_THRESHOLD_30;
  const passBySubject = subjectScores.some((score) => score >= UHS_MEDICINE_PHARMACY_SUBJECT_THRESHOLD_10);
  return {
    pass: passByTotal || passBySubject,
    requiredText: `Tổng điểm tổ hợp (thang 30) ≥ ${UHS_MEDICINE_PHARMACY_COMBINATION_THRESHOLD_30} HOẶC có môn (thang 10) ≥ ${UHS_MEDICINE_PHARMACY_SUBJECT_THRESHOLD_10}`,
  };
}
