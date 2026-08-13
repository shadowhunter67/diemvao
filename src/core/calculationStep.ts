import type { RuleEvidence } from './evidence';

/**
 * Một bước trong lời giải thích "tại sao ra điểm này" — sinh từ domain/adapter layer (đọc lại
 * kết quả tính đã có sẵn, KHÔNG tính lại công thức lần 2), để UI không tự viết công thức bằng
 * string riêng (dễ lệch khi công thức đổi mà quên sửa UI). Xem `schools/hcmut/evaluate.ts` cho
 * ví dụ implement thật.
 */
export interface CalculationStep {
  id: string;
  label: string;
  description?: string;
  inputs?: Record<string, number>;
  output?: number;
  scale?: number;
  formula?: string;
  evidence?: RuleEvidence[];
}
