import type { SchoolModule } from '../core/schoolModule';
import { schoolRegistry } from '../schools';
import { normalizeVietnameseText } from './comparisonSelection';
import { programCatalogBySchool, getProgramCatalogEntry as getProgramCatalogEntryFromCatalog, type ProgramCatalogEntry } from './programCatalog';

export type { ProgramCatalogEntry };
export type UniversityCapability = 'exact' | 'partial' | 'eligibility' | 'catalog-only';

export interface UniversityCatalogEntry {
  schoolId: string;
  shortName: string;
  fullName: string;
  region?: string;
  city?: string;
  programs: ProgramCatalogEntry[];
  capability: UniversityCapability;
}

function getCapability(module: SchoolModule): UniversityCapability {
  if (module.capabilities?.exactCalculator) return 'exact';
  if (module.capabilities?.partialCalculator) return 'partial';
  if (module.capabilities?.eligibility) return 'eligibility';
  return module.status === 'supported' ? 'exact' : 'catalog-only';
}

export const universityCatalog: UniversityCatalogEntry[] = Object.values(schoolRegistry)
  .map((module) => ({
    schoolId: module.id,
    shortName: module.shortName,
    fullName: module.name,
    region: module.id === 'agu' ? 'Mien Tay' : 'TP.HCM va vung lan can',
    city: module.id === 'agu' ? 'An Giang' : 'TP.HCM',
    programs: programCatalogBySchool[module.id] ?? [],
    capability: getCapability(module),
  }))
  .filter((entry) => entry.programs.length > 0 || entry.capability !== 'catalog-only');

export function getUniversityCatalogEntry(schoolId: string): UniversityCatalogEntry | undefined {
  return universityCatalog.find((entry) => entry.schoolId === schoolId);
}

export const getProgramCatalogEntry = getProgramCatalogEntryFromCatalog;

export function getCapabilityLabel(capability: UniversityCapability, schoolId?: string): string {
  if (schoolId === 'ussh' && capability === 'exact') return 'Chinh xac voi ho so phu hop';
  if (capability === 'exact') return 'Chinh xac';
  if (capability === 'partial') return 'Mot phan';
  if (capability === 'eligibility') return 'Kiem tra dieu kien';
  return 'Thong tin';
}

export function searchUniversityCatalog(query: string, entries: readonly UniversityCatalogEntry[] = universityCatalog): UniversityCatalogEntry[] {
  const normalizedQuery = normalizeVietnameseText(query);
  if (!normalizedQuery) return [...entries];
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return entries.filter((entry) =>
    [entry.schoolId, entry.shortName, entry.fullName, entry.city, entry.region].some((value) => {
      const normalizedValue = normalizeVietnameseText(value ?? '');
      return normalizedValue.includes(normalizedQuery) || queryTokens.every((token) => normalizedValue.includes(token));
    })
  );
}

export function searchProgramCatalog(query: string, programs: readonly ProgramCatalogEntry[]): ProgramCatalogEntry[] {
  const normalizedQuery = normalizeVietnameseText(query);
  if (!normalizedQuery) return [...programs];
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return programs.filter((program) =>
    [program.programId, program.code, program.name, program.campus, program.track].some((value) => {
      const normalizedValue = normalizeVietnameseText(value ?? '');
      return normalizedValue.includes(normalizedQuery) || queryTokens.every((token) => normalizedValue.includes(token));
    })
  );
}
