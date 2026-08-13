import { describe, expect, it } from 'vitest';
import { convertDgnlToThpt, UEH_DGNL_TO_THPT_TABLE } from './dgnlConversion';
import { uehDgnlConversionFixtures } from './dgnlConversion.fixtures';

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

  it('continuity: thptMax của mỗi khoảng khớp đúng thptMin của khoảng kế tiếp', () => {
    for (let i = 0; i < UEH_DGNL_TO_THPT_TABLE.length - 1; i += 1) {
      expect(UEH_DGNL_TO_THPT_TABLE[i].thptMax).toBe(UEH_DGNL_TO_THPT_TABLE[i + 1].thptMin);
      expect(UEH_DGNL_TO_THPT_TABLE[i].dgnlMax).toBe(UEH_DGNL_TO_THPT_TABLE[i + 1].dgnlMin);
    }
  });

  it('monotonic increasing xuyên suốt toàn bộ khoảng 450-1200 (bước 1 điểm)', () => {
    let previous = convertDgnlToThpt(450) ?? -Infinity;
    for (let score = 451; score <= 1200; score += 1) {
      const current = convertDgnlToThpt(score);
      expect(current).not.toBeNull();
      expect(current as number).toBeGreaterThanOrEqual(previous);
      previous = current as number;
    }
  });

  it('output không bao giờ vượt ngoài [0, 30] trong toàn bộ khoảng công bố', () => {
    for (let score = 450; score <= 1200; score += 5) {
      const result = convertDgnlToThpt(score);
      expect(result).not.toBeNull();
      expect(result as number).toBeGreaterThanOrEqual(0);
      expect(result as number).toBeLessThanOrEqual(30);
    }
  });

  describe('official example fixtures (docs/admission-research-2026.md)', () => {
    it.each(uehDgnlConversionFixtures)('$description', (fixture) => {
      expect(convertDgnlToThpt(fixture.input)).toBeCloseTo(fixture.expected, 2);
    });
  });
});
