import { describe, expect, it } from 'vitest';
import { checkHuflitPt1Threshold, checkHuflitPt2Threshold, checkHuflitPt3Threshold } from './eligibility';

describe('checkHuflitPt1Threshold — Thông báo 09/7/2026', () => {
  it('general threshold is 15/30', () => {
    expect(checkHuflitPt1Threshold(15, false).pass).toBe(true);
    expect(checkHuflitPt1Threshold(14.99, false).pass).toBe(false);
  });

  it('Luật/Luật kinh tế threshold is 20/30', () => {
    expect(checkHuflitPt1Threshold(19.99, true).pass).toBe(false);
    expect(checkHuflitPt1Threshold(20, true).pass).toBe(true);
  });
});

describe('checkHuflitPt2Threshold — cần cả điều kiện THPT ≥15 VÀ TB 3 năm', () => {
  it('passes when both conditions hold (general 18/30)', () => {
    expect(checkHuflitPt2Threshold({ thptTotal30: 15, transcriptTotal30: 18, isLawProgram: false }).pass).toBe(true);
  });

  it('fails when THPT prerequisite is not met even if transcript average is high', () => {
    expect(checkHuflitPt2Threshold({ thptTotal30: 14, transcriptTotal30: 25, isLawProgram: false }).pass).toBe(false);
  });

  it('fails when transcript average is below threshold even if THPT prerequisite is met', () => {
    expect(checkHuflitPt2Threshold({ thptTotal30: 20, transcriptTotal30: 17.9, isLawProgram: false }).pass).toBe(false);
  });

  it('Luật/Luật kinh tế uses 21/30 for the transcript average', () => {
    expect(checkHuflitPt2Threshold({ thptTotal30: 15, transcriptTotal30: 20.9, isLawProgram: true }).pass).toBe(false);
    expect(checkHuflitPt2Threshold({ thptTotal30: 15, transcriptTotal30: 21, isLawProgram: true }).pass).toBe(true);
  });
});

describe('checkHuflitPt3Threshold — ĐGNL', () => {
  it('general threshold is 550/1200', () => {
    expect(checkHuflitPt3Threshold(550, false).pass).toBe(true);
    expect(checkHuflitPt3Threshold(549, false).pass).toBe(false);
  });

  it('Luật/Luật kinh tế threshold is 720/1200', () => {
    expect(checkHuflitPt3Threshold(719, true).pass).toBe(false);
    expect(checkHuflitPt3Threshold(720, true).pass).toBe(true);
  });
});
