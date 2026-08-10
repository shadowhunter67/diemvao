import type { AdmissionConfig } from './types/admission';
import type { AdmissionFormState, TranscriptFormState } from './types/form';
import type { HcmutProgram } from './types/programs';
import { HCMUT_APPLICANT_TYPES, DEFAULT_APPLICANT_TYPE, type HcmutApplicantType } from './types/applicantType';
import { BUFFER_OPTIONS } from './programs';
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

const PROGRAM_KEY = 'program';
const BUFFER_KEY = 'buffer';
const COMPARE_KEY = 'compare';
const MAX_COMPARE_FROM_URL = 3;

export interface ProgramUrlState {
  programId: string | null;
  buffer: number;
  comparisonProgramIds: string[];
}

/** Ghi program/buffer/compare hợp lệ vào params đã có sẵn (dùng chung với serializeStateToSearchParams). */
export function serializeProgramStateToSearchParams(
  params: URLSearchParams,
  state: ProgramUrlState,
  programs: HcmutProgram[]
): void {
  if (state.programId && programs.some((program) => program.id === state.programId)) {
    params.set(PROGRAM_KEY, state.programId);
  }

  if (BUFFER_OPTIONS.includes(state.buffer as (typeof BUFFER_OPTIONS)[number]) && state.buffer > 0) {
    params.set(BUFFER_KEY, String(state.buffer));
  }

  const validComparisonIds = state.comparisonProgramIds
    .filter((id) => programs.some((program) => program.id === id))
    .slice(0, MAX_COMPARE_FROM_URL);
  if (validComparisonIds.length > 0) {
    params.set(COMPARE_KEY, validComparisonIds.join(','));
  }
}

/**
 * Đọc program/buffer/compare từ URL. Program id không tồn tại trong dataset bị bỏ qua (không
 * crash); buffer ngoài danh sách BUFFER_OPTIONS hợp lệ về 0; compare chỉ giữ id hợp lệ, tối đa
 * 3, loại trùng.
 */
export function parseProgramStateFromSearchParams(params: URLSearchParams, programs: HcmutProgram[]): ProgramUrlState {
  const rawProgram = params.get(PROGRAM_KEY);
  const programId = rawProgram !== null && programs.some((program) => program.id === rawProgram) ? rawProgram : null;

  const rawBuffer = params.get(BUFFER_KEY);
  const parsedBuffer = rawBuffer !== null ? Number(rawBuffer) : NaN;
  const buffer = BUFFER_OPTIONS.includes(parsedBuffer as (typeof BUFFER_OPTIONS)[number]) ? parsedBuffer : 0;

  const rawCompare = params.get(COMPARE_KEY);
  const comparisonProgramIds: string[] = [];
  if (rawCompare !== null) {
    for (const id of rawCompare.split(',')) {
      if (programs.some((program) => program.id === id) && !comparisonProgramIds.includes(id)) {
        comparisonProgramIds.push(id);
      }
      if (comparisonProgramIds.length >= MAX_COMPARE_FROM_URL) break;
    }
  }

  return { programId, buffer, comparisonProgramIds };
}

const APPLICANT_TYPE_KEY = 'at';

/** Chỉ ghi vào URL khi khác mặc định (dgnl) — link cũ (không có "at") vẫn hiểu đúng là dgnl. */
export function serializeApplicantTypeToSearchParams(params: URLSearchParams, applicantType: HcmutApplicantType): void {
  if (applicantType !== DEFAULT_APPLICANT_TYPE) {
    params.set(APPLICANT_TYPE_KEY, applicantType);
  }
}

/** Giá trị "at" không hợp lệ/không có trong URL đều fallback về DEFAULT_APPLICANT_TYPE (dgnl). */
export function parseApplicantTypeFromSearchParams(params: URLSearchParams): HcmutApplicantType {
  const raw = params.get(APPLICANT_TYPE_KEY);
  const found = HCMUT_APPLICANT_TYPES.find((type) => type === raw);
  return found ?? DEFAULT_APPLICANT_TYPE;
}
