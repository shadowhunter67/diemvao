import type { ApplicantProfile } from '../core/applicantProfile';
import type { AdmissionEvaluation, MissingRequirement } from '../core/admissionEvaluation';
import type { CutoffComparison } from '../core/cutoffComparison';
import { COMMON_SUBJECT_COMBINATIONS, type SubjectId } from '../core/subjects';
import { canCompareEvaluationToCutoff } from './cutoffEligibility';
import type { ComparisonSelection } from './comparisonSelection';

/**
 * Kết quả 1 lượt đánh giá school-specific — KHÔNG có schoolId/schoolName/shortName (orchestrator
 * generic tự lookup từ `schoolRegistry` bằng `adapter.schoolId`, không lặp lại ở đây).
 */
export interface SchoolComparisonResult {
  evaluation: AdmissionEvaluation;
  cutoffComparison?: CutoffComparison;
}

/**
 * Hợp đồng DUY NHẤT một trường phải implement để tham gia `/compare` (cả roster mặc định lẫn
 * selection-driven). Trước refactor này, `evaluateApplicantAcrossSchools.ts` có 1 chuỗi
 * `if (schoolId === 'x')` cho mỗi trường ở CẢ `evaluateComparisonSelections` LẪN danh sách mặc định
 * của `evaluateApplicantAcrossSchools()` — 2 nơi độc lập, dễ quên 1 (đúng bug đã xảy ra thật với
 * HCMUE: có module + có branch selection nhưng KHÔNG có trong roster mặc định, xem
 * `docs/architecture.md` Batch 16). Adapter này gộp 2 nơi thành 1: orchestration chỉ lặp qua
 * `comparisonAdapters` (`schools/index.ts`-style registry, xem `compare/comparisonRegistry.ts`).
 *
 * `TContext` CỐ TÌNH khác nhau theo từng trường (HCMUT có bonus/priority/combination, USSH có bonus
 * achievement, UIT chỉ có `programId`...) — KHÔNG ép về 1 universal input object. `evaluate()` dùng
 * method-signature syntax (không phải property kiểu arrow function) để TypeScript check tham số
 * bivariant — cho phép mảng `SchoolComparisonAdapter[]` (TContext xóa kiểu, mặc định `unknown`)
 * chứa các adapter với `TContext` cụ thể khác nhau mà không cần `any`/type-cast ở registry.
 */
export interface SchoolComparisonAdapter<TContext = unknown> {
  schoolId: string;
  /** methodId/methodName của phương thức chính dùng để so sánh — hôm nay mọi trường chỉ có 1
   * phương thức tham gia compare (`xAdmissionMethods[0]`), khớp `AdmissionMethodDescriptor.id`
   * tương ứng (invariant test `comparisonRegistry.test.ts` khóa việc này). */
  methodId: string;
  methodName: string;
  /** Map 1 `ComparisonSelection` generic (từ UI so sánh/share URL/localStorage) sang context
   * school-specific — đây là điểm DUY NHẤT trường "biết" cách đọc generic selection. */
  buildContext(selection: Omit<ComparisonSelection, 'id'>): TContext;
  /** Đánh giá — nhận context ĐÃ build (rich, school-specific), hoặc `{}` khi không có selection cụ
   * thể (roster mặc định `evaluateApplicantAcrossSchools()`). KHÔNG chứa công thức tính điểm —
   * công thức luôn nằm trong `schools/<id>/evaluate.ts`, adapter chỉ orchestrate + cutoff wiring. */
  evaluate(profile: ApplicantProfile, context: TContext): SchoolComparisonResult;
}

/** Dùng chung cho MỌI trường có `subjectContext` dạng tổ hợp môn phổ biến (hcmut/uel/hcmus/ussh/
 * uhs/iu/agu/hcmue) — tránh lặp lại logic tra `COMMON_SUBJECT_COMBINATIONS` ở từng adapter. */
export function getSubjectContext(combinationId: string | undefined): { combinationId: string; subjects: readonly SubjectId[] } | undefined {
  const combination = COMMON_SUBJECT_COMBINATIONS.find((item) => item.id === combinationId);
  return combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined;
}

/**
 * Helper dùng chung cho 5 trường có cutoff comparison thật (hcmut/ueh/uel/ussh/iu) — trước refactor
 * mỗi trường tự lặp lại gần y hệt: "chưa chọn ngành → thêm missingRequirement; đã chọn ngành + có
 * score → gọi findCutoffComparison". Business logic (records nào, extra selection dimension như
 * `applicantTypeId` của USSH) VẪN do trường tự quyết qua `getCutoffComparison` — helper chỉ gói lại
 * phần plumbing lặp lại (gate `canCompareEvaluationToCutoff` + thêm missingRequirement 'program').
 */
export function withProgramCutoffComparison(params: {
  evaluation: AdmissionEvaluation;
  selectedProgramId: string | undefined;
  missingProgramLabel: string;
  getCutoffComparison: () => CutoffComparison | undefined;
}): SchoolComparisonResult {
  const { evaluation, selectedProgramId, missingProgramLabel, getCutoffComparison } = params;
  if (!canCompareEvaluationToCutoff(evaluation)) return { evaluation };

  if (!selectedProgramId) {
    const missingRequirement: MissingRequirement = { kind: 'school-context', code: 'program', label: missingProgramLabel };
    return { evaluation: { ...evaluation, missingRequirements: [...(evaluation.missingRequirements ?? []), missingRequirement] } };
  }

  if (!evaluation.score) return { evaluation };

  return { evaluation, cutoffComparison: getCutoffComparison() };
}
