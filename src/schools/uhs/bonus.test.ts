import { describe, expect, it } from 'vitest';
import { calculateUhsBonus, isUhsForeignCertificateEligible, isUhsSatEligible } from './bonus';

describe('UHS bonus', () => {
  it('checks official foreign-language certificate boundaries and validity window', () => {
    expect(isUhsForeignCertificateEligible({ type: 'ielts', score: 6, issuedWithinTwoYears: true })).toBe(true);
    expect(isUhsForeignCertificateEligible({ type: 'ielts', score: 5.5, issuedWithinTwoYears: true })).toBe(false);
    expect(isUhsForeignCertificateEligible({ type: 'toeflIbt', score: 79, issuedWithinTwoYears: true })).toBe(true);
    expect(isUhsForeignCertificateEligible({ type: 'toeflItp', score: 550, issuedWithinTwoYears: true })).toBe(true);
    expect(isUhsForeignCertificateEligible({ type: 'toeic', toeicListeningReading: 671, toeicSpeakingWriting: 271, issuedWithinTwoYears: true })).toBe(true);
    expect(isUhsForeignCertificateEligible({ type: 'vstep', vstepLevel: 4, issuedWithinTwoYears: true })).toBe(true);
    expect(isUhsForeignCertificateEligible({ type: 'ielts', score: 9, issuedWithinTwoYears: false })).toBe(false);
  });

  it('checks SAT threshold and validity window', () => {
    expect(isUhsSatEligible(1280, true)).toBe(true);
    expect(isUhsSatEligible(1279, true)).toBe(false);
    expect(isUhsSatEligible(1600, false)).toBe(false);
  });

  it('calculates bonus with multiplier 5 and certificate/SAT cap', () => {
    const result = calculateUhsBonus({
      foreignCertificate: { type: 'ielts', score: 9, issuedWithinTwoYears: true },
      satScore: 1600,
      satIssuedWithinTwoYears: true,
    });
    expect(result.foreignLanguageBonus).toBe(5);
    expect(result.satBonus).toBe(5);
    expect(result.certificateSatBonus).toBe(5);
    expect(result.totalBonus).toBe(5);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it('adds preferred-school academic component only when factual conditions are met', () => {
    expect(
      calculateUhsBonus({
        preferredSchool: { studiedAtLeastTwoYears: true, threeYearPerformanceGoodOrBetter: true, averageAcademicScore10: 9 },
      }).preferredSchoolBonus
    ).toBe(4.5);
    expect(
      calculateUhsBonus({
        preferredSchool: { studiedAtLeastTwoYears: false, threeYearPerformanceGoodOrBetter: true, averageAcademicScore10: 9 },
      }).preferredSchoolBonus
    ).toBeUndefined();
  });
});
