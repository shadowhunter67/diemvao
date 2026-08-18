import { describe, expect, it } from 'vitest';
import { calculateHcmuteBonus } from './bonus';

/** Conformance — Phụ lục 4: "Giải Nhì học sinh giỏi cấp Tỉnh môn Toán" → ĐXTCN = 1,00. */
describe('calculateHcmuteBonus — official Bảng 2 mục 2/3', () => {
  it('matches the official worked example for a provincial second-place award', () => {
    expect(calculateHcmuteBonus({ provincialRank: 'nhi' })).toBe(1.0);
  });

  it('caps combined bonus at 3.00', () => {
    expect(calculateHcmuteBonus({ provincialRank: 'nhat', nationalEncouragement: true })).toBeLessThanOrEqual(3.0);
  });

  it('returns 0 when no achievement is provided', () => {
    expect(calculateHcmuteBonus({})).toBe(0);
  });
});
