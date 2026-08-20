import { findHcmulawProgram, type HcmulawProgramId } from './programs';

export interface HcmulawEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Ngưỡng đầu vào theo ngành — so với ĐXT đã tính đầy đủ (điểm tổ hợp + ưu tiên [+ cộng nếu có]).
 * Dùng chung cho mọi phương thức (ngưỡng là 1 giá trị/ngành, method-agnostic — xem
 * `sources.ts:hcmulaw-quality-threshold-2026`). `methodLabel` chỉ để hiện text, không ảnh hưởng so
 * sánh số. */
export function checkHcmulawThreshold(finalScore30: number, programId: HcmulawProgramId, methodLabel: string): HcmulawEligibilityResult {
  const program = findHcmulawProgram(programId);
  if (!program) {
    return { pass: false, requiredText: 'Ngành không xác định trong danh mục HCMULAW đã import.' };
  }
  return {
    pass: finalScore30 >= program.threshold30,
    requiredText: `Điểm xét tuyển (${methodLabel}) ≥ ${program.threshold30.toFixed(2)}/30 (ngành: ${program.name})`,
  };
}

/** Giữ tên cũ cho Phương thức 5 (thi TN THPT) — alias mỏng qua `checkHcmulawThreshold`. */
export function checkHcmulawThpt5Threshold(finalScore30: number, programId: HcmulawProgramId): HcmulawEligibilityResult {
  return checkHcmulawThreshold(finalScore30, programId, 'Phương thức 5, thi TN THPT 2026');
}
