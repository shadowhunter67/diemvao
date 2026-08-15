import { describe, expect, it } from 'vitest';
import { calculateIuEffectivePriority } from './priorityReduction';

describe('calculateIuEffectivePriority', () => {
  it('keeps full standard priority when academic+bonus is below 75', () => {
    const result = calculateIuEffectivePriority({ academicPlusBonus: 74.99, standardPriority: 2.5 });
    expect(result.effectivePriority).toBe(2.5);
    expect(result.reduced).toBe(false);
  });

  it('applies the official reduction formula at exactly 75', () => {
    // [(100-75)/25] * 2.5 = 1 * 2.5 = 2.5 (boundary: unchanged numerically but IS the reduced branch)
    const result = calculateIuEffectivePriority({ academicPlusBonus: 75, standardPriority: 2.5 });
    expect(result.effectivePriority).toBe(2.5);
    expect(result.reduced).toBe(true);
  });

  it('reduces proportionally above 75', () => {
    // [(100-90)/25] * 6.66 = 0.4 * 6.66 = 2.664 -> rounds to 2.66
    const result = calculateIuEffectivePriority({ academicPlusBonus: 90, standardPriority: 6.66 });
    expect(result.effectivePriority).toBe(2.66);
    expect(result.reduced).toBe(true);
  });

  it('never goes negative even above scale max', () => {
    const result = calculateIuEffectivePriority({ academicPlusBonus: 105, standardPriority: 2.5 });
    expect(result.effectivePriority).toBeGreaterThanOrEqual(0);
  });

  it('zero standard priority stays zero regardless of academic+bonus', () => {
    expect(calculateIuEffectivePriority({ academicPlusBonus: 95, standardPriority: 0 }).effectivePriority).toBe(0);
  });
});
