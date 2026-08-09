import type { AdmissionConfig } from '../types/admission';
import type { AdmissionFormState, TranscriptFormState } from '../types/form';
import {
  validateBonusComponent,
  validateDgnlComponent,
  validatePriorityRaw,
  validateTargetScore,
  validateThptSubject,
  validateTranscriptSubject,
} from './validation';

interface FormFieldSpec {
  key: string;
  get: (form: AdmissionFormState) => string;
  set: (form: AdmissionFormState, value: string) => AdmissionFormState;
  isValid: (raw: string, config: AdmissionConfig) => boolean;
}

function isValidNonEmpty(result: { error: string | null; isEmpty: boolean }): boolean {
  return result.error === null && !result.isEmpty;
}

function transcriptYearSpecs(grade: keyof TranscriptFormState, prefix: string): FormFieldSpec[] {
  return [
    {
      key: `${prefix}_m`,
      get: (f) => f.transcript[grade].math,
      set: (f, v) => ({ ...f, transcript: { ...f.transcript, [grade]: { ...f.transcript[grade], math: v } } }),
      isValid: (raw, config) => isValidNonEmpty(validateTranscriptSubject(raw, config)),
    },
    {
      key: `${prefix}_2`,
      get: (f) => f.transcript[grade].subject2,
      set: (f, v) => ({ ...f, transcript: { ...f.transcript, [grade]: { ...f.transcript[grade], subject2: v } } }),
      isValid: (raw, config) => isValidNonEmpty(validateTranscriptSubject(raw, config)),
    },
    {
      key: `${prefix}_3`,
      get: (f) => f.transcript[grade].subject3,
      set: (f, v) => ({ ...f, transcript: { ...f.transcript, [grade]: { ...f.transcript[grade], subject3: v } } }),
      isValid: (raw, config) => isValidNonEmpty(validateTranscriptSubject(raw, config)),
    },
  ];
}

const FORM_FIELD_SPECS: FormFieldSpec[] = [
  {
    key: 'dg_v',
    get: (f) => f.dgnl.vietnamese,
    set: (f, v) => ({ ...f, dgnl: { ...f.dgnl, vietnamese: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateDgnlComponent(raw, config)),
  },
  {
    key: 'dg_e',
    get: (f) => f.dgnl.english,
    set: (f, v) => ({ ...f, dgnl: { ...f.dgnl, english: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateDgnlComponent(raw, config)),
  },
  {
    key: 'dg_m',
    get: (f) => f.dgnl.math,
    set: (f, v) => ({ ...f, dgnl: { ...f.dgnl, math: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateDgnlComponent(raw, config)),
  },
  {
    key: 'dg_s',
    get: (f) => f.dgnl.scientificThinking,
    set: (f, v) => ({ ...f, dgnl: { ...f.dgnl, scientificThinking: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateDgnlComponent(raw, config)),
  },
  {
    key: 'th_m',
    get: (f) => f.thpt.math,
    set: (f, v) => ({ ...f, thpt: { ...f.thpt, math: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateThptSubject(raw, config)),
  },
  {
    key: 'th_2',
    get: (f) => f.thpt.subject2,
    set: (f, v) => ({ ...f, thpt: { ...f.thpt, subject2: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateThptSubject(raw, config)),
  },
  {
    key: 'th_3',
    get: (f) => f.thpt.subject3,
    set: (f, v) => ({ ...f, thpt: { ...f.thpt, subject3: v } }),
    isValid: (raw, config) => isValidNonEmpty(validateThptSubject(raw, config)),
  },
  ...transcriptYearSpecs('grade10', 'tr10'),
  ...transcriptYearSpecs('grade11', 'tr11'),
  ...transcriptYearSpecs('grade12', 'tr12'),
  {
    key: 'bn_r',
    get: (f) => f.bonus.reward,
    set: (f, v) => ({ ...f, bonus: { ...f.bonus, reward: v } }),
    isValid: (raw) => isValidNonEmpty(validateBonusComponent(raw)),
  },
  {
    key: 'bn_c',
    get: (f) => f.bonus.considerationReward,
    set: (f, v) => ({ ...f, bonus: { ...f.bonus, considerationReward: v } }),
    isValid: (raw) => isValidNonEmpty(validateBonusComponent(raw)),
  },
  {
    key: 'bn_k',
    get: (f) => f.bonus.encouragement,
    set: (f, v) => ({ ...f, bonus: { ...f.bonus, encouragement: v } }),
    isValid: (raw) => isValidNonEmpty(validateBonusComponent(raw)),
  },
  {
    key: 'pr',
    get: (f) => f.priorityRaw30Scale,
    set: (f, v) => ({ ...f, priorityRaw30Scale: v }),
    isValid: (raw, config) => isValidNonEmpty(validatePriorityRaw(raw, config)),
  },
];

const TARGET_KEY = 'tg';

/** Chỉ đưa vào URL các field có giá trị hợp lệ (không rỗng, không lỗi). */
export function serializeStateToSearchParams(
  form: AdmissionFormState,
  targetScore: string,
  config: AdmissionConfig
): URLSearchParams {
  const params = new URLSearchParams();

  for (const spec of FORM_FIELD_SPECS) {
    const raw = spec.get(form);
    if (spec.isValid(raw, config)) {
      params.set(spec.key, raw.trim());
    }
  }

  if (isValidNonEmpty(validateTargetScore(targetScore, config))) {
    params.set(TARGET_KEY, targetScore.trim());
  }

  return params;
}

export interface AppliedUrlState {
  formState: AdmissionFormState;
  /** true nếu có ít nhất một field form hợp lệ được đọc từ URL. */
  hasAnyField: boolean;
}

/**
 * Áp query params HỢP LỆ lên trên `base` (thường là state đã load từ localStorage), theo
 * đúng nguyên tắc "URL có precedence cao hơn localStorage": field nào URL cung cấp và hợp
 * lệ thì ghi đè, field còn lại giữ nguyên từ base. Field lỗi/thiếu bị bỏ qua thay vì crash.
 */
export function applySearchParamsToForm(
  base: AdmissionFormState,
  params: URLSearchParams,
  config: AdmissionConfig
): AppliedUrlState {
  let formState = base;
  let hasAnyField = false;

  for (const spec of FORM_FIELD_SPECS) {
    const raw = params.get(spec.key);
    if (raw !== null && spec.isValid(raw, config)) {
      formState = spec.set(formState, raw);
      hasAnyField = true;
    }
  }

  return { formState, hasAnyField };
}

/** Trả về giá trị mục tiêu hợp lệ từ URL, hoặc null nếu không có/không hợp lệ. */
export function parseTargetFromSearchParams(params: URLSearchParams, config: AdmissionConfig): string | null {
  const raw = params.get(TARGET_KEY);
  if (raw !== null && isValidNonEmpty(validateTargetScore(raw, config))) {
    return raw;
  }
  return null;
}
