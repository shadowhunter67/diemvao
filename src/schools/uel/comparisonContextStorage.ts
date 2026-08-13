import { COMMON_SUBJECT_COMBINATIONS } from '../../core/subjects';
import { getSchoolStorageKey } from '../../core/storage';

const UEL_SUBJECT_CONTEXT_STORAGE_KEY = getSchoolStorageKey('uel', 'subject-context', 1);

export function parseUelCombinationId(raw: string | null): string {
  if (raw === null) return '';
  try {
    const parsed = JSON.parse(raw) as unknown;
    const combinationId =
      typeof parsed === 'string'
        ? parsed
        : parsed && typeof parsed === 'object' && 'combinationId' in parsed && typeof parsed.combinationId === 'string'
          ? parsed.combinationId
          : '';
    return COMMON_SUBJECT_COMBINATIONS.some((combination) => combination.id === combinationId) ? combinationId : '';
  } catch {
    return '';
  }
}

export function loadStoredUelCombinationId(): string {
  if (typeof window === 'undefined') return '';
  return parseUelCombinationId(localStorage.getItem(UEL_SUBJECT_CONTEXT_STORAGE_KEY));
}

export function saveStoredUelCombinationId(combinationId: string): void {
  if (typeof window === 'undefined') return;
  if (!COMMON_SUBJECT_COMBINATIONS.some((combination) => combination.id === combinationId)) {
    localStorage.removeItem(UEL_SUBJECT_CONTEXT_STORAGE_KEY);
    return;
  }
  localStorage.setItem(UEL_SUBJECT_CONTEXT_STORAGE_KEY, JSON.stringify({ combinationId }));
}
