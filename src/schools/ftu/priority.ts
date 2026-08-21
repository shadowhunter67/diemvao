import { round2 } from '../../core/round2';
import type { FtuProgramGroup } from './calculator';

export const FTU_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const FTU_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupFtuStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (FTU_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (FTU_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

export function calculateFtuEffectivePriority(input: {
  baseScoreWithBonus: number;
  standardPriority30: number;
  programGroup: FtuProgramGroup;
}): { effectivePriority: number; reduced: boolean } {
  const scale = input.programGroup === 'integrated40' ? 40 : 30;
  const divisor = input.programGroup === 'integrated40' ? 10 : 7.5;
  const standardPriority = input.programGroup === 'integrated40' ? round2((input.standardPriority30 * 4) / 3) : input.standardPriority30;
  if (standardPriority === 0) return { effectivePriority: 0, reduced: false };
  const cappedBase = Math.min(scale, input.baseScoreWithBonus);
  if (cappedBase >= scale) return { effectivePriority: 0, reduced: true };
  return { effectivePriority: round2(((scale - cappedBase) / divisor) * standardPriority), reduced: true };
}

