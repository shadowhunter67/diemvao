/**
 * Quy tắc giảm điểm ưu tiên IU 2026, nguồn `iu-admission-info-2026` Mục 2.b — nguyên văn:
 * "Đối với thí sinh đạt (Điểm học lực + Điểm cộng) < 75 điểm, thì được hưởng mức Điểm ưu tiên
 * theo quy định tại Khoản 7. Đối với thí sinh đạt (Điểm học lực + Điểm cộng) >= 75 điểm, thì
 * Điểm ưu tiên = [(100 – Điểm học lực – Điểm cộng)/25] x mức Điểm ưu tiên được hưởng tại Khoản 7."
 *
 * Cùng cấu trúc công thức (ngưỡng 75, chia 25, thang 100) với `schools/uel/priorityReduction.ts`
 * — đây là quy định chung Bộ GD&ĐT áp cho thang 100 (không phải trùng hợp giữa 2 trường).
 */
export interface IuPriorityReductionInput {
  /** Điểm học lực + Điểm cộng đã cộng sẵn (thang 100). */
  academicPlusBonus: number;
  /** Điểm ưu tiên khu vực/đối tượng theo bảng Khoản 7 (chưa giảm) — xem `priority.ts`. */
  standardPriority: number;
}

export interface IuPriorityReductionResult {
  effectivePriority: number;
  reduced: boolean;
}

const REDUCTION_THRESHOLD = 75;
const REDUCTION_DIVISOR = 25;
const SCALE_MAX = 100;

export function calculateIuEffectivePriority(input: IuPriorityReductionInput): IuPriorityReductionResult {
  if (input.academicPlusBonus < REDUCTION_THRESHOLD) {
    return { effectivePriority: input.standardPriority, reduced: false };
  }
  const effectivePriority =
    Math.round((((SCALE_MAX - input.academicPlusBonus) / REDUCTION_DIVISOR) * input.standardPriority) * 100) / 100;
  return { effectivePriority: Math.max(0, effectivePriority), reduced: true };
}
