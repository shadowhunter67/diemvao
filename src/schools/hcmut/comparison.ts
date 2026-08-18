import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import { findCutoffComparison } from '../../core/cutoffComparison';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext, withProgramCutoffComparison } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { buildHcmutAdmissionInputResult, type HcmutMethodContext } from './applicantProfileAdapter';
import { evaluateHcmutAdmission } from './evaluate';
import { hcmutAdmissionMethods } from './methods';
import { hcmutCutoffs } from './data/cutoffs';

export interface HcmutComparisonContext {
  methodContext?: HcmutMethodContext;
  selectedProgramId?: string;
}

function unavailableEvaluation(input: { missingInputs: string[]; missingRequirements: MissingRequirement[] }): AdmissionEvaluation {
  const method = hcmutAdmissionMethods[0];
  return {
    schoolId: 'hcmut',
    year: method.year,
    methodId: method.id,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: ['Chưa đủ dữ liệu hoặc ngữ cảnh để đánh giá.'] },
    missingInputs: input.missingInputs,
    missingRules: [],
    missingRequirements: input.missingRequirements,
    explanation: [],
    evidence: [],
  };
}

function buildContext(selection: Omit<ComparisonSelection, 'id'>): HcmutComparisonContext {
  const subjectContext = getSubjectContext(selection.context?.combinationId);
  return {
    selectedProgramId: selection.programId,
    methodContext:
      subjectContext && selection.context?.hcmutBonus
        ? {
            combination: { id: subjectContext.combinationId, subjects: subjectContext.subjects },
            bonus: {
              reward: selection.context.hcmutBonus.reward,
              considerationReward: selection.context.hcmutBonus.considerationReward,
              encouragement: selection.context.hcmutBonus.encouragement,
            },
            priorityRaw30Scale: selection.context.hcmutBonus.priorityRaw30Scale,
          }
        : undefined,
  };
}

export const hcmutComparisonAdapter: SchoolComparisonAdapter<HcmutComparisonContext> = {
  schoolId: 'hcmut',
  methodId: hcmutAdmissionMethods[0].id,
  methodName: hcmutAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    const method = hcmutAdmissionMethods[0];
    let evaluation: AdmissionEvaluation;
    if (!context.methodContext) {
      const label = 'Cần chọn tổ hợp, điểm cộng và điểm ưu tiên theo ngữ cảnh HCMUT.';
      evaluation = unavailableEvaluation({
        missingInputs: [label],
        missingRequirements: [{ kind: 'school-context', code: 'hcmut-context', label }],
      });
    } else {
      try {
        const result = buildHcmutAdmissionInputResult(profile, context.methodContext);
        evaluation = result.ok
          ? evaluateHcmutAdmission(result.input)
          : unavailableEvaluation({ missingInputs: [result.requirement.label], missingRequirements: [result.requirement] });
      } catch (error) {
        /** `buildHcmutAdmissionInputResult` chỉ re-throw lỗi THẬT SỰ ngoài dự kiến (mọi trường
         * hợp "user chưa nhập đủ dữ liệu" đã biết đều trả `{ ok: false, requirement }`, không
         * throw nữa) — KHÔNG đoán/phân loại theo nội dung message (bug cũ:
         * `classifyHcmutMissingInput` substring-match), gắn thẳng `kind: 'unsupported'` trung
         * thực thay vì giả làm 1 trong các missing-requirement cụ thể (dgnl/thpt/transcript). */
        const label = error instanceof Error ? error.message : 'Lỗi không xác định khi build input HCMUT từ hồ sơ.';
        evaluation = unavailableEvaluation({
          missingInputs: [label],
          missingRequirements: [{ kind: 'unsupported', code: 'hcmut-unexpected-error', label }],
        });
      }
    }

    return withProgramCutoffComparison({
      evaluation,
      selectedProgramId: context.selectedProgramId,
      missingProgramLabel: 'Chọn ngành HCMUT để so với đúng mốc điểm chuẩn.',
      getCutoffComparison: () => {
        if (!evaluation.score || !context.selectedProgramId) return undefined;
        const records = hcmutCutoffs
          .filter((cutoff) => cutoff.programId === context.selectedProgramId && cutoff.method === 'combined')
          .map((cutoff) => ({ ...cutoff, scoreScale: 100 }));
        return findCutoffComparison({
          records,
          targetYear: method.year,
          applicantScore: evaluation.score.value,
          applicantScale: evaluation.score.scale,
          selection: { programId: context.selectedProgramId, methodId: 'combined' },
        });
      },
    });
  },
};
