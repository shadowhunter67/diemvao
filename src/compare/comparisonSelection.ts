import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { safeGetItem, safeSetItem } from '../core/safeStorage';

export interface SchoolComparisonContext {
  combinationId?: string;
  hcmutBonus?: {
    reward: number;
    considerationReward: number;
    encouragement: number;
    priorityRaw30Scale: number;
  };
  hasUsshBonusAchievement?: boolean;
}

export interface ComparisonSelection {
  id: string;
  schoolId: string;
  programId?: string;
  methodId?: string;
  context?: SchoolComparisonContext;
}

export const COMPARE_SELECTION_STORAGE_KEY = 'uniscorevn:compare-selections:v1';
export const COMPARE_SELECTION_SOFT_LIMIT = 6;
export const COMPARE_SELECTION_HARD_LIMIT = 10;

export function normalizeVietnameseText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .toLowerCase()
    .trim();
}

function stableContextSignature(context?: SchoolComparisonContext): string {
  if (!context) return '';
  return JSON.stringify({
    combinationId: context.combinationId,
    hcmutBonus: context.hcmutBonus,
    hasUsshBonusAchievement: context.hasUsshBonusAchievement === true,
  });
}

export function getComparisonSelectionSignature(selection: Omit<ComparisonSelection, 'id'>): string {
  return [selection.schoolId, selection.programId ?? '', selection.methodId ?? '', stableContextSignature(selection.context)].join('|');
}

export function isDuplicateComparisonSelection(
  selections: readonly ComparisonSelection[],
  candidate: Omit<ComparisonSelection, 'id'>,
  ignoredSelectionId?: string
): boolean {
  const candidateSignature = getComparisonSelectionSignature(candidate);
  return selections.some((selection) => selection.id !== ignoredSelectionId && getComparisonSelectionSignature(selection) === candidateSignature);
}

export function addComparisonSelection(
  selections: readonly ComparisonSelection[],
  selection: Omit<ComparisonSelection, 'id'>,
  id: string
): ComparisonSelection[] {
  if (selections.length >= COMPARE_SELECTION_HARD_LIMIT) return [...selections];
  if (isDuplicateComparisonSelection(selections, selection)) return [...selections];
  return [...selections, { ...selection, id }];
}

export function removeComparisonSelection(selections: readonly ComparisonSelection[], selectionId: string): ComparisonSelection[] {
  return selections.filter((selection) => selection.id !== selectionId);
}

export function updateComparisonSelection(
  selections: readonly ComparisonSelection[],
  selectionId: string,
  nextSelection: Omit<ComparisonSelection, 'id'>
): ComparisonSelection[] {
  if (isDuplicateComparisonSelection(selections, nextSelection, selectionId)) return [...selections];
  return selections.map((selection) => (selection.id === selectionId ? { ...nextSelection, id: selectionId } : selection));
}

export function moveComparisonSelection(selections: readonly ComparisonSelection[], selectionId: string, direction: 'up' | 'down'): ComparisonSelection[] {
  const index = selections.findIndex((selection) => selection.id === selectionId);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= selections.length) return [...selections];
  const next = [...selections];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * `undefined`/absence: valid (context là optional field). `null`/string/number/boolean/array: KHÔNG
 * valid — trước đây `!value || typeof value !== 'object'` coi luôn mọi primitive là "valid" (bug:
 * `"hello"`/`123` lọt qua như context hợp lệ). Object đúng shape: valid, kèm validate numeric field
 * là finite number và đúng range đã biết (`hcmutBonus.*` domain min 0, cùng range với
 * `validateBonusComponent`/`validatePriorityRaw` ở `schools/hcmut/validation.ts` — không có upper
 * bound cố định ở đây vì bound phụ thuộc `AdmissionConfig` theo năm, context này không giữ config).
 */
function isValidContext(value: unknown): value is SchoolComparisonContext {
  if (value === undefined) return true;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;

  const context = value as SchoolComparisonContext;
  if (context.combinationId !== undefined) {
    if (typeof context.combinationId !== 'string') return false;
    if (!COMMON_SUBJECT_COMBINATIONS.some((combination) => combination.id === context.combinationId)) return false;
  }
  if (context.hasUsshBonusAchievement !== undefined && typeof context.hasUsshBonusAchievement !== 'boolean') return false;
  if (context.hcmutBonus !== undefined) {
    const bonus = context.hcmutBonus;
    if (typeof bonus !== 'object' || bonus === null || Array.isArray(bonus)) return false;
    if (
      !isFiniteNonNegativeNumber(bonus.reward) ||
      !isFiniteNonNegativeNumber(bonus.considerationReward) ||
      !isFiniteNonNegativeNumber(bonus.encouragement) ||
      !isFiniteNonNegativeNumber(bonus.priorityRaw30Scale)
    ) {
      return false;
    }
  }
  return true;
}

export function parseStoredComparisonSelections(raw: string | null): ComparisonSelection[] {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is ComparisonSelection => {
        if (!item || typeof item !== 'object') return false;
        const selection = item as ComparisonSelection;
        return typeof selection.id === 'string' && typeof selection.schoolId === 'string' && isValidContext(selection.context);
      })
      .slice(0, COMPARE_SELECTION_HARD_LIMIT);
  } catch {
    return [];
  }
}

export function loadStoredComparisonSelections(): ComparisonSelection[] {
  return parseStoredComparisonSelections(safeGetItem(COMPARE_SELECTION_STORAGE_KEY));
}

export function saveStoredComparisonSelections(selections: readonly ComparisonSelection[]): void {
  safeSetItem(COMPARE_SELECTION_STORAGE_KEY, JSON.stringify(selections.slice(0, COMPARE_SELECTION_HARD_LIMIT)));
}

export function encodeComparisonSelectionsForUrl(selections: readonly ComparisonSelection[]): string {
  return encodeURIComponent(
    JSON.stringify(
      selections.map((selection) => ({
        schoolId: selection.schoolId,
        programId: selection.programId,
        methodId: selection.methodId,
        context: selection.context,
      }))
    )
  );
}

export function parseComparisonSelectionsFromUrl(raw: string | null): ComparisonSelection[] {
  if (!raw) return [];
  try {
    return parseStoredComparisonSelections(
      JSON.stringify(
        (JSON.parse(decodeURIComponent(raw)) as Omit<ComparisonSelection, 'id'>[]).map((selection, index) => ({
          ...selection,
          id: `share-${index + 1}`,
        }))
      )
    );
  } catch {
    return [];
  }
}
