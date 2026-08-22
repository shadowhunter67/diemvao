import { describe, expect, it } from 'vitest';
import { deriveSchoolCtaAction, deriveSchoolCtaLabel, hasSchoolCtaAction } from '../core/schoolCta';
import { deriveInstitutionSupportStatus } from '../data/institutionCoverage';
import { schoolRegistry } from '../schools';
import { schoolComparisonAdapterRegistry } from './comparisonRegistry';

describe('support status and CTA consistency', () => {
  it('verified, partial, and eligibility schools have a usable school route or compare adapter action', () => {
    for (const school of Object.values(schoolRegistry)) {
      const status = deriveInstitutionSupportStatus(school);
      if (status === 'verified-calculator' || status === 'partial-calculator' || status === 'eligibility-only') {
        expect(
          school.Page || schoolComparisonAdapterRegistry[school.id],
          `${school.id} is ${status} but has neither detail Page nor compare adapter`
        ).toBeTruthy();
        expect(hasSchoolCtaAction(school), `${school.id} is ${status} but has no CTA action`).toBe(true);
        expect(deriveSchoolCtaAction(school), `${school.id} calculator CTA must open a school-specific route`).toEqual(
          expect.objectContaining({ kind: 'school', schoolId: school.id })
        );
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

  it('does not send calculator-worded CTAs to compare', () => {
    for (const school of Object.values(schoolRegistry)) {
      const label = deriveSchoolCtaLabel(school);
      const action = deriveSchoolCtaAction(school);
      if (action.kind === 'compare') {
        expect(label.toLowerCase(), school.id).toContain('so sánh');
      }
      if (label === 'Tính điểm' || label === 'Tính một phần' || label === 'Kiểm tra điều kiện' || label === 'Quy đổi điểm') {
        expect(action.kind, school.id).toBe('school');
      }
    }
  });

  it('locks the FTU no-Page calculator CTA regression', () => {
    const ftu = schoolRegistry.ftu;
    expect(deriveInstitutionSupportStatus(ftu)).toBe('verified-calculator');
    expect(ftu.Page).toBeUndefined();
    expect(schoolComparisonAdapterRegistry.ftu).toBeDefined();
    expect(deriveSchoolCtaLabel(ftu)).toBe('Tính điểm');
    expect(deriveSchoolCtaAction(ftu)).toEqual({ kind: 'school', schoolId: 'ftu' });
    expect(hasSchoolCtaAction(ftu)).toBe(true);
  });
});
