import { describe, expect, it } from 'vitest';
import { deriveSchoolCtaLabel } from './schoolCta';
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
  it('dùng label non-action khi không có Page, bất kể capabilities', () => {
    const school = makeSchool({ capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true } });
    expect(deriveSchoolCtaLabel(school)).toBe('Chưa có dữ liệu chi tiết');
  });

  it('Tính điểm khi exactCalculator=true dù cũng có eligibility/scoreConversion', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính điểm');
  });

  it('Tính một phần khi partialCalculator=true, chưa exact', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: false, partialCalculator: true },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính một phần');
  });

  it('Quy đổi điểm khi chỉ có scoreConversion', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: false, cutoffs: true, scoreConversion: true, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Quy đổi điểm');
  });

  it('Kiểm tra điều kiện khi chỉ có eligibility', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: false, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Kiểm tra điều kiện');
  });

  it('Xem thông tin khi chỉ có admissionInfo', () => {
    const school = makeSchool({
      Page: (() => null) as unknown as SchoolModule['Page'],
      capabilities: { admissionInfo: true, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false },
    });
    expect(deriveSchoolCtaLabel(school)).toBe('Xem thông tin');
  });

  it('fallback theo status khi Page có nhưng chưa set capabilities', () => {
    const school = makeSchool({ Page: (() => null) as unknown as SchoolModule['Page'], status: 'supported' });
    expect(deriveSchoolCtaLabel(school)).toBe('Tính điểm');
  });
});
