import type { SchoolModule } from '../core/schoolModule';
import { schoolRegistry } from '../schools';
import { hcmutPrograms } from '../schools/hcmut/data/programs';
import { uehPrograms } from '../schools/ueh/data/programs';
import { uelPrograms } from '../schools/uel/data/programs';
import { uitPrograms } from '../schools/uit/data/programs';
import { hcmusProgramThresholds } from '../schools/hcmus/data/programThresholds';
import { usshPrograms } from '../schools/ussh/data/programs';
import { UHS_PROGRAMS } from '../schools/uhs/programs';
import { iuPrograms } from '../schools/iu/data/programs';
import { AGU_PROGRAM_THRESHOLDS_2026 } from '../schools/agu/data/thresholds';
import { normalizeVietnameseText } from './comparisonSelection';

export type UniversityCapability = 'exact' | 'partial' | 'eligibility' | 'catalog-only';

export interface ProgramCatalogEntry {
  programId: string;
  code?: string;
  name: string;
  campus?: string;
  track?: string;
  admissionMethods?: string[];
}

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

const programCatalogBySchool: Record<string, ProgramCatalogEntry[]> = {
  hcmut: hcmutPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, track: program.group })),
  ueh: uehPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, campus: program.campus })),
  uel: uelPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, track: program.group })),
  uit: uitPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  hcmus: hcmusProgramThresholds.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  ussh: usshPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  uhs: UHS_PROGRAMS.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  iu: iuPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  agu: AGU_PROGRAM_THRESHOLDS_2026.map((program) => ({ programId: program.programCode, code: program.programCode, name: program.name })),
};

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

export function getProgramCatalogEntry(schoolId: string, programId: string | undefined): ProgramCatalogEntry | undefined {
  if (!programId) return undefined;
  return getUniversityCatalogEntry(schoolId)?.programs.find((program) => program.programId === programId);
}

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
  return entries.filter((entry) =>
    [entry.schoolId, entry.shortName, entry.fullName, entry.city, entry.region].some((value) =>
      normalizeVietnameseText(value ?? '').includes(normalizedQuery)
    )
  );
}

export function searchProgramCatalog(query: string, programs: readonly ProgramCatalogEntry[]): ProgramCatalogEntry[] {
  const normalizedQuery = normalizeVietnameseText(query);
  if (!normalizedQuery) return [...programs];
  return programs.filter((program) =>
    [program.programId, program.code, program.name, program.campus, program.track].some((value) =>
      normalizeVietnameseText(value ?? '').includes(normalizedQuery)
    )
  );
}
