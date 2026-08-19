import { describe, expect, it } from 'vitest';
import { calculateUfmBonus30, resolveUfmEnglishCertificateTier, UFM_BONUS_CAP_30 } from './bonus';

describe('calculateUfmBonus30', () => {
  it('returns all-zero when no achievement is given', () => {
    const result = calculateUfmBonus30({});
    expect(result).toEqual({ b1: 0, b2: 0, b3: 0, total30: 0 });
  });

  it('applies b1 giải Nhất/Nhì/Ba (3,0/2,0/1,5)', () => {
    expect(calculateUfmBonus30({ nationalAchievementLevel: 'first' }).b1).toBe(3);
    expect(calculateUfmBonus30({ nationalAchievementLevel: 'second' }).b1).toBe(2);
    expect(calculateUfmBonus30({ nationalAchievementLevel: 'third' }).b1).toBe(1.5);
  });

  it('sums b2 sub-groups and caps at 1,5', () => {
    const oneGroup = calculateUfmBonus30({ nationalEncouragementAward: true });
    expect(oneGroup.b2).toBe(1);

    const twoGroups = calculateUfmBonus30({ giftedSchoolStudent: true, goodStudentThreeYears: true });
    expect(twoGroups.b2).toBe(1.5); // 0.75 + 0.75 = 1.5, exactly at cap

    const allThree = calculateUfmBonus30({ nationalEncouragementAward: true, giftedSchoolStudent: true, goodStudentThreeYears: true });
    expect(allThree.b2).toBe(1.5); // 1 + 0.75 + 0.75 = 2.5, capped to 1.5
  });

  it('caps b3 at 1,5 even if a higher tier were passed', () => {
    const result = calculateUfmBonus30({ englishCertificateTier: 1.5 });
    expect(result.b3).toBe(1.5);
  });

  it('caps the grand total at 3,0 (10% of thang 30) even when b1+b2+b3 would exceed it', () => {
    const result = calculateUfmBonus30({
      nationalAchievementLevel: 'first', // 3.0
      nationalEncouragementAward: true, // +1.0 (b2, still under its own 1.5 cap alone)
      englishCertificateTier: 1.5, // +1.5
    });
    expect(result.b1).toBe(3);
    expect(result.b2).toBe(1);
    expect(result.b3).toBe(1.5);
    expect(result.total30).toBe(UFM_BONUS_CAP_30); // 3 + 1 + 1.5 = 5.5, capped to 3
  });

  it('sums under the cap normally when total is below 3,0', () => {
    const result = calculateUfmBonus30({ giftedSchoolStudent: true, englishCertificateTier: 0.5 });
    expect(result.total30).toBe(1.25); // 0.75 + 0.5
  });
});

describe('resolveUfmEnglishCertificateTier — Bảng 1', () => {
  it('resolves CEFR-family levels (cefr/cambridge/aptis)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'cefr', level: 'B1' })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'cefr', level: 'B2' })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'cefr', level: 'C1' })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'cefr', level: 'C2' })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'cambridge', level: 'B2' })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'aptis', level: 'C1' })).toBe(1.5);
  });

  it('resolves VSTEP bậc 3/4/5/6', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'vstep', level: 3 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'vstep', level: 4 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'vstep', level: 5 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'vstep', level: 6 })).toBe(1.5);
  });

  it('resolves PEIC levels', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'peic', level: 2 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'peic', level: 3 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'peic', level: 4 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'peic', level: 5 })).toBe(1.5);
  });

  it('resolves TOEFL iBT boundaries (45 | 46-93 | 94-120)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 45 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 46 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 93 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 94 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 120 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-ibt', score: 0 })).toBeUndefined();
  });

  it('resolves TOEFL ITP boundaries (450-499 | 500-626 | 627-677)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 449 })).toBeUndefined();
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 450 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 499 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 500 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 627 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 677 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'toefl-itp', score: 678 })).toBeUndefined();
  });

  it('resolves IELTS Academic boundaries (5.0 | 5.5-6.5 | 7.0-9.0)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'ielts', score: 5.0 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'ielts', score: 5.5 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'ielts', score: 6.5 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'ielts', score: 7.0 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'ielts', score: 9.0 })).toBe(1.5);
  });

  it('resolves PTE Academic boundaries (43-58 | 59-75 | 76-90)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 42 })).toBeUndefined();
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 43 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 58 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 59 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 76 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'pte-academic', score: 90 })).toBe(1.5);
  });

  it('resolves SAT boundaries (1200-1290 | 1300-1390 | >=1400)', () => {
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 1199 })).toBeUndefined();
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 1200 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 1290 })).toBe(0.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 1300 })).toBe(0.75);
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 1400 })).toBe(1.5);
    expect(resolveUfmEnglishCertificateTier({ type: 'sat', score: 2000 })).toBe(1.5);
  });

  it('resolves TOEIC as the minimum tier across all 4 skills', () => {
    // All 4 skills clear tier 1.5.
    expect(
      resolveUfmEnglishCertificateTier({ type: 'toeic', scores: { listening: 490, reading: 455, speaking: 180, writing: 180 } }),
    ).toBe(1.5);

    // Listening only clears tier 0.5 (275) while others clear 1.5 -> overall tier = weakest skill (0.5).
    expect(
      resolveUfmEnglishCertificateTier({ type: 'toeic', scores: { listening: 275, reading: 455, speaking: 180, writing: 180 } }),
    ).toBe(0.5);

    // One skill below every band -> no tier at all.
    expect(
      resolveUfmEnglishCertificateTier({ type: 'toeic', scores: { listening: 100, reading: 455, speaking: 180, writing: 180 } }),
    ).toBeUndefined();
  });
});
