import { describe, expect, it } from 'vitest';
import type { SchoolModule } from '../core/schoolModule';
import { schoolRegistry } from '../schools';
import {
  filterSchoolsForLanding,
  getStableBadgePaletteIndex,
  getVisibleSchoolCountAfterReset,
  hasActiveLandingFilters,
  INITIAL_VISIBLE_SCHOOL_COUNT,
  matchesLandingEntityFilter,
  sortSchoolsForLanding,
  type LandingFilters,
} from './landingCatalog';

const defaultFilters: LandingFilters = {
  query: '',
  entityFilter: 'all',
  regionFilter: 'all',
  tierFilter: 'all',
  sortMode: 'useful',
};

function school(id: string, shortName: string, capabilities: SchoolModule['capabilities'], extra: Partial<SchoolModule> = {}): SchoolModule {
  return {
    id,
    shortName,
    name: extra.name ?? shortName,
    year: 2026,
    status: extra.status ?? 'formula-incomplete',
    capabilities,
    ...extra,
  };
}

describe('landing catalog helpers', () => {
  it('default sort puts verified before partial, eligibility, researched, and catalog-only', () => {
    const sorted = sortSchoolsForLanding(
      [
        school('catalog', 'AAA', { admissionInfo: false, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false }),
        school('eligibility', 'ZZZ', { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: false, exactCalculator: false }),
        school('verified', 'MMM', { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true }),
        school('partial', 'BBB', { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: false, exactCalculator: false, partialCalculator: true }),
        school('researched', 'CCC', { admissionInfo: true, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false }),
      ],
      'useful'
    );

    expect(sorted.map((item) => item.id)).toEqual(['verified', 'partial', 'eligibility', 'researched', 'catalog']);
  });

  it('A-Z sort ignores capability tier', () => {
    const sorted = sortSchoolsForLanding(
      [
        school('verified', 'ZZZ', { admissionInfo: true, programs: true, eligibility: true, cutoffs: true, scoreConversion: true, exactCalculator: true }),
        school('catalog', 'AAA', { admissionInfo: false, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false }),
      ],
      'az'
    );

    expect(sorted.map((item) => item.id)).toEqual(['catalog', 'verified']);
  });

  it('search matches full name, shortName, admissionCode, aliases, and accent-insensitive input', () => {
    const entries = [
      school('coded', 'XYZ', { admissionInfo: false, programs: false, eligibility: false, cutoffs: false, scoreConversion: false, exactCalculator: false }, {
        name: 'Tr\u01b0\u1eddng Cao \u0111\u1eb3ng K\u1ef9 thu\u1eadt V\u00ed d\u1ee5',
        admissionCode: 'ABC123',
        aliases: ['C\u0110 K\u1ef9 thu\u1eadt m\u1eabu'],
      }),
    ];

    expect(filterSchoolsForLanding(entries, { ...defaultFilters, query: 'cao dang ky thuat' }).map((item) => item.id)).toEqual(['coded']);
    expect(filterSchoolsForLanding(entries, { ...defaultFilters, query: 'XYZ' }).map((item) => item.id)).toEqual(['coded']);
    expect(filterSchoolsForLanding(entries, { ...defaultFilters, query: 'ABC123' }).map((item) => item.id)).toEqual(['coded']);
    expect(filterSchoolsForLanding(entries, { ...defaultFilters, query: 'cd ky thuat mau' }).map((item) => item.id)).toEqual(['coded']);
  });

  it('college filter includes pedagogy and vocational colleges, while academy filter stays separate', () => {
    expect(matchesLandingEntityFilter(schoolRegistry.nce, 'college')).toBe(true);
    expect(matchesLandingEntityFilter(schoolRegistry.vcte, 'college')).toBe(true);
    expect(matchesLandingEntityFilter(schoolRegistry.naem, 'academy')).toBe(true);
    expect(matchesLandingEntityFilter(schoolRegistry.naem, 'college')).toBe(false);
  });

  it('result counts and batching are based on the full filtered data', () => {
    const allResults = filterSchoolsForLanding(Object.values(schoolRegistry), defaultFilters);
    const exactResults = filterSchoolsForLanding(Object.values(schoolRegistry), { ...defaultFilters, tierFilter: 'verified-calculator' });

    expect(allResults).toHaveLength(267);
    expect(getVisibleSchoolCountAfterReset(allResults.length)).toBe(INITIAL_VISIBLE_SCHOOL_COUNT);
    expect(exactResults.length).toBeLessThan(INITIAL_VISIBLE_SCHOOL_COUNT);
    expect(getVisibleSchoolCountAfterReset(exactResults.length)).toBe(exactResults.length);
  });

  it('active filter detection ignores the default useful sort only', () => {
    expect(hasActiveLandingFilters(defaultFilters)).toBe(false);
    expect(hasActiveLandingFilters({ ...defaultFilters, query: 'ueh' })).toBe(true);
    expect(hasActiveLandingFilters({ ...defaultFilters, sortMode: 'az' })).toBe(true);
  });

  it('badge color is stable for the same school regardless of sort/filter position', () => {
    expect(getStableBadgePaletteIndex('agu', 6)).toBe(getStableBadgePaletteIndex('agu', 6));
    expect(getStableBadgePaletteIndex('ftu', 6)).toBe(getStableBadgePaletteIndex('ftu', 6));
  });
});
