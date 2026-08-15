import { describe, expect, it } from 'vitest';
import { calculateHcmusBonus } from './bonus';
import { HCMUS_BONUS_CATEGORIES_2026 } from './data/bonus';

describe('HCMUS_BONUS_CATEGORIES_2026', () => {
  it('contains all 15 official rows from the bonus table image', () => {
    expect(HCMUS_BONUS_CATEGORIES_2026).toHaveLength(15);
  });

  it('caps every base point at the official max of 1.5 (thang 30)', () => {
    for (const category of HCMUS_BONUS_CATEGORIES_2026) {
      expect(category.basePoints30).toBeGreaterThan(0);
      expect(category.basePoints30).toBeLessThanOrEqual(1.5);
    }
  });
});

describe('calculateHcmusBonus', () => {
  it('null category (no achievement) -> 0 points, not reduced', () => {
    expect(calculateHcmusBonus(null, 20)).toEqual({ categoryId: null, basePoints30: 0, awardedPoints30: 0, reduced: false });
  });

  it('below 28.5 threshold: awarded equals base points exactly', () => {
    const result = calculateHcmusBonus('national-international-olympiad-first-second-third', 28.49);
    expect(result.basePoints30).toBe(1.5);
    expect(result.awardedPoints30).toBe(1.5);
    expect(result.reduced).toBe(false);
  });

  it('boundary: exactly 28.5 -> reduction formula applies (not the "below" branch)', () => {
    const result = calculateHcmusBonus('national-international-olympiad-first-second-third', 28.5);
    // Điểm cộng = [(30 - 28.5) / 1.5] * 1.5 = 1.5 (đúng biên, giá trị trùng base nhưng qua nhánh giảm)
    expect(result.reduced).toBe(true);
    expect(result.awardedPoints30).toBeCloseTo(1.5, 10);
  });

  it('above threshold: applies the official reduction formula', () => {
    // tổng 29.25 -> [(30-29.25)/1.5] * 1.5 = 0.75
    const result = calculateHcmusBonus('national-international-olympiad-first-second-third', 29.25);
    expect(result.reduced).toBe(true);
    expect(result.awardedPoints30).toBeCloseTo(0.75, 10);
  });

  it('at the max score 30, reduction formula yields 0 regardless of base points', () => {
    const result = calculateHcmusBonus('icpc-champion-first-second', 30);
    expect(result.awardedPoints30).toBeCloseTo(0, 10);
  });

  it('unknown category id -> treated as no bonus (defensive, does not throw)', () => {
    // @ts-expect-error intentional invalid id to test defensive branch
    const result = calculateHcmusBonus('not-a-real-category', 20);
    expect(result.awardedPoints30).toBe(0);
  });

  it('does not mutate the shared category table', () => {
    const before = JSON.stringify(HCMUS_BONUS_CATEGORIES_2026);
    calculateHcmusBonus('olympic-30-4-bronze', 29);
    expect(JSON.stringify(HCMUS_BONUS_CATEGORIES_2026)).toBe(before);
  });
});
