import { describe, expect, it } from 'vitest';
import { convertDgnlToThpt } from './dgnlConversion';

describe('convertDgnlToThpt', () => {
  it('mốc dưới cùng 450 -> 15.0', () => {
    expect(convertDgnlToThpt(450)).toBe(15.0);
  });

  it('mốc trên cùng 1200 -> 30.0', () => {
    expect(convertDgnlToThpt(1200)).toBeCloseTo(30.0, 5);
  });

  it('nội suy đúng giữa khoảng 600-650 (18.10-18.85)', () => {
    // giữa khoảng: 625 -> giữa 18.10 và 18.85 = 18.475
    expect(convertDgnlToThpt(625)).toBeCloseTo(18.475, 3);
  });

  it('null nếu ngoài khoảng bảng công bố', () => {
    expect(convertDgnlToThpt(449)).toBeNull();
    expect(convertDgnlToThpt(1201)).toBeNull();
  });

  it('biên khoảng 980 rơi đúng khoảng chứa nó (945-980), không phải khoảng kế tiếp', () => {
    // (x > 945 && x <= 980) => khoảng thứ 11 (25.3-27.08), giá trị tại 980 = 27.08
    expect(convertDgnlToThpt(980)).toBeCloseTo(27.08, 3);
  });
});
