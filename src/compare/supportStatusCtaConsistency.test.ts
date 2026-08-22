import { describe, expect, it } from 'vitest';
import { hasSchoolCtaAction, deriveSchoolCtaLabel } from '../core/schoolCta';
import { deriveInstitutionSupportStatus } from '../data/institutionCoverage';
import { schoolRegistry } from '../schools';
import { schoolComparisonAdapterRegistry } from './comparisonRegistry';

describe('support status and CTA consistency', () => {
  it('verified, partial, and eligibility schools have a usable route or compare adapter action', () => {
    for (const school of Object.values(schoolRegistry)) {
      const status = deriveInstitutionSupportStatus(school);
      if (status === 'verified-calculator' || status === 'partial-calculator' || status === 'eligibility-only') {
        expect(
          school.Page || schoolComparisonAdapterRegistry[school.id],
          `${school.id} is ${status} but has neither detail Page nor compare adapter`
        ).toBeTruthy();
        expect(hasSchoolCtaAction(school), `${school.id} is ${status} but has no CTA action`).toBe(true);
      }
    }
  });

  it('does not label partial or eligibility-only schools as exact calculators', () => {
    for (const school of Object.values(schoolRegistry)) {
      const status = deriveInstitutionSupportStatus(school);
      if (status === 'partial-calculator') expect(deriveSchoolCtaLabel(school), school.id).not.toBe('Tính điểm');
      if (status === 'eligibility-only') expect(deriveSchoolCtaLabel(school), school.id).toBe('Kiểm tra điều kiện');
    }
  });

  it('does not expose fake calculator CTAs for catalog-only schools', () => {
    for (const school of Object.values(schoolRegistry)) {
      if (deriveInstitutionSupportStatus(school) === 'catalog-only') {
        expect(hasSchoolCtaAction(school), school.id).toBe(false);
        expect(deriveSchoolCtaLabel(school), school.id).toBe('Chưa có dữ liệu chi tiết');
      }
    }
  });

  it('locks the FTU compare-only calculator CTA regression', () => {
    const ftu = schoolRegistry.ftu;
    expect(deriveInstitutionSupportStatus(ftu)).toBe('verified-calculator');
    expect(ftu.Page).toBeUndefined();
    expect(schoolComparisonAdapterRegistry.ftu).toBeDefined();
    expect(deriveSchoolCtaLabel(ftu)).toBe('Tính điểm');
    expect(hasSchoolCtaAction(ftu)).toBe(true);
  });
});
