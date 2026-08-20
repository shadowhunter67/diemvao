import { describe, expect, it } from 'vitest';
import { calculateIuhThptTotal, calculateIuhTranscriptTotal, calculateIuhXt1, calculateIuhXt2, calculateIuhCombinedFinalScore } from './calculator';

describe('IUH calculator', () => {
  it('calculateIuhThptTotal sums 3 raw subject scores, no coefficient', () => {
    expect(calculateIuhThptTotal({ subject1Score: 9, subject2Score: 8, subject3Score: 7 })).toBe(24);
  });

  it('calculateIuhTranscriptTotal sums 3 raw grade-12 subject scores', () => {
    expect(calculateIuhTranscriptTotal({ subject1Score: 6, subject2Score: 6, subject3Score: 6 })).toBe(18);
  });

  it('calculateIuhXt1 = 0.7*thpt + 0.3*transcript + priority + bonus', () => {
    expect(calculateIuhXt1({ thptTotal30: 24, transcriptTotal30: 18, priority30: 0, bonus30: 0 })).toBe(22.2);
  });

  it('calculateIuhXt2 = thpt + priority + bonus', () => {
    expect(calculateIuhXt2({ thptTotal30: 24, priority30: 0.75, bonus30: 1.5 })).toBe(26.25);
  });

  it('calculateIuhCombinedFinalScore picks the max of XT1/XT2', () => {
    expect(calculateIuhCombinedFinalScore({ xt1: 22.2, xt2: 24 })).toBe(24);
    expect(calculateIuhCombinedFinalScore({ xt1: 24, xt2: 22.2 })).toBe(24);
  });

  it('calculateIuhCombinedFinalScore clamps at 30 (thang điểm 30)', () => {
    expect(calculateIuhCombinedFinalScore({ xt1: 31.5, xt2: 30.2 })).toBe(30);
  });
});
