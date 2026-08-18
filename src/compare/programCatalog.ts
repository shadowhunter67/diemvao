import { hcmutPrograms } from '../schools/hcmut/data/programs';
import { uehPrograms } from '../schools/ueh/data/programs';
import { uelPrograms } from '../schools/uel/data/programs';
import { uitPrograms } from '../schools/uit/data/programs';
import { hcmusProgramThresholds } from '../schools/hcmus/data/programThresholds';
import { usshPrograms } from '../schools/ussh/data/programs';
import { UHS_PROGRAMS } from '../schools/uhs/programs';
import { iuPrograms } from '../schools/iu/data/programs';
import { AGU_PROGRAM_THRESHOLDS_2026 } from '../schools/agu/data/thresholds';
import { hcmueProgramThresholds } from '../schools/hcmue/data/programs';

export interface ProgramCatalogEntry {
  programId: string;
  code?: string;
  name: string;
  campus?: string;
  track?: string;
  admissionMethods?: string[];
}

/**
 * Danh mục ngành RAW theo trường — leaf module CỐ TÌNH không import `schoolRegistry`
 * (`schools/index.ts`) dù `universityCatalog.ts` cần cả 2. `programSelectionStorage.ts` được
 * `HcmusPage.tsx` import, mà `HcmusPage.tsx` lại nằm trong chain khởi tạo `schoolRegistry`
 * (`schools/index.ts` → `schools/hcmus/index.ts` → `HcmusPage.tsx`) — nếu module này (hoặc bất kỳ
 * thứ gì nó export) import `schoolRegistry` ngược lại, tạo circular import thật (`schoolRegistry`
 * đọc được `undefined` lúc `universityCatalog.ts` chạy `Object.values`). Giữ file này KHÔNG phụ
 * thuộc `schools/index.ts` để cắt đứt cycle — `universityCatalog.ts` (cần schoolRegistry cho tên/
 * capability trường) và `programSelectionStorage.ts` (không cần) đều import từ đây.
 */
export const programCatalogBySchool: Record<string, ProgramCatalogEntry[]> = {
  hcmut: hcmutPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, track: program.group })),
  ueh: uehPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, campus: program.campus })),
  uel: uelPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name, track: program.group })),
  uit: uitPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  hcmus: hcmusProgramThresholds.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  ussh: usshPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  uhs: UHS_PROGRAMS.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  iu: iuPrograms.map((program) => ({ programId: program.id, code: program.code, name: program.name })),
  agu: AGU_PROGRAM_THRESHOLDS_2026.map((program) => ({ programId: program.programCode, code: program.programCode, name: program.name })),
  hcmue: hcmueProgramThresholds.map((program) => ({
    programId: program.id,
    code: program.code,
    name: program.name,
    campus: program.campus,
    track: program.group,
  })),
};

export function getProgramCatalogEntry(schoolId: string, programId: string | undefined): ProgramCatalogEntry | undefined {
  if (!programId) return undefined;
  return programCatalogBySchool[schoolId]?.find((program) => program.programId === programId);
}
