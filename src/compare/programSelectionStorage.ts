import { getSchoolStorageKey } from '../core/storage';
import { getProgramCatalogEntry } from './programCatalog';
import { schoolComparisonAdapters } from './comparisonRegistry';

/**
 * Validity của 1 `programId` giờ tra thẳng `programCatalog.ts` (nguồn sự thật DUY NHẤT cho danh
 * mục ngành mọi trường, dùng chung với `universityCatalog.ts`) thay vì tự giữ 1
 * `Record<string, Set<string>>` import riêng rẽ từng trường — trước refactor map đó thiếu
 * `agu`/`hcmue` (bất kỳ `programId` hợp lệ nào đã lưu cho 2 trường này đều bị coi là invalid, âm
 * thầm rơi mất). Trường mới thêm vào `programCatalog.programCatalogBySchool` tự động được validate
 * ở đây, không cần sửa file này. Import `programCatalog.ts` (KHÔNG phải `universityCatalog.ts`) có
 * chủ đích — `universityCatalog.ts` phụ thuộc `schoolRegistry`, và `HcmusPage.tsx` (import module
 * này) nằm trong chính chain khởi tạo `schoolRegistry`; import `universityCatalog.ts` ở đây tạo
 * circular import thật (đã tự phát hiện qua test suite khi thử).
 */
function isKnownProgramId(schoolId: string, programId: string): boolean {
  return getProgramCatalogEntry(schoolId, programId) !== undefined;
}

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
    return programId && isKnownProgramId(schoolId, programId) ? programId : undefined;
  } catch {
    return undefined;
  }
}

export function loadStoredProgramId(schoolId: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return parseStoredProgramId(schoolId, localStorage.getItem(getProgramStorageKey(schoolId)));
}

/** Đọc program đã lưu cho MỌI trường có comparison adapter (tự theo `comparisonRegistry` — trước
 * refactor đây là danh sách 7 trường khai tay, cũng thiếu `agu`/`hcmue`). Giữ nguyên shape cũ: mỗi
 * schoolId luôn có key trong object trả về, value `undefined` nếu chưa lưu gì. */
export function loadStoredProgramSelections(): Partial<Record<string, string>> {
  return Object.fromEntries(schoolComparisonAdapters.map((adapter) => [adapter.schoolId, loadStoredProgramId(adapter.schoolId)]));
}

export function saveStoredProgramId(schoolId: string, programId: string): void {
  if (typeof window === 'undefined') return;
  const key = getProgramStorageKey(schoolId);
  if (!isKnownProgramId(schoolId, programId)) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify({ selectedProgramId: programId }));
}
