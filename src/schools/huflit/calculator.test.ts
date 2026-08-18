import { describe, expect, it } from 'vitest';
import { calculateHuflitPt1RawScore, calculateHuflitPt2RawScore, calculateHuflitFinalScore30, calculateHuflitPt3FinalScore } from './calculator';

describe('calculateHuflitPt1RawScore — tổng thô 3 môn (không nhân hệ số)', () => {
  it('sums 3 subject scores directly', () => {
    expect(calculateHuflitPt1RawScore({ subject1Score: 8, subject2Score: 7, subject3Score: 6 })).toBe(21);
  });
});

describe('calculateHuflitPt2RawScore — tổng thô TB 3 môn 3 năm', () => {
  it('sums 3 transcript-average scores directly', () => {
    expect(calculateHuflitPt2RawScore({ subject1Score: 8.5, subject2Score: 7.5, subject3Score: 6.5 })).toBe(22.5);
  });
});

describe('calculateHuflitFinalScore30', () => {
  it('sums raw + bonus + priority and clamps at 30', () => {
    expect(calculateHuflitFinalScore30({ raw30: 21, bonus30: 0, priority30: 0.75 })).toBe(21.75);
    expect(calculateHuflitFinalScore30({ raw30: 29, bonus30: 3, priority30: 2 })).toBe(30);
  });
});

describe('calculateHuflitPt3FinalScore', () => {
  it('sums ĐGNL + priority', () => {
    expect(calculateHuflitPt3FinalScore({ dgnlScore1200: 900, priority1200: 15 })).toBe(915);
  });
});
