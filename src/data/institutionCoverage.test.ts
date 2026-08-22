import { describe, expect, it } from 'vitest';
import { schoolRegistry } from '../schools';
import {
  countsAsInstitutionEntry,
  deriveInstitutionSupportStatus,
  institutionCoverage,
  summarizeInstitutionCoverage,
} from './institutionCoverage';

describe('institution coverage statistics', () => {
  it('separates catalog coverage from institution KPI coverage', () => {
    expect(institutionCoverage.totalCatalogEntries).toBe(238);
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

  it('derives stable public KPI counts from the registry', () => {
    expect(summarizeInstitutionCoverage()).toEqual({
      totalCatalogEntries: 238,
      institutionEntries: 228,
      internalUnitEntries: 10,
      researched: 35,
      eligibilitySupported: 18,
      calculatorSupported: 17,
      partialCalculator: 3,
      fullyVerified: 14,
      catalogOnly: 203,
    });
  });
});
