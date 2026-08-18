import type { ApplicantProfile } from '../core/applicantProfile';
import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import type { CutoffComparison } from '../core/cutoffComparison';
import type { ComparisonSelection } from './comparisonSelection';
import { schoolRegistry } from '../schools';
import { schoolComparisonAdapters, schoolComparisonAdapterRegistry, COMPARE_SCHOOL_ORDER } from './comparisonRegistry';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from './schoolComparisonAdapter';
import type { HcmutComparisonContext } from '../schools/hcmut/comparison';
import type { UehComparisonContext } from '../schools/ueh/comparison';
import type { UelComparisonContext } from '../schools/uel/comparison';
import type { UitEvaluationContext } from '../schools/uit/evaluate';
import type { HcmusEvaluationContext } from '../schools/hcmus/evaluate';
import type { UsshComparisonContext } from '../schools/ussh/comparison';
import type { UhsEvaluationContext } from '../schools/uhs/evaluate';
import type { IuEvaluationContext } from '../schools/iu/evaluate';
import type { AguEvaluationContext } from '../schools/agu/evaluate';
import type { HcmueEvaluationContext } from '../schools/hcmue/evaluate';

export interface SchoolEvaluationSummary {
  selectionId?: string;
  schoolId: string;
  schoolName: string;
  shortName: string;
  methodId: string;
  methodName: string;
  evaluation: AdmissionEvaluation;
  cutoffComparison?: CutoffComparison;
}

export { COMPARE_SCHOOL_ORDER };

/**
 * Context riêng từng trường khi gọi `evaluateApplicantAcrossSchools()` trực tiếp (không qua
 * `ComparisonSelection`) — dùng bởi test parity/fixture cần dựng context đầy đủ 1 lượt cho nhiều
 * trường. Field key PHẢI khớp `schoolId` tương ứng trong `comparisonRegistry.ts` (khóa bởi
 * `comparisonRegistry.test.ts`, không khóa được ở compile-time vì đây là object type rời rạc theo
 * từng trường — cố tình KHÔNG universal hóa thành 1 context chung).
 */
export interface MultiSchoolEvaluationContext {
  hcmut?: HcmutComparisonContext;
  ueh?: UehComparisonContext;
  uel?: UelComparisonContext;
  uit?: UitEvaluationContext & { selectedProgramId?: string };
  hcmus?: HcmusEvaluationContext;
  ussh?: UsshComparisonContext;
  uhs?: UhsEvaluationContext;
  iu?: IuEvaluationContext;
  agu?: AguEvaluationContext;
  hcmue?: HcmueEvaluationContext;
}

function summarize(adapter: SchoolComparisonAdapter, result: SchoolComparisonResult): SchoolEvaluationSummary {
  const school = schoolRegistry[adapter.schoolId];
  return {
    schoolId: adapter.schoolId,
    schoolName: school.name,
    shortName: school.shortName,
    methodId: adapter.methodId,
    methodName: adapter.methodName,
    evaluation: result.evaluation,
    cutoffComparison: result.cutoffComparison,
  };
}

function withSelection(summary: SchoolEvaluationSummary, selectionId: string): SchoolEvaluationSummary {
  return { ...summary, selectionId };
}

/**
 * Roster mặc định `/compare` — orchestration pure, KHÔNG chứa công thức trường nào. Lặp qua đúng
 * `schoolComparisonAdapters` (1 nguồn sự thật duy nhất, xem `comparisonRegistry.ts`) — thêm/xóa
 * trường khỏi compare chỉ cần sửa registry, không sửa file này.
 */
export function evaluateApplicantAcrossSchools(
  profile: ApplicantProfile,
  contexts: MultiSchoolEvaluationContext = {}
): SchoolEvaluationSummary[] {
  const contextsByschoolId = contexts as Record<string, unknown>;
  return schoolComparisonAdapters.map((adapter) =>
    summarize(adapter, adapter.evaluate(profile, contextsByschoolId[adapter.schoolId] ?? {}))
  );
}

/**
 * Orchestration cho `/compare` selection-based (UI thật, share URL, localStorage) — mỗi trường tự
 * biết cách đọc 1 `ComparisonSelection` generic qua `adapter.buildContext`, KHÔNG còn chuỗi
 * `if (selection.schoolId === 'x')` nào ở đây. Unknown `schoolId` (chưa có adapter đăng ký, hoặc
 * dữ liệu cũ tham chiếu trường đã gỡ) bị bỏ qua an toàn — không crash.
 */
export function evaluateComparisonSelections(profile: ApplicantProfile, selections: readonly ComparisonSelection[]): SchoolEvaluationSummary[] {
  return selections.flatMap((selection) => {
    const adapter = schoolComparisonAdapterRegistry[selection.schoolId];
    if (!adapter) return [];
    const context = adapter.buildContext(selection);
    const result = adapter.evaluate(profile, context);
    return [withSelection(summarize(adapter, result), selection.id)];
  });
}
