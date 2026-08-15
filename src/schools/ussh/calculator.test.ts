import { describe, expect, it } from 'vitest';
import { calculateUsshBestDhl, calculateUsshDhl1Score, calculateUsshDhl2Score, calculateUsshDhl3Score, calculateUsshDt3Score } from './calculator';

describe('calculateUsshDhl1Score', () => {
  it('0.45×THPT + 0.45×ĐGNL + 0.10×HB, quy đổi thang 100', () => {
    // THPT=24/30 -> 80; ĐGNL=900/1200 -> 75; HB=24/30 -> 80
    const result = calculateUsshDhl1Score({ thptRawTotal30: 24, dgnlRaw1200: 900, transcriptTotal30: 24 });
    expect(result.thptComponent).toBeCloseTo(0.45 * 80, 5);
    expect(result.dgnlComponent).toBeCloseTo(0.45 * 75, 5);
    expect(result.transcriptComponent).toBeCloseTo(0.1 * 80, 5);
    expect(result.scoreBeforeBonusAndPriority).toBeCloseTo(36 + 33.75 + 8, 5);
  });

  it('max: THPT=30, ĐGNL=1200, HB=30 → 100', () => {
    const result = calculateUsshDhl1Score({ thptRawTotal30: 30, dgnlRaw1200: 1200, transcriptTotal30: 30 });
    expect(result.scoreBeforeBonusAndPriority).toBe(100);
  });

  it('min: tất cả 0 → 0', () => {
    const result = calculateUsshDhl1Score({ thptRawTotal30: 0, dgnlRaw1200: 0, transcriptTotal30: 0 });
    expect(result.scoreBeforeBonusAndPriority).toBe(0);
  });
});

describe('USSH individual score formula guardrails', () => {
  it('does not use alpha coefficients inside individual DHL scoring functions', () => {
    const source = [calculateUsshDhl1Score, calculateUsshDhl2Score, calculateUsshDhl3Score, calculateUsshBestDhl].map(String).join('\n');
    expect(source).not.toMatch(/alpha|Î±|a1|a2/i);
  });
});

describe('calculateUsshDhl2Score', () => {
  it('0.90×THPT + 0.10×HB, KHÔNG dùng ĐGNL', () => {
    const result = calculateUsshDhl2Score({ thptRawTotal30: 24, transcriptTotal30: 24 });
    expect(result.dgnlComponent).toBeUndefined();
    expect(result.thptComponent).toBeCloseTo(0.9 * 80, 5);
    expect(result.transcriptComponent).toBeCloseTo(0.1 * 80, 5);
    expect(result.scoreBeforeBonusAndPriority).toBeCloseTo(80, 5);
  });

  it('max: THPT=30, HB=30 → 100', () => {
    const result = calculateUsshDhl2Score({ thptRawTotal30: 30, transcriptTotal30: 30 });
    expect(result.scoreBeforeBonusAndPriority).toBe(100);
  });
});

describe('calculateUsshDhl3Score (= calculateUsshDt3Score)', () => {
  it('0.9×(ĐGNL×100/1200) + 0.1×(học bạ×100/30) — không chứa α', () => {
    const result = calculateUsshDhl3Score({ dgnlRaw1200: 900, transcriptTotal30: 24 });
    expect(result.dgnlComponent).toBeCloseTo(67.5, 5);
    expect(result.transcriptComponent).toBeCloseTo(8, 5);
    expect(result.scoreBeforeBonusAndPriority).toBeCloseTo(75.5, 5);
  });

  it('min: ĐGNL=0, học bạ=0 → 0', () => {
    const result = calculateUsshDhl3Score({ dgnlRaw1200: 0, transcriptTotal30: 0 });
    expect(result.scoreBeforeBonusAndPriority).toBe(0);
  });

  it('max: ĐGNL=1200, học bạ=30 → 100', () => {
    const result = calculateUsshDhl3Score({ dgnlRaw1200: 1200, transcriptTotal30: 30 });
    expect(result.scoreBeforeBonusAndPriority).toBe(100);
  });

  it('alias cũ calculateUsshDt3Score vẫn hoạt động (tương thích ngược)', () => {
    const result = calculateUsshDt3Score({ dgnlRaw1200: 900, transcriptTotal30: 24 });
    expect(result.scoreBeforeBonusAndPriority).toBeCloseTo(75.5, 5);
  });
});

describe('calculateUsshBestDhl', () => {
  it('đủ 3 thành phần -> chọn ĐT1', () => {
    const result = calculateUsshBestDhl({ thptRawTotal30: 24, dgnlRaw1200: 900, transcriptTotal30: 24 });
    expect(result?.applicantType).toBe('DT1');
  });

  it('chỉ THPT + HB -> chọn ĐT2', () => {
    const result = calculateUsshBestDhl({ thptRawTotal30: 24, transcriptTotal30: 24 });
    expect(result?.applicantType).toBe('DT2');
  });

  it('chỉ ĐGNL + HB -> chọn ĐT3', () => {
    const result = calculateUsshBestDhl({ dgnlRaw1200: 900, transcriptTotal30: 24 });
    expect(result?.applicantType).toBe('DT3');
  });

  it('thiếu Học bạ -> null (Học bạ bắt buộc ở cả 3 đối tượng)', () => {
    expect(calculateUsshBestDhl({ thptRawTotal30: 24, dgnlRaw1200: 900 })).toBeNull();
    expect(calculateUsshBestDhl({})).toBeNull();
  });
});
