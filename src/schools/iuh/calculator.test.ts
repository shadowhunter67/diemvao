import { describe, expect, it } from 'vitest';
import {
  calculateIuhThptTotal,
  calculateIuhTranscriptTotal,
  calculateIuhDgnlConverted,
  calculateIuhAcademicScore,
  calculateIuhXt1,
  calculateIuhXt2,
  calculateIuhXt3,
  calculateIuhCombinedFinalScore,
} from './calculator';

describe('IUH calculator', () => {
  it('calculateIuhThptTotal sums 3 raw subject scores, no coefficient', () => {
    expect(calculateIuhThptTotal({ subject1Score: 9, subject2Score: 8, subject3Score: 7 })).toBe(24);
  });

  it('calculateIuhTranscriptTotal sums 3 raw grade-12 subject scores', () => {
    expect(calculateIuhTranscriptTotal({ subject1Score: 6, subject2Score: 6, subject3Score: 6 })).toBe(18);
  });

  it('calculateIuhXt1 = 0.7*academicScore + 0.3*transcript + priority + bonus', () => {
    expect(calculateIuhXt1({ academicScore30: 24, transcriptTotal30: 18, priority30: 0, bonus30: 0 })).toBe(22.2);
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

  it('calculateIuhDgnlConverted = round2(vact*30/1139) — ĐTK 2026 = 1139', () => {
    expect(calculateIuhDgnlConverted(1139)).toBe(30);
    expect(calculateIuhDgnlConverted(0)).toBe(0);
  });

  it('calculateIuhAcademicScore = Max(ĐTN, ĐĐGNL), falls back to ĐTN when no ĐGNL', () => {
    expect(calculateIuhAcademicScore({ thptTotal30: 24 })).toBe(24);
    expect(calculateIuhAcademicScore({ thptTotal30: 24, dgnlConverted30: 25.02 })).toBe(25.02);
    expect(calculateIuhAcademicScore({ thptTotal30: 24, dgnlConverted30: 20 })).toBe(24);
  });

  it('calculateIuhXt3 = ĐĐGNL + priority + bonus', () => {
    expect(calculateIuhXt3({ dgnlConverted30: 25.02, priority30: 0.75, bonus30: 1.5 })).toBe(27.27);
  });

  it('calculateIuhCombinedFinalScore includes XT3 in the max when present', () => {
    expect(calculateIuhCombinedFinalScore({ xt1: 22.2, xt2: 24, xt3: 27.27 })).toBe(27.27);
    expect(calculateIuhCombinedFinalScore({ xt1: 22.2, xt2: 24, xt3: undefined })).toBe(24);
  });
});
