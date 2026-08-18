import { describe, expect, it } from 'vitest';
import { calculateHutechThptRawScore, calculateHutechThptFinalScore, calculateHutechDgnlFinalScore } from './calculator';

describe('calculateHutechThptRawScore', () => {
  it('sums 3 subjects with no coefficient', () => {
    expect(calculateHutechThptRawScore({ subject1Score: 8, subject2Score: 7, subject3Score: 6 })).toBe(21);
  });

  it('rounds to 2 decimals', () => {
    expect(calculateHutechThptRawScore({ subject1Score: 6.15, subject2Score: 6.15, subject3Score: 6.15 })).toBe(18.45);
  });
});

describe('calculateHutechThptFinalScore', () => {
  it('adds priority and clamps at 30', () => {
    expect(calculateHutechThptFinalScore({ raw30: 21, priority30: 0.25 })).toBe(21.25);
    expect(calculateHutechThptFinalScore({ raw30: 29.9, priority30: 2 })).toBe(30);
  });
});

describe('calculateHutechDgnlFinalScore', () => {
  it('adds priority to raw ĐGNL score', () => {
    expect(calculateHutechDgnlFinalScore({ dgnlScore1200: 700, priority1200: 10 })).toBe(710);
  });
});
