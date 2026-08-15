import { describe, expect, it } from 'vitest';
import { calculateUelBonus, calculateUelBonusEligibility, lookupUelCertificateBonus } from './bonus';

describe('calculateUelBonusEligibility', () => {
  it('không chọn -> rỗng', () => {
    const result = calculateUelBonusEligibility([]);
    expect(result.eligibleCategories).toEqual([]);
    expect(result.exactPointsKnown).toBe(false);
  });

  it('chọn priority-school -> cap 5, overallCap 10, không phải awarded score', () => {
    const result = calculateUelBonusEligibility(['priority-school']);
    expect(result.categoryCaps).toEqual({ 'priority-school': 5 });
    expect(result.overallCap).toBe(10);
    expect(result.exactPointsKnown).toBe(false);
  });
});

describe('lookupUelCertificateBonus', () => {
  it('covers IELTS official boundaries without interpolation', () => {
    expect(lookupUelCertificateBonus({ ielts: 4.99 })).toBe(0);
    expect(lookupUelCertificateBonus({ ielts: 5.0 })).toBe(2);
    expect(lookupUelCertificateBonus({ ielts: 5.5 })).toBe(3.5);
    expect(lookupUelCertificateBonus({ ielts: 6.0 })).toBe(5);
  });

  it('covers TOEFL iBT official boundaries', () => {
    expect(lookupUelCertificateBonus({ toeflIbt: 44 })).toBe(0);
    expect(lookupUelCertificateBonus({ toeflIbt: 45 })).toBe(2);
    expect(lookupUelCertificateBonus({ toeflIbt: 59 })).toBe(3.5);
    expect(lookupUelCertificateBonus({ toeflIbt: 78 })).toBe(5);
  });

  it('covers TOEIC listening-reading official boundaries', () => {
    expect(lookupUelCertificateBonus({ toeic: 549 })).toBe(0);
    expect(lookupUelCertificateBonus({ toeic: 550 })).toBe(2);
    expect(lookupUelCertificateBonus({ toeic: 670 })).toBe(3.5);
    expect(lookupUelCertificateBonus({ toeic: 785 })).toBe(5);
  });

  it('takes the highest supported certificate and applies the overall bonus cap with priority-school bonus', () => {
    expect(lookupUelCertificateBonus({ ielts: 5.5, toeflIbt: 78, toeic: 550 })).toBe(5);
    expect(calculateUelBonus({ certificateBonus: 5, prioritySchool: true })).toBe(10);
  });
});
