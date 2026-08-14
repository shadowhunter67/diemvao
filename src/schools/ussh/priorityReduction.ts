/**
 * Quy tắc giảm điểm ưu tiên khi tổng điểm (đã gồm điểm cộng) đạt ≥75 — nguồn ảnh official
 * "Nguyên tắc tính điểm xét tuyển" USSH 2026 (mã trường QSX, xem `sources.ts`
 * `ussh-scoring-principles-2026`), nguyên văn: "Điểm ưu tiên đối với thí sinh có tổng điểm (bao
 * gồm cả điểm cộng) đạt được từ 75 điểm, được xác định theo công thức sau:
 * [(100 – Tổng điểm đạt được đã bao gồm điểm cộng)/25] × Mức điểm ưu tiên khu vực, đối tượng
 * (đã quy đổi về thang điểm 100)."
 *
 * CÙNG HÌNH DẠNG công thức với `schools/uel/priorityReduction.ts` ((100-total)/25 × priority,
 * ngưỡng 75) — nhưng đây là 2 EVIDENCE ĐỘC LẬP từ 2 trường khác nhau, KHÔNG reuse chung 1 hàm
 * (Phần G: "Do not assume UEL/UEH priority helper is reusable merely because formula looks
 * similar" — nếu 1 trong 2 trường đổi công thức sau này, dùng chung sẽ vô tình lệch cả 2).
 */
export interface UsshPriorityReductionInput {
  /** Tổng điểm đã bao gồm điểm cộng (thang 100), CHƯA gồm điểm ưu tiên. */
  totalIncludingBonus: number;
  /** Mức điểm ưu tiên khu vực/đối tượng đã quy đổi về thang 100 (chưa giảm). */
  standardPriority: number;
}

export interface UsshPriorityReductionResult {
  effectivePriority: number;
  reduced: boolean;
}

const REDUCTION_THRESHOLD = 75;
const REDUCTION_DIVISOR = 25;
const SCALE_MAX = 100;

export function calculateUsshEffectivePriority(input: UsshPriorityReductionInput): UsshPriorityReductionResult {
  if (input.totalIncludingBonus < REDUCTION_THRESHOLD) {
    return { effectivePriority: input.standardPriority, reduced: false };
  }
  const effectivePriority = Math.round(((SCALE_MAX - input.totalIncludingBonus) / REDUCTION_DIVISOR) * input.standardPriority * 100) / 100;
  return { effectivePriority, reduced: true };
}
