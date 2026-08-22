import { describe, expect, it } from 'vitest';
import { deriveSchoolCtaLabel, hasSchoolCtaAction } from './schoolCta';
import type { SchoolModule } from './schoolModule';

function makeSchool(overrides: Partial<SchoolModule>): SchoolModule {
  return {
    id: 'x',
    name: 'X',
    shortName: 'X',
    year: 2026,
    status: 'researching',
    ...overrides,
  };
}

describe('deriveSchoolCtaLabel', () => {
  it('uses calculator label for compare-only exact capability without a Page', () => {
    const school = makeSchool({
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính điểm');
    expect(hasSchoolCtaAction(school)).toBe(true);
  });

  it('does not create a fake action for catalog-only schools without a Page', () => {
    const school = makeSchool({
      capabilities: { admissionInfo: false, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Chưa có dữ liệu chi tiết');
    expect(hasSchoolCtaAction(school)).toBe(false);
  });

  it('uses exact calculator label before weaker capabilities', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính điểm');
    expect(hasSchoolCtaAction(school)).toBe(true);
  });

  it('uses partial calculator label when partialCalculator=true and exactCalculator=false', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: false, partialCalculator: true },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính một phần');
  });

  it('uses score conversion label when only scoreConversion is available', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: false, cutoffs: true, scoreConversion: true, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Quy đổi điểm');
  });

  it('uses eligibility label when only eligibility is available', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: false, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Kiểm tra điều kiện');
  });

  it('uses information label when only admissionInfo is available', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Xem thông tin');
  });

  it('falls back by status when a Page exists but capabilities are not set', () => {
    const school = makeSchool({ Page: (() => null) as unknown as SchoolModule['Page'], status: 'supported' });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính điểm');
  });
});
