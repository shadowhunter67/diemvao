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
  /**
   * Metadata GENERIC cần thiết để so sánh/lọc cutoff đúng ngữ cảnh — KHÔNG phải kết quả business,
   * chỉ carry identity mà downstream (`compare/`) cần để chọn đúng `ComparableCutoffRecord`.
   * `applicantTypeId` dùng chung type (`string`) với `ComparableCutoffRecord.applicantTypeId`/
   * `findCutoffComparison({ selection: { applicantTypeId } })` (`core/cutoffComparison.ts`) — cùng
   * 1 khái niệm "đối tượng xét tuyển" mà 1 số trường (hiện tại: USSH) phân loại ứng viên theo, nên
   * đặt ở đây thay vì field USSH-specific narrow-typed (`'DT1'|'DT2'|'DT3'`) để core KHÔNG phải
   * import type riêng của `schools/ussh`. Trường nào không phân loại theo đối tượng thì bỏ trống —
   * KHÔNG bắt buộc evaluator nào phải set field này.
   *
   * Thêm ở batch loại bỏ "classify bằng parse human-readable text": trước đây
   * `schools/ussh/comparison.ts` suy `applicantTypeId` bằng regex trên
   * `explanation[].label` (`/\((DT[123])\)/`) — đổi wording UI vô tình sẽ làm gãy cutoff matching.
   * Giờ evaluator (nơi đã biết rule) set field này trực tiếp, label chỉ còn là presentation.
   */
  comparisonContext?: {
    applicantTypeId?: string;
  };
}
