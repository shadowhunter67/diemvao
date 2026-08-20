import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng — UMP tự công bố trực tiếp (Thông báo 2415/TB-ĐHYD mục 6.2.2(b),
 * xem `evidence.ts:umpPriorityEvidence`), khớp công thức chuẩn quốc gia Thông tư 08/2022/TT-BGDĐT
 * Điều 7.
 */
export const UMP_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const UMP_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupUmpStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (UMP_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (UMP_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

export interface UmpPriorityResult {
  effectivePriority30: number;
  reduced: boolean;
}

/** ĐUT = Mức điểm ưu tiên nếu tổng < 22,5/30; nếu ≥ 22,5: ĐUT = [(30 - tổng)/7,5] × Mức điểm ưu
 * tiên, làm tròn đến hàng phần trăm (Thông báo 2415/TB-ĐHYD mục 6.2.2(b)). */
export function calculateUmpPriority30(input: { academicScore30: number; standardPriority30: number }): UmpPriorityResult {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicScore30);
  if (cappedTotal < 22.5) return { effectivePriority30: input.standardPriority30, reduced: false };
  const effectivePriority30 = Math.max(0, round2(((30 - cappedTotal) / 7.5) * input.standardPriority30));
  return { effectivePriority30, reduced: true };
}
