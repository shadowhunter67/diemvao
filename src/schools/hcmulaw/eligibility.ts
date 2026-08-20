import { findHcmulawProgram, type HcmulawProgramId } from './programs';

export interface HcmulawEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Ngưỡng đầu vào Phương thức 5 (thi TN THPT 2026, thang 30) theo ngành — so với ĐXT đã tính
 * (tổng thô 3 môn + ưu tiên, không điểm cộng — xem `calculator.ts`). */
export function checkHcmulawThpt5Threshold(finalScore30: number, programId: HcmulawProgramId): HcmulawEligibilityResult {
  const program = findHcmulawProgram(programId);
  if (!program) {
    return { pass: false, requiredText: 'Ngành không xác định trong danh mục HCMULAW đã import.' };
  }
  return {
    pass: finalScore30 >= program.threshold30,
    requiredText: `Điểm xét tuyển (Phương thức 5, thi TN THPT 2026) ≥ ${program.threshold30.toFixed(2)}/30 (ngành: ${program.name})`,
  };
}
