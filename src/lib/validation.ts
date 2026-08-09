import type { AdmissionConfig, ScoreFieldKey } from '../types/admission';

export interface FieldRange {
  min: number;
  max: number;
}

export function getFieldRange(key: ScoreFieldKey, config: AdmissionConfig): FieldRange {
  switch (key) {
    case 'dgnl':
    case 'thpt':
    case 'transcript':
      return { min: 0, max: 100 };
    case 'bonus':
      return { min: 0, max: config.maxBonus };
    case 'priority':
      return { min: 0, max: config.maxPriority };
  }
}

export interface FieldValidationResult {
  /** Value to use for calculation: 0 when empty/invalid, clamped when out of range. */
  value: number;
  error: string | null;
  isEmpty: boolean;
}

export function validateScoreField(
  raw: string,
  key: ScoreFieldKey,
  config: AdmissionConfig
): FieldValidationResult {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { value: 0, error: null, isEmpty: true };
  }

  const parsed = Number(trimmed);
  const { min, max } = getFieldRange(key, config);

  if (Number.isNaN(parsed)) {
    return { value: 0, error: 'Giá trị không hợp lệ', isEmpty: false };
  }
  if (parsed < min) {
    return { value: min, error: `Giá trị không được nhỏ hơn ${min}`, isEmpty: false };
  }
  if (parsed > max) {
    return { value: max, error: `Giá trị không được lớn hơn ${max}`, isEmpty: false };
  }

  return { value: parsed, error: null, isEmpty: false };
}
