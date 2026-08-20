import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng — bảng CHUẨN QUỐC GIA, cross-checked nội bộ với 8 trường khác trong
 * repo dùng đúng công thức tỉ lệ 75%/25% này (`evidence.ts:iuhPriorityEvidence`) — IUH không tự công
 * bố bảng số trực tiếp nên `verification: 'cross-checked'`.
 */
export const IUH_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const IUH_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupIuhStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (IUH_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (IUH_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/** ĐUT = MĐUT nếu (học lực+cộng)<22,5/30; nếu ≥22,5: ĐUT=[(30-tổng)/7,5]×MĐUT (bảng chuẩn quốc gia,
 * thang 30 — cùng công thức UFM/HCMUT/UEL/HCMUS/USSH/IU/TDTU/HUFLIT dùng). */
export function calculateIuhPriority30(input: { academicScore30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicScore30);
  if (cappedTotal < 22.5) return { effectivePriority30: input.standardPriority30, reduced: false };
  const effectivePriority30 = Math.max(0, round2(((30 - cappedTotal) / 7.5) * input.standardPriority30));
  return { effectivePriority30, reduced: true };
}
