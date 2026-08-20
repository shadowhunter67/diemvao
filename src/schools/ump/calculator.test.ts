import { describe, expect, it } from 'vitest';
import { calculateUmpRawScore, calculateUmpFinalScore } from './calculator';

describe('calculateUmpRawScore', () => {
  it('cộng thô 3 môn, không nhân hệ số', () => {
    expect(calculateUmpRawScore({ subject1Score: 8, subject2Score: 9, subject3Score: 7.5 })).toBe(24.5);
  });
});

describe('calculateUmpFinalScore', () => {
  it('cộng raw + ưu tiên + khuyến khích', () => {
    expect(calculateUmpFinalScore({ raw30: 24, priority30: 1, bonus30: 0.5 })).toBe(25.5);
  });

  it('kẹp trần 30 dù tổng vượt quá', () => {
    expect(calculateUmpFinalScore({ raw30: 29, priority30: 2, bonus30: 1.5 })).toBe(30);
  });

  it('bonus30 mặc định 0 khi bỏ trống', () => {
    expect(calculateUmpFinalScore({ raw30: 20, priority30: 0.75 })).toBe(20.75);
  });
});
