import { describe, expect, it } from 'vitest';
import { calculateUfmPriority30, lookupUfmStandardPriority30 } from './priority';

describe('lookupUfmStandardPriority30', () => {
  it('sums region + category on thang 30', () => {
    expect(lookupUfmStandardPriority30('KV1', 'UT1')).toBe(2.75);
    expect(lookupUfmStandardPriority30('KV3', undefined)).toBe(0);
  });
});

describe('calculateUfmPriority30 — threshold 22.5/30, divisor 7.5', () => {
  it('no reduction below 22.5', () => {
    expect(calculateUfmPriority30({ academicScore30: 20, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.75, reduced: false });
  });

  it('reduces at/above 22.5: [(30-27)/7.5] * 0.75 = 0.3', () => {
    expect(calculateUfmPriority30({ academicScore30: 27, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.3, reduced: true });
  });
});
