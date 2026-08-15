import { describe, expect, it } from 'vitest';
import { calculateUsshBonus, USSH_BONUS_GROUP_CAPS_100, USSH_BONUS_MAX_TOTAL_100 } from './bonus';

describe('calculateUsshBonus', () => {
  it('keeps the official USSH 2026 bonus caps on scale 100', () => {
    expect(USSH_BONUS_GROUP_CAPS_100).toEqual({ group1: 3, group2: 4, group3: 3 });
    expect(USSH_BONUS_MAX_TOTAL_100).toBe(10);
  });

  it('treats no declared bonus achievement as exact DC=0', () => {
    expect(calculateUsshBonus(undefined)).toEqual({ supported: true, awardedPoints100: 0 });
    expect(calculateUsshBonus(false)).toEqual({ supported: true, awardedPoints100: 0 });
  });

  it('does not guess a concrete bonus when any achievement is declared', () => {
    expect(calculateUsshBonus(true)).toEqual({ supported: false, awardedPoints100: 0 });
  });
});
