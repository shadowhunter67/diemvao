import { describe, expect, it } from 'vitest';
import { computeIuXetThuongBonus } from './bonus';

describe('computeIuXetThuongBonus', () => {
  it('sums priority school + achievements, capped at 5', () => {
    expect(computeIuXetThuongBonus(false, 0)).toBe(0);
    expect(computeIuXetThuongBonus(true, 0)).toBe(3);
    expect(computeIuXetThuongBonus(false, 1)).toBe(2);
    expect(computeIuXetThuongBonus(true, 2)).toBe(5); // 3 + 4 = 7 -> capped 5
  });
});
