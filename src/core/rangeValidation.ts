export interface FieldValidationResult {
  /** Value to use for calculation: 0 when empty/invalid, clamped when out of range. */
  value: number;
  error: string | null;
  isEmpty: boolean;
}

/** Validator số dùng chung cho mọi trường/module: rỗng → 0 không lỗi, ngoài [min, max] → clamp + báo lỗi. */
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
