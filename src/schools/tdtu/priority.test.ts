import { describe, expect, it } from 'vitest';
import { calculateTdtuPt1EffectivePriority, calculateTdtuPt2EffectivePriority, lookupTdtuStandardPriority30 } from './priority';

describe('lookupTdtuStandardPriority30', () => {
  it('sums region + category points on thang 30', () => {
    expect(lookupTdtuStandardPriority30('KV1', 'UT1')).toBe(2.75);
    expect(lookupTdtuStandardPriority30('KV3', undefined)).toBe(0);
  });
});

describe('calculateTdtuPt1EffectivePriority — thang 100, threshold 75, divisor 25', () => {
  it('no reduction below 75', () => {
    // KV1 = 0.75 * 10/3 = 2.5
    const result = calculateTdtuPt1EffectivePriority({ competencyPlusBonus100: 70, standardPriority30: 0.75 });
    expect(result).toEqual({ effectivePriority100: 2.5, reduced: false });
  });

  it('reduces at/above 75: [(100-90)/25] * 2.5 = 1.0', () => {
    const result = calculateTdtuPt1EffectivePriority({ competencyPlusBonus100: 90, standardPriority30: 0.75 });
    expect(result).toEqual({ effectivePriority100: 1, reduced: true });
  });

  it('zero priority stays zero regardless of score', () => {
    expect(calculateTdtuPt1EffectivePriority({ competencyPlusBonus100: 95, standardPriority30: 0 })).toEqual({ effectivePriority100: 0, reduced: false });
  });
});

describe('calculateTdtuPt2EffectivePriority — thang 1200, threshold 900, divisor 300', () => {
  it('no reduction below 900', () => {
    // KV1 = 0.75 * 40 = 30
    const result = calculateTdtuPt2EffectivePriority({ dgnlScore1200: 800, standardPriority30: 0.75 });
    expect(result).toEqual({ effectivePriority1200: 30, reduced: false });
  });

  it('reduces at/above 900: [(1200-1050)/300] * 30 = 15', () => {
    const result = calculateTdtuPt2EffectivePriority({ dgnlScore1200: 1050, standardPriority30: 0.75 });
    expect(result).toEqual({ effectivePriority1200: 15, reduced: true });
  });
});
