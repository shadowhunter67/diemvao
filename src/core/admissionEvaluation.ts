import type { CalculationStep } from './calculationStep';
import type { RuleEvidence } from './evidence';

/**
 * Mức độ tin cậy của MỘT kết quả đánh giá cụ thể (khác `VerificationLevel` — chất lượng của một
 * nguồn; khác `KnowledgeStatus` — vòng đời của một rule). Đây là kết luận cuối cùng UI nên dựa
 * vào để quyết định có hiển thị số điểm hay không.
 */
export type ResultConfidence = 'exact-verified' | 'exact-cross-checked' | 'partial' | 'unavailable';

export type MissingRequirementKind = 'profile-input' | 'school-context' | 'official-rule' | 'unsupported';

export interface MissingRequirementAction {
  href: string;
  label: string;
}

export interface MissingRequirement {
  kind: MissingRequirementKind;
  code: string;
  label: string;
  action?: MissingRequirementAction;
}

/**
 * Output contract dùng chung ở ranh giới domain/presentation — KHÔNG universalize input/công
 * thức (mỗi trường vẫn tự tính theo cách riêng, xem `schools/<id>/evaluate.ts`). Nguyên tắc bắt
 * buộc: `confidence: 'partial'`/`'unavailable'` thì `score` PHẢI để trống — không có "gần đúng"
 * cho điểm xét tuyển, chỉ có "biết" hoặc "chưa biết đủ để tính".
 */
export interface AdmissionEvaluation {
  schoolId: string;
  year: number;
  methodId: string;
  confidence: ResultConfidence;
  eligibility?: {
    status: 'eligible' | 'ineligible' | 'unknown';
    reasons: string[];
  };
  score?: {
    value: number;
    scale: number;
  };
  missingInputs: string[];
  missingRules: string[];
  missingRequirements?: MissingRequirement[];
  explanation: CalculationStep[];
  evidence: RuleEvidence[];
}
