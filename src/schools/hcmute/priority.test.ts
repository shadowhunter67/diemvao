import { describe, expect, it } from 'vitest';
import { calculateHcmuteEffectivePriority, lookupHcmuteStandardPriority, HCMUTE_PRIORITY_REGION_POINTS_30, HCMUTE_PRIORITY_CATEGORY_POINTS_30 } from './priority';

describe('HCMUTE priority table (Phụ lục 1/2)', () => {
  it('matches official region/category points', () => {
    expect(HCMUTE_PRIORITY_REGION_POINTS_30.KV2).toBe(0.25);
    expect(HCMUTE_PRIORITY_CATEGORY_POINTS_30.UT1).toBe(2);
    expect(lookupHcmuteStandardPriority('KV2', undefined)).toBe(0.25);
  });
});

/**
 * Conformance test — Tier A worked example, Phụ lục 4: thí sinh Nguyễn Văn A thuộc KV2 (MĐUT=0,25),
 * ĐHL=26,850 + ĐC=1,00 = 27,850 ≥ 22,50 → ĐUT = [(30,00-27,850)/7,50] × 0,25 = 0,07 (đã làm tròn).
 */
describe('calculateHcmuteEffectivePriority — Tier A worked example', () => {
  it('reduces priority above the 22.5 threshold, matching the official worked example', () => {
    const result = calculateHcmuteEffectivePriority({ academicPlusBonus30: 27.85, standardPriority30: 0.25 });
    expect(result.reduced).toBe(true);
    expect(result.effectivePriority30).toBe(0.07);
  });

  it('does not reduce priority below the threshold', () => {
    const result = calculateHcmuteEffectivePriority({ academicPlusBonus30: 20, standardPriority30: 0.25 });
    expect(result.reduced).toBe(false);
    expect(result.effectivePriority30).toBe(0.25);
  });
});
