import { round2 } from '../../core/round2';

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
