import { describe, expect, it } from 'vitest';
import { calculateUelBonusEligibility } from './bonus';

describe('calculateUelBonusEligibility', () => {
  it('không chọn -> rỗng', () => {
    const result = calculateUelBonusEligibility([]);
    expect(result.eligibleCategories).toEqual([]);
    expect(result.exactPointsKnown).toBe(false);
  });

  it('chọn priority-school -> cap 5, overallCap 10, không phải awarded score', () => {
    const result = calculateUelBonusEligibility(['priority-school']);
    expect(result.categoryCaps).toEqual({ 'priority-school': 5 });
    expect(result.overallCap).toBe(10);
    expect(result.exactPointsKnown).toBe(false);
  });
});
