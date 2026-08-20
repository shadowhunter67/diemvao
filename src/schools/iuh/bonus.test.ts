import { describe, expect, it } from 'vitest';
import { calculateIuhReward30, calculateIuhTotalBonus30, resolveIuhEnglishEncouragement30 } from './bonus';

describe('IUH bonus', () => {
  it('calculateIuhReward30 returns 0 for no achievement', () => {
    expect(calculateIuhReward30({})).toEqual({ raw: 0, total30: 0 });
  });

  it('calculateIuhReward30 sums applicable rows', () => {
    expect(calculateIuhReward30({ threeYearExcellent: true, otherOutstandingAchievement: true })).toEqual({ raw: 2, total30: 1.5 });
  });

  it('calculateIuhReward30 caps at 1.5 (Phụ lục 1: "tổng điểm không quá 1,5 điểm")', () => {
    expect(calculateIuhReward30({ academicAward: 'second-or-above', scienceContestAward: 'second-or-above' })).toEqual({ raw: 3, total30: 1.5 });
  });

  it('calculateIuhTotalBonus30 sums reward + encouragement without an extra combined cap', () => {
    expect(calculateIuhTotalBonus30({ reward30: 1.5, encouragement30: 1.5 })).toBe(3);
  });

  it('resolveIuhEnglishEncouragement30 follows Phụ lục 2 mục 1 bands', () => {
    expect(resolveIuhEnglishEncouragement30(4.5)).toBe(0.5);
    expect(resolveIuhEnglishEncouragement30(5.0)).toBe(0.75);
    expect(resolveIuhEnglishEncouragement30(5.5)).toBe(1.0);
    expect(resolveIuhEnglishEncouragement30(6.0)).toBe(1.25);
    expect(resolveIuhEnglishEncouragement30(6.5)).toBe(1.5);
    expect(resolveIuhEnglishEncouragement30(9.0)).toBe(1.5);
  });

  it('resolveIuhEnglishEncouragement30 returns 0 below the lowest band', () => {
    expect(resolveIuhEnglishEncouragement30(4.0)).toBe(0);
  });
});
