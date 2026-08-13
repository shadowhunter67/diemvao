import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UelSubjectContext } from './applicantProfileAdapter';
import { buildUelEvaluationInput } from './applicantProfileAdapter';
import { convertDgnlToScale100 } from './dgnlConversion';
import { checkThptThreshold } from './eligibility';
import { uelAdmissionMethods } from './methods';
import { uelKnowledgeGaps } from './knowledgeGaps';

export interface UelEvaluationContext {
  subjectContext?: UelSubjectContext;
}

export function evaluateUelAdmission(profile: ApplicantProfile, context: UelEvaluationContext = {}): AdmissionEvaluation {
  const input = buildUelEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (input.dgnlScore !== undefined) {
    const converted = convertDgnlToScale100(input.dgnlScore);
    explanation.push({
      id: 'uel-dgnl-scale-100',
      label: 'Quy đổi ĐGNL-HCM sang thang 100',
      inputs: { dgnlRaw: input.dgnlScore },
      output: converted ?? undefined,
      scale: 100,
      formula: 'Điểm bài thi ĐGNL × 100/1200',
    });
  } else {
    const label = 'Điểm ĐGNL ĐHQG-HCM nếu xét theo đối tượng có ĐGNL.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'uel-dgnl', label });
  }

  if (context.subjectContext && input.thptRawTotal30 !== undefined) {
    const normalized = (input.thptRawTotal30 * 100) / 30;
    const threshold = checkThptThreshold(input.thptRawTotal30);
    explanation.push({
      id: 'uel-thpt-scale-100',
      label: `THPT ${context.subjectContext.combinationId ?? 'theo tổ hợp'} quy đổi thang 100`,
      inputs: { thptTotal30: input.thptRawTotal30 },
      output: normalized,
      scale: 100,
      formula: 'Tổng điểm 3 môn tổ hợp × 100/30',
      description: `${threshold.requiredText}${threshold.pass ? ' - đạt' : ' - chưa đạt'}.`,
    });
  } else if (context.subjectContext) {
    const label = 'Chưa đủ 3 môn THPT trong tổ hợp đã chọn.';
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => input.thptSubjectScores?.[subjectId] === undefined);
    missingInputs.push(label);
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `uel-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp ${context.subjectContext?.combinationId ?? 'đã chọn'}.`,
      }))
    );
  } else {
    const label = 'Chưa chọn tổ hợp THPT để UEL đọc đúng các môn từ hồ sơ.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'school-context', code: 'uel-subject-combination', label });
  }

  missingRequirements.push(
    ...uelKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  return {
    schoolId: 'uel',
    year: uelAdmissionMethods[0].year,
    methodId: uelAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility:
      context.subjectContext && input.thptRawTotal30 !== undefined
        ? {
            status: checkThptThreshold(input.thptRawTotal30).pass ? 'eligible' : 'ineligible',
            reasons: [checkThptThreshold(input.thptRawTotal30).requiredText],
          }
        : { status: 'unknown', reasons: ['Cần đủ tổng 3 môn THPT theo tổ hợp để kiểm tra ngưỡng đầu vào.'] },
    missingInputs,
    missingRules: uelKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: [
      {
        sourceId: 'uel-formula-2026',
        sourceUrl: 'https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/',
        sourceTitle: 'Thông tin tuyển sinh đại học chính quy 2026 - UEL',
        location: 'Công thức xét tuyển tổng hợp và ghi chú X/Y/Z',
        verification: 'verified',
        effectiveYear: 2026,
        verifiedAt: '2026-08-13',
      },
    ],
  };
}
