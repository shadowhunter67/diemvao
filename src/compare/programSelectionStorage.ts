import { getSchoolStorageKey } from '../core/storage';
import { hcmutPrograms } from '../schools/hcmut/data/programs';
import { uehPrograms } from '../schools/ueh/data/programs';
import { uelPrograms } from '../schools/uel/data/programs';
import { uitPrograms } from '../schools/uit/data/programs';

const programIdsBySchool: Record<string, Set<string>> = {
  hcmut: new Set(hcmutPrograms.map((program) => program.id)),
  ueh: new Set(uehPrograms.map((program) => program.id)),
  uel: new Set(uelPrograms.map((program) => program.id)),
  uit: new Set(uitPrograms.map((program) => program.id)),
};

function getProgramStorageKey(schoolId: string): string {
  return getSchoolStorageKey(schoolId, 'program', 1);
}

export function parseStoredProgramId(schoolId: string, raw: string | null): string | undefined {
  if (raw === null) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const programId =
      typeof parsed === 'string'
        ? parsed
        : parsed && typeof parsed === 'object' && 'selectedProgramId' in parsed && typeof parsed.selectedProgramId === 'string'
          ? parsed.selectedProgramId
          : parsed && typeof parsed === 'object' && 'programId' in parsed && typeof parsed.programId === 'string'
            ? parsed.programId
            : undefined;
    return programId && programIdsBySchool[schoolId]?.has(programId) ? programId : undefined;
  } catch {
    return undefined;
  }
}

export function loadStoredProgramId(schoolId: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return parseStoredProgramId(schoolId, localStorage.getItem(getProgramStorageKey(schoolId)));
}

export function loadStoredProgramSelections(): Partial<Record<string, string>> {
  return {
    hcmut: loadStoredProgramId('hcmut'),
    ueh: loadStoredProgramId('ueh'),
    uel: loadStoredProgramId('uel'),
    uit: loadStoredProgramId('uit'),
  };
}

export function saveStoredProgramId(schoolId: string, programId: string): void {
  if (typeof window === 'undefined') return;
  const key = getProgramStorageKey(schoolId);
  if (!programIdsBySchool[schoolId]?.has(programId)) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify({ selectedProgramId: programId }));
}
