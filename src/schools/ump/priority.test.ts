import { describe, expect, it } from 'vitest';
import { calculateUmpPriority30, lookupUmpStandardPriority30 } from './priority';

describe('lookupUmpStandardPriority30', () => {
  it('KV1 + UT1 cộng dồn 2,75', () => {
    expect(lookupUmpStandardPriority30('KV1', 'UT1')).toBe(2.75);
  });

  it('KV3 + không đối tượng = 0', () => {
    expect(lookupUmpStandardPriority30('KV3', undefined)).toBe(0);
  });

  it('mã không nhận diện coi như 0', () => {
    expect(lookupUmpStandardPriority30('KV9', 'UT9')).toBe(0);
  });
});

describe('calculateUmpPriority30', () => {
  it('dưới ngưỡng 22,5 giữ nguyên mức ưu tiên gốc', () => {
    const result = calculateUmpPriority30({ academicScore30: 20, standardPriority30: 2 });
    expect(result).toEqual({ effectivePriority30: 2, reduced: false });
  });

  it('từ 22,5 trở lên áp dụng công thức giảm [(30-tổng)/7,5] × mức ưu tiên', () => {
    const result = calculateUmpPriority30({ academicScore30: 27, standardPriority30: 2 });
    expect(result.reduced).toBe(true);
    expect(result.effectivePriority30).toBeCloseTo(0.8, 2);
  });

  it('không có mức ưu tiên chuẩn (0) thì luôn trả 0, không giảm', () => {
    const result = calculateUmpPriority30({ academicScore30: 29, standardPriority30: 0 });
    expect(result).toEqual({ effectivePriority30: 0, reduced: false });
  });
});
