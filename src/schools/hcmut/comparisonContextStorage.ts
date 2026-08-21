import { COMMON_SUBJECT_COMBINATIONS } from '../../core/subjects';
import { getSchoolStorageKey } from '../../core/storage';
import { safeGetItem } from '../../core/safeStorage';
import type { HcmutMethodContext } from './applicantProfileAdapter';

const FORM_STORAGE_KEY = getSchoolStorageKey('hcmut', 'input', 1);
const SUBJECT_CONTEXT_STORAGE_KEY = getSchoolStorageKey('hcmut', 'subject-context', 1);

function parseNumberLike(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function loadStoredHcmutMethodContext(): HcmutMethodContext | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const subjectContext = JSON.parse(safeGetItem(SUBJECT_CONTEXT_STORAGE_KEY) ?? '{}') as {
      subject2?: unknown;
      subject3?: unknown;
    };
    const combination = COMMON_SUBJECT_COMBINATIONS.find(
      (candidate) =>
        candidate.subjects[0] === 'math' &&
        candidate.subjects[1] === subjectContext.subject2 &&
        candidate.subjects[2] === subjectContext.subject3
    );
    const form = JSON.parse(safeGetItem(FORM_STORAGE_KEY) ?? '{}') as {
      bonus?: { reward?: unknown; considerationReward?: unknown; encouragement?: unknown };
      priorityRaw30Scale?: unknown;
    };
    const reward = parseNumberLike(form.bonus?.reward);
    const considerationReward = parseNumberLike(form.bonus?.considerationReward);
    const encouragement = parseNumberLike(form.bonus?.encouragement);
    const priorityRaw30Scale = parseNumberLike(form.priorityRaw30Scale);
    if (!combination || reward === undefined || considerationReward === undefined || encouragement === undefined || priorityRaw30Scale === undefined) {
      return undefined;
    }
    return { combination, bonus: { reward, considerationReward, encouragement }, priorityRaw30Scale };
  } catch {
    return undefined;
  }
}
