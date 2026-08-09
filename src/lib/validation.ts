import type { AdmissionConfig } from '../types/admission';
import type { AdmissionFormState, BonusFormState, DgnlFormState, ThptFormState, TranscriptYearFormState } from '../types/form';

export interface FieldValidationResult {
  /** Value to use for calculation: 0 when empty/invalid, clamped when out of range. */
  value: number;
  error: string | null;
  isEmpty: boolean;
}

export function validateRange(raw: string, min: number, max: number | null): FieldValidationResult {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { value: 0, error: null, isEmpty: true };
  }

  const parsed = Number(trimmed);

  if (Number.isNaN(parsed)) {
    return { value: 0, error: 'Giá trị không hợp lệ', isEmpty: false };
  }
  if (parsed < min) {
    return { value: min, error: `Giá trị không được nhỏ hơn ${min}`, isEmpty: false };
  }
  if (max !== null && parsed > max) {
    return { value: max, error: `Giá trị không được lớn hơn ${max}`, isEmpty: false };
  }

  return { value: parsed, error: null, isEmpty: false };
}

export function validateDgnlComponent(raw: string, config: AdmissionConfig): FieldValidationResult {
  return validateRange(raw, 0, config.dgnl.maxPerComponent);
}

export function validateThptSubject(raw: string, config: AdmissionConfig): FieldValidationResult {
  return validateRange(raw, 0, config.thpt.maxPerSubject);
}

export function validateTranscriptSubject(raw: string, config: AdmissionConfig): FieldValidationResult {
  return validateRange(raw, 0, config.transcript.maxPerSubject);
}

export function validateBonusComponent(raw: string): FieldValidationResult {
  return validateRange(raw, 0, null);
}

export function validatePriorityRaw(raw: string, config: AdmissionConfig): FieldValidationResult {
  return validateRange(raw, 0, config.priority.maxRaw30Scale);
}

export interface AdmissionFormErrors {
  dgnl: Record<keyof DgnlFormState, FieldValidationResult>;
  thpt: Record<keyof ThptFormState, FieldValidationResult>;
  transcript: Record<'grade10' | 'grade11' | 'grade12', Record<keyof TranscriptYearFormState, FieldValidationResult>>;
  bonus: Record<keyof BonusFormState, FieldValidationResult>;
  priorityRaw30Scale: FieldValidationResult;
}

function validateTranscriptYear(
  year: TranscriptYearFormState,
  config: AdmissionConfig
): Record<keyof TranscriptYearFormState, FieldValidationResult> {
  return {
    math: validateTranscriptSubject(year.math, config),
    subject2: validateTranscriptSubject(year.subject2, config),
    subject3: validateTranscriptSubject(year.subject3, config),
  };
}

export function validateAdmissionForm(form: AdmissionFormState, config: AdmissionConfig): AdmissionFormErrors {
  return {
    dgnl: {
      vietnamese: validateDgnlComponent(form.dgnl.vietnamese, config),
      english: validateDgnlComponent(form.dgnl.english, config),
      math: validateDgnlComponent(form.dgnl.math, config),
      scientificThinking: validateDgnlComponent(form.dgnl.scientificThinking, config),
    },
    thpt: {
      math: validateThptSubject(form.thpt.math, config),
      subject2: validateThptSubject(form.thpt.subject2, config),
      subject3: validateThptSubject(form.thpt.subject3, config),
    },
    transcript: {
      grade10: validateTranscriptYear(form.transcript.grade10, config),
      grade11: validateTranscriptYear(form.transcript.grade11, config),
      grade12: validateTranscriptYear(form.transcript.grade12, config),
    },
    bonus: {
      reward: validateBonusComponent(form.bonus.reward),
      considerationReward: validateBonusComponent(form.bonus.considerationReward),
      encouragement: validateBonusComponent(form.bonus.encouragement),
    },
    priorityRaw30Scale: validatePriorityRaw(form.priorityRaw30Scale, config),
  };
}
