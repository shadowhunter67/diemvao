import { describe, expect, it } from 'vitest';
import { computeIuXetThuongBonus, computeIuAwardBonus, computeIuEncouragementBonus, computeIuTotalBonus } from './bonus';

describe('computeIuXetThuongBonus', () => {
  it('sums priority school + achievements, capped at 5', () => {
    expect(computeIuXetThuongBonus(false, 0)).toBe(0);
    expect(computeIuXetThuongBonus(true, 0)).toBe(3);
    expect(computeIuXetThuongBonus(false, 1)).toBe(2);
    expect(computeIuXetThuongBonus(true, 2)).toBe(5); // 3 + 4 = 7 -> capped 5
  });
});

describe('computeIuAwardBonus', () => {
  it('returns the official award tier points', () => {
    expect(computeIuAwardBonus('none')).toBe(0);
    expect(computeIuAwardBonus('national-third')).toBe(7.0);
    expect(computeIuAwardBonus('national-second')).toBe(8.0);
    expect(computeIuAwardBonus('national-first')).toBe(9.0);
    expect(computeIuAwardBonus('international')).toBe(10.0);
  });
});

describe('computeIuEncouragementBonus', () => {
  it('returns 0 when no certificate provided', () => {
    expect(computeIuEncouragementBonus({})).toBe(0);
  });

  it('maps IELTS thresholds to the correct point value', () => {
    expect(computeIuEncouragementBonus({ ielts: 5.0 })).toBe(3.0);
    expect(computeIuEncouragementBonus({ ielts: 5.5 })).toBe(3.5);
    expect(computeIuEncouragementBonus({ ielts: 6.0 })).toBe(4.0);
    expect(computeIuEncouragementBonus({ ielts: 6.5 })).toBe(4.5);
    expect(computeIuEncouragementBonus({ ielts: 7.0 })).toBe(5.0);
    expect(computeIuEncouragementBonus({ ielts: 7.5 })).toBe(5.0);
  });

  it('below the lowest threshold gives 0, never extrapolated', () => {
    expect(computeIuEncouragementBonus({ ielts: 4.5 })).toBe(0);
  });

  it('maps TOEFL iBT and TOEIC thresholds too', () => {
    expect(computeIuEncouragementBonus({ toeflIbt: 35 })).toBe(3.0);
    expect(computeIuEncouragementBonus({ toeflIbt: 94 })).toBe(5.0);
    expect(computeIuEncouragementBonus({ toeic: 450 })).toBe(3.0);
    expect(computeIuEncouragementBonus({ toeic: 850 })).toBe(5.0);
  });

  it('takes the best of multiple certificates provided at once', () => {
    expect(computeIuEncouragementBonus({ ielts: 5.0, toeflIbt: 94 })).toBe(5.0);
  });

  it('returns 0 when the certificate was already used for THPT English exemption', () => {
    expect(computeIuEncouragementBonus({ ielts: 7.0, usedForThptEnglishExemption: true })).toBe(0);
  });
});

describe('computeIuTotalBonus', () => {
  it('sums all three components uncapped when under 10', () => {
    const result = computeIuTotalBonus({
      awardTier: 'none',
      hasPrioritySchool: true,
      specialAchievementCount: 0,
      certificate: { ielts: 6.0 },
    });
    expect(result.xetThuongBonus).toBe(3);
    expect(result.encouragementBonus).toBe(4.0);
    expect(result.awardBonus).toBe(0);
    expect(result.total).toBe(7);
    expect(result.capped).toBe(false);
  });

  it('caps the combined total at 10 even when components individually stay under their own caps', () => {
    const result = computeIuTotalBonus({
      awardTier: 'international', // 10
      hasPrioritySchool: true, // +3 xet thuong
      specialAchievementCount: 0,
      certificate: { ielts: 7.0 }, // +5 encouragement
    });
    // raw = 10 + 3 + 5 = 18 -> capped 10
    expect(result.total).toBe(10);
    expect(result.capped).toBe(true);
  });
});
