import { describe, expect, it } from 'vitest';
import { calculateHcmulawPriority30, lookupHcmulawStandardPriority30 } from './priority';

describe('lookupHcmulawStandardPriority30', () => {
  it('sums region + category on thang 30', () => {
    expect(lookupHcmulawStandardPriority30('KV1', 'UT1')).toBe(2.75);
    expect(lookupHcmulawStandardPriority30('KV3', undefined)).toBe(0);
    expect(lookupHcmulawStandardPriority30(undefined, undefined)).toBe(0);
  });
});

describe('calculateHcmulawPriority30 — threshold 22.5/30, divisor 7.5', () => {
  it('returns 0 when there is no standard priority', () => {
    expect(calculateHcmulawPriority30({ academicScore30: 28, standardPriority30: 0 })).toEqual({ effectivePriority30: 0, reduced: false });
  });

  it('no reduction below 22.5', () => {
    expect(calculateHcmulawPriority30({ academicScore30: 20, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.75, reduced: false });
  });

  it('reduces at/above 22.5: [(30-27)/7.5] * 0.75 = 0.3', () => {
    expect(calculateHcmulawPriority30({ academicScore30: 27, standardPriority30: 0.75 })).toEqual({ effectivePriority30: 0.3, reduced: true });
  });

  it('never returns a negative priority when academic score exceeds 30', () => {
    expect(calculateHcmulawPriority30({ academicScore30: 40, standardPriority30: 0.75 }).effectivePriority30).toBeGreaterThanOrEqual(0);
  });
});
