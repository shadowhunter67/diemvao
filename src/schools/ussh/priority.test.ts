import { describe, expect, it } from 'vitest';
import { lookupUsshStandardPriority, USSH_PRIORITY_CATEGORY_POINTS_100, USSH_PRIORITY_REGION_POINTS_100 } from './priority';

describe('lookupUsshStandardPriority', () => {
  it('keeps national region priority values converted from scale 30 to scale 100', () => {
    expect(USSH_PRIORITY_REGION_POINTS_100.KV1).toBe(2.5);
    expect(USSH_PRIORITY_REGION_POINTS_100['KV2-NT']).toBeCloseTo(5 / 3, 8);
    expect(USSH_PRIORITY_REGION_POINTS_100.KV2).toBeCloseTo(5 / 6, 8);
    expect(USSH_PRIORITY_REGION_POINTS_100.KV3).toBe(0);
  });

  it('keeps national category priority values converted from scale 30 to scale 100', () => {
    expect(USSH_PRIORITY_CATEGORY_POINTS_100.UT1).toBeCloseTo(20 / 3, 8);
    expect(USSH_PRIORITY_CATEGORY_POINTS_100.UT2).toBeCloseTo(10 / 3, 8);
  });

  it('rounds combined standard priority to two decimals on scale 100', () => {
    expect(lookupUsshStandardPriority('KV1', 'UT1')).toBe(9.17);
    expect(lookupUsshStandardPriority('KV2-NT', 'UT2')).toBe(5);
    expect(lookupUsshStandardPriority('KV3', undefined)).toBe(0);
    expect(lookupUsshStandardPriority(undefined, undefined)).toBe(0);
  });
});
