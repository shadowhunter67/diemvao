import { describe, expect, it } from 'vitest';
import { calculateUsshEffectivePriority } from './priorityReduction';

describe('calculateUsshEffectivePriority', () => {
  it('không giảm khi tổng điểm (đã gồm điểm cộng) < 75', () => {
    const result = calculateUsshEffectivePriority({ totalIncludingBonus: 74.99, standardPriority: 2 });
    expect(result.reduced).toBe(false);
    expect(result.effectivePriority).toBe(2);
  });

  it('không giảm đúng biên 75 (đề bài dùng "từ 75 điểm" — inclusive)', () => {
    // Tại chính mốc 75, công thức (100-75)/25 × priority = 1 × priority = priority (không đổi số
    // trị dù coi là "đã áp dụng công thức") — verify qua invariant reduced=true tại >=75.
    const result = calculateUsshEffectivePriority({ totalIncludingBonus: 75, standardPriority: 2 });
    expect(result.reduced).toBe(true);
    expect(result.effectivePriority).toBe(2);
  });

  it('giảm theo công thức [(100-tổng)/25] × ưu tiên khi tổng ≥75', () => {
    // (100-80)/25 × 2 = 20/25×2 = 0.8×2 = 1.6
    const result = calculateUsshEffectivePriority({ totalIncludingBonus: 80, standardPriority: 2 });
    expect(result.reduced).toBe(true);
    expect(result.effectivePriority).toBeCloseTo(1.6, 5);
  });

  it('về 0 khi tổng điểm chạm 100', () => {
    const result = calculateUsshEffectivePriority({ totalIncludingBonus: 100, standardPriority: 2 });
    expect(result.effectivePriority).toBe(0);
  });
});
