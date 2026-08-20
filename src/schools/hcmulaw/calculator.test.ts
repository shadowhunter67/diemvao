import { describe, expect, it } from 'vitest';
import { calculateHcmulawSubjectGroupScore, calculateHcmulawThpt5FinalScore } from './calculator';

describe('calculateHcmulawSubjectGroupScore', () => {
  it('sums 3 raw subject scores, no coefficient', () => {
    expect(calculateHcmulawSubjectGroupScore({ subject1Score: 8, subject2Score: 7.5, subject3Score: 6 })).toBe(21.5);
  });

  it('rounds to 2 decimal places', () => {
    expect(calculateHcmulawSubjectGroupScore({ subject1Score: 8.111, subject2Score: 7.222, subject3Score: 6.333 })).toBe(21.67);
  });
});

describe('calculateHcmulawThpt5FinalScore', () => {
  it('adds priority to the subject-group score', () => {
    expect(calculateHcmulawThpt5FinalScore({ subjectGroupScore30: 21, priority30: 0.75 })).toBe(21.75);
  });

  it('clamps the final score at 30', () => {
    expect(calculateHcmulawThpt5FinalScore({ subjectGroupScore30: 29.5, priority30: 2 })).toBe(30);
  });
});
