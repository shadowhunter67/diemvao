import { describe, expect, it } from 'vitest';
import { calculateUelEffectivePriority } from './priorityReduction';

describe('calculateUelEffectivePriority', () => {
  it('dưới ngưỡng 75 → giữ nguyên điểm ưu tiên chuẩn, không giảm', () => {
    const result = calculateUelEffectivePriority({ academicPlusBonus: 70, standardPriority: 0.75 });
    expect(result).toEqual({ effectivePriority: 0.75, reduced: false });
  });

  it('đúng ngưỡng 75 → bắt đầu áp công thức giảm (không phải giữ nguyên)', () => {
    const result = calculateUelEffectivePriority({ academicPlusBonus: 75, standardPriority: 1 });
    // (100-75)/25 * 1 = 1.0 — đúng ngưỡng vẫn ra full priority (biên hợp lý)
    expect(result.reduced).toBe(true);
    expect(result.effectivePriority).toBe(1);
  });

  it('trên ngưỡng → giảm đúng công thức chính thức UEL', () => {
    // (100-90)/25 * 2 = 0.8
    const result = calculateUelEffectivePriority({ academicPlusBonus: 90, standardPriority: 2 });
    expect(result.effectivePriority).toBe(0.8);
    expect(result.reduced).toBe(true);
  });

  it('tổng điểm = 100 → điểm ưu tiên giảm về 0', () => {
    const result = calculateUelEffectivePriority({ academicPlusBonus: 100, standardPriority: 2.75 });
    expect(result.effectivePriority).toBe(0);
  });

  it('làm tròn 2 chữ số thập phân', () => {
    // (100-83)/25 * 0.75 = 0.51
    const result = calculateUelEffectivePriority({ academicPlusBonus: 83, standardPriority: 0.75 });
    expect(result.effectivePriority).toBe(0.51);
  });
});
