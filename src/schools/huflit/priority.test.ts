import { describe, expect, it } from 'vitest';
import { calculateHuflitPriority30, calculateHuflitPriority1200, lookupHuflitStandardPriority30 } from './priority';

describe('lookupHuflitStandardPriority30', () => {
  it('sums region + category on thang 30', () => {
    expect(lookupHuflitStandardPriority30('KV1', 'UT1')).toBe(2.75);
    expect(lookupHuflitStandardPriority30('KV3', undefined)).toBe(0);
  });
});

describe('calculateHuflitPriority30 — threshold 22.5/30, divisor 7.5', () => {
  it('no reduction below 22.5', () => {
    expect(calculateHuflitPriority30({ academicPlusBonus30: 20, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.75, reduced: false });
  });

  it('reduces at/above 22.5: [(30-27)/7.5] * 0.75 = 0.3', () => {
    expect(calculateHuflitPriority30({ academicPlusBonus30: 27, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.3, reduced: true });
  });
});

describe('calculateHuflitPriority1200 — threshold 900/1200, divisor 300', () => {
  it('no reduction below 900', () => {
    // KV1 = 0.75 * 40 = 30
    expect(calculateHuflitPriority1200({ dgnlScore1200: 800, standardPriority30: 0.75 })).toEqual({ effectivePriority1200: 30, reduced: false });
  });

  it('reduces at/above 900: [(1200-1050)/300] * 30 = 15', () => {
    expect(calculateHuflitPriority1200({ dgnlScore1200: 1050, standardPriority30: 0.75 })).toEqual({ effectivePriority1200: 15, reduced: true });
  });
});
