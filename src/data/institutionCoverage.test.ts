import { describe, expect, it } from 'vitest';
import { schoolRegistry } from '../schools';
import {
  countsAsInstitutionEntry,
  countsAsUniversityInstitution,
  auditInstitutionCatalog,
  deriveInstitutionSupportStatus,
  institutionCoverage,
  summarizeInstitutionCoverage,
} from './institutionCoverage';
import { collegeCatalogSchools } from '../schools/collegeCatalog';

describe('institution coverage statistics', () => {
  it('separates catalog coverage from institution KPI coverage', () => {
    expect(institutionCoverage.totalCatalogEntries).toBe(267);
    expect(institutionCoverage.institutionEntries).toBeLessThan(institutionCoverage.totalCatalogEntries);
    expect(institutionCoverage.internalUnitEntries).toBe(10);
    expect(institutionCoverage.institutionEntries + institutionCoverage.internalUnitEntries).toBe(institutionCoverage.totalCatalogEntries);
  });

  it('does not count known internal HUST/NEU/TNU units as independent institutions', () => {
    for (const schoolId of ['tnuis', 'soict', 'sms', 'sme', 'scls', 'seee', 'semhust', 'neucob', 'ncepa', 'nctneu']) {
      expect(countsAsInstitutionEntry(schoolRegistry[schoolId])).toBe(false);
    }
  });

  it('keeps catalog-only schools out of calculator support buckets', () => {
    for (const school of Object.values(schoolRegistry)) {
      if (deriveInstitutionSupportStatus(school) !== 'catalog-only') continue;
      expect(school.capabilities?.exactCalculator).not.toBe(true);
      expect(school.capabilities?.partialCalculator).not.toBe(true);
      expect(school.capabilities?.scoreConversion).not.toBe(true);
      expect(school.capabilities?.eligibility).not.toBe(true);
    }
  });

  it('keeps college catalog entries out of university KPI and calculator buckets', () => {
    for (const college of collegeCatalogSchools) {
      const school = schoolRegistry[college.id];

      expect(countsAsInstitutionEntry(school)).toBe(true);
      expect(countsAsUniversityInstitution(school)).toBe(false);
      expect(deriveInstitutionSupportStatus(school)).toBe('catalog-only');
      expect(school.capabilities?.exactCalculator).toBe(false);
      expect(school.capabilities?.partialCalculator).not.toBe(true);
      expect(school.capabilities?.scoreConversion).toBe(false);
      expect(school.capabilities?.eligibility).toBe(false);
    }
  });

  it('derives stable public KPI counts from the registry', () => {
    expect(summarizeInstitutionCoverage()).toEqual({
      totalCatalogEntries: 267,
      institutionEntries: 257,
      independentEducationInstitutions: 257,
      universityInstitutions: 206,
      academies: 22,
      pedagogicalColleges: 3,
      vocationalColleges: 26,
      otherIndependentInstitutions: 0,
      internalUnitEntries: 10,
      researched: 47,
      admissionDataAvailable: 47,
      eligibilitySupported: 18,
      calculatorSupported: 17,
      partialCalculator: 3,
      fullyVerified: 14,
      catalogOnly: 220,
    });
  });

  it('documents researched as admission-data-or-better semantics', () => {
    const summary = summarizeInstitutionCoverage();
    const researchedOnly = summary.admissionDataAvailable - summary.eligibilitySupported - summary.partialCalculator - summary.fullyVerified;

    expect(summary.researched).toBe(summary.admissionDataAvailable);
    expect(researchedOnly).toBe(12);
    for (const schoolId of ['vnuuet', 'vnueb', 'vnuhus', 'vnussh', 'vnuvju', 'hust', 'tmu', 'haui', 'aof', 'bav', 'hanu', 'hou']) {
      expect(deriveInstitutionSupportStatus(schoolRegistry[schoolId]), schoolId).toBe('researched');
    }
  });

  it('requires catalog source metadata for college identity entries', () => {
    for (const college of collegeCatalogSchools) {
      const school = schoolRegistry[college.id];

      expect(school.catalogSources?.length, `${college.id} should have catalogSources`).toBeGreaterThan(0);
    }
  });

  it('keeps independent institution categories reconciled', () => {
    const summary = summarizeInstitutionCoverage();
    expect(
      summary.universityInstitutions +
        summary.academies +
        summary.pedagogicalColleges +
        summary.vocationalColleges +
        summary.otherIndependentInstitutions
    ).toBe(summary.independentEducationInstitutions);
  });

  it('audits catalog identity/classification invariants', () => {
    expect(auditInstitutionCatalog().filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('detects duplicate admission codes and vocational colleges with calculator capability', () => {
    const base = schoolRegistry.nce;
    const vocational = schoolRegistry.vcte;
    const issues = auditInstitutionCatalog([
      { ...base, id: 'a', admissionCode: 'DUP' },
      { ...base, id: 'b', admissionCode: 'DUP', name: 'Another name' },
      { ...vocational, id: 'bad-vocational', capabilities: { ...vocational.capabilities!, exactCalculator: true } },
    ]);

    expect(issues).toContainEqual(expect.objectContaining({ code: 'DUPLICATE_ADMISSION_CODE', severity: 'error' }));
    expect(issues).toContainEqual(expect.objectContaining({ code: 'VOCATIONAL_COLLEGE_HAS_UNIVERSITY_CAPABILITY', severity: 'error', schoolId: 'bad-vocational' }));
  });
});
