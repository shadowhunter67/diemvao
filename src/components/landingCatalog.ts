import type { SchoolEntityLevel, SchoolModule, SchoolRegion } from '../core/schoolModule';
import {
  deriveInstitutionSupportStatus,
  getSchoolEntityLevel,
  type InstitutionSupportStatus,
} from '../data/institutionCoverage';

export type LandingEntityFilter = 'university' | 'academy' | 'college' | 'college_pedagogy' | 'vocational_college' | 'all';
export type LandingSortMode = 'useful' | 'az';
export type OptionalLandingFilter<T extends string> = T | 'all';

export interface LandingFilters {
  query: string;
  entityFilter: LandingEntityFilter;
  regionFilter: OptionalLandingFilter<SchoolRegion>;
  tierFilter: OptionalLandingFilter<InstitutionSupportStatus>;
  sortMode: LandingSortMode;
}

export const INITIAL_VISIBLE_SCHOOL_COUNT = 24;
export const VISIBLE_SCHOOL_INCREMENT = 24;

export const SUPPORT_TIER_ORDER: readonly InstitutionSupportStatus[] = [
  'verified-calculator',
  'partial-calculator',
  'eligibility-only',
  'researched',
  'catalog-only',
];

export const UNIVERSITY_FILTER_LEVELS: readonly SchoolEntityLevel[] = [
  'institution',
  'university_system',
  'member_university',
  'other_degree_awarding_institution',
];

export function normalizeForLandingSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/gi, 'd')
    .toLowerCase();
}

export function matchesLandingEntityFilter(school: SchoolModule, filter: LandingEntityFilter): boolean {
  const entityLevel = getSchoolEntityLevel(school);
  if (filter === 'all') return true;
  if (filter === 'university') return UNIVERSITY_FILTER_LEVELS.includes(entityLevel);
  if (filter === 'academy') return entityLevel === 'academy';
  if (filter === 'college') return entityLevel === 'college_pedagogy' || entityLevel === 'vocational_college';
  return entityLevel === filter;
}

export function sortSchoolsForLanding(schools: readonly SchoolModule[], sortMode: LandingSortMode): SchoolModule[] {
  const tierRank = new Map(SUPPORT_TIER_ORDER.map((tier, index) => [tier, index]));
  return [...schools].sort((a, b) => {
    if (sortMode === 'useful') {
      const byTier = (tierRank.get(deriveInstitutionSupportStatus(a)) ?? 99) - (tierRank.get(deriveInstitutionSupportStatus(b)) ?? 99);
      if (byTier !== 0) return byTier;
    }
    return a.shortName.localeCompare(b.shortName, 'vi');
  });
}

export function filterSchoolsForLanding(schools: readonly SchoolModule[], filters: LandingFilters): SchoolModule[] {
  const normalizedQuery = normalizeForLandingSearch(filters.query.trim());
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return sortSchoolsForLanding(schools, filters.sortMode)
    .filter((school) => {
      if (!normalizedQuery) return true;
      return [school.shortName, school.name, school.admissionCode, ...(school.aliases ?? [])].some((value) => {
        const normalizedValue = normalizeForLandingSearch(value ?? '');
        return normalizedValue.includes(normalizedQuery) || queryTokens.every((token) => normalizedValue.includes(token));
      });
    })
    .filter((school) => matchesLandingEntityFilter(school, filters.entityFilter))
    .filter((school) => filters.regionFilter === 'all' || school.region === filters.regionFilter)
    .filter((school) => filters.tierFilter === 'all' || deriveInstitutionSupportStatus(school) === filters.tierFilter);
}

export function getVisibleSchoolCountAfterReset(totalResults: number): number {
  return totalResults <= INITIAL_VISIBLE_SCHOOL_COUNT ? totalResults : INITIAL_VISIBLE_SCHOOL_COUNT;
}

export function hasActiveLandingFilters(filters: LandingFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.entityFilter !== 'all' ||
    filters.regionFilter !== 'all' ||
    filters.tierFilter !== 'all' ||
    filters.sortMode !== 'useful'
  );
}

export function getStableBadgePaletteIndex(schoolId: string, paletteSize: number): number {
  let hash = 0;
  for (let index = 0; index < schoolId.length; index += 1) {
    hash = (hash * 31 + schoolId.charCodeAt(index)) >>> 0;
  }
  return paletteSize === 0 ? 0 : hash % paletteSize;
}
