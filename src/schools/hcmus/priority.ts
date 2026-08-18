import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng HCMUS 2026, thang 30. Provenance: `evidence.ts:hcmusPriorityEvidence`
 * (`verification: 'cross-checked'`, sourceId `hcmus-academic-score-formula-2026`) — KHÔNG trang
 * HCMUS text nào (đã audit 2026-08-17) công bố trực tiếp bảng KV/UT hay ngưỡng 22.5/7.5 này; các
 * con số khớp CHÍNH XÁC bảng ưu tiên chuẩn quốc gia Bộ GDĐT đã verified/cross-checked độc lập ở
 * UEL/IU/USSH trong repo (cùng công thức tỉ lệ 75%/25%). Xem `evidence.ts` cho chi tiết cross-check.
 */
export const HCMUS_PRIORITY_REDUCTION_THRESHOLD_30 = 22.5;
export const HCMUS_PRIORITY_REDUCTION_DIVISOR_30 = 7.5;
export const HCMUS_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};
export const HCMUS_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupHcmusStandardPriority(region: string | undefined, category: string | undefined): number {
  return (region ? (HCMUS_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (HCMUS_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

export function calculateHcmusEffectivePriority(input: { academicPlusBonus30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  if (input.academicPlusBonus30 < HCMUS_PRIORITY_REDUCTION_THRESHOLD_30) {
    return { effectivePriority30: input.standardPriority30, reduced: false };
  }
  const effectivePriority30 = Math.max(
    0,
    round2(((30 - input.academicPlusBonus30) / HCMUS_PRIORITY_REDUCTION_DIVISOR_30) * input.standardPriority30)
  );
  return { effectivePriority30, reduced: true };
}
