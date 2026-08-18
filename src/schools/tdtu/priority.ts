import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng TDTU 2026, thang 30 — Phụ lục 5 (`sources.ts:tdtu-pl5-priority-2026`),
 * khớp đúng bảng ưu tiên chuẩn quốc gia Bộ GDĐT (giống HCMUTE/USSH). Phụ lục 5 tự cho quy đổi sang
 * thang 100 (×10/3) và thang 1200 (×40) — dùng trực tiếp hằng số quy đổi đó thay vì tự suy ra để
 * tránh sai số làm tròn khác với văn bản.
 */
export const TDTU_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const TDTU_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupTdtuStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (TDTU_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (TDTU_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/**
 * PT1 (thang 100): ĐUT = Mức ưu tiên nếu (Năng lực+Cộng) < 75; nếu ≥75: ĐUT = [(100-(Năng lực+Cộng))/25] × Mức ưu tiên.
 * Mức ưu tiên (thang 100) = mức thang 30 × 10/3 (Phụ lục 5, không tự suy ra).
 */
export function calculateTdtuPt1EffectivePriority(input: { competencyPlusBonus100: number; standardPriority30: number }) {
  const standardPriority100 = round2(input.standardPriority30 * (10 / 3));
  if (standardPriority100 === 0) return { effectivePriority100: 0, reduced: false };
  const cappedTotal = Math.min(100, input.competencyPlusBonus100);
  if (cappedTotal < 75) return { effectivePriority100: standardPriority100, reduced: false };
  const effectivePriority100 = Math.max(0, round2(((100 - cappedTotal) / 25) * standardPriority100));
  return { effectivePriority100, reduced: true };
}

/**
 * PT2/ĐGNL (thang 1200): ĐUT = Mức ưu tiên nếu Tổng ĐGNL < 900; nếu ≥900: ĐUT = [(1200-Tổng ĐGNL)/300] × Mức ưu tiên.
 * Mức ưu tiên (thang 1200) = mức thang 30 × 40.
 */
export function calculateTdtuPt2EffectivePriority(input: { dgnlScore1200: number; standardPriority30: number }) {
  const standardPriority1200 = input.standardPriority30 * 40;
  if (standardPriority1200 === 0) return { effectivePriority1200: 0, reduced: false };
  const cappedScore = Math.min(1200, input.dgnlScore1200);
  if (cappedScore < 900) return { effectivePriority1200: standardPriority1200, reduced: false };
  const effectivePriority1200 = Math.max(0, round2(((1200 - cappedScore) / 300) * standardPriority1200));
  return { effectivePriority1200, reduced: true };
}
