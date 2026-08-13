import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UhsSubjectContext } from './applicantProfileAdapter';
import { buildUhsEvaluationInput } from './applicantProfileAdapter';
import { checkUhsMedicinePharmacyThreshold } from './eligibility';
import { uhsAdmissionMethods } from './methods';
import { uhsKnowledgeGaps } from './knowledgeGaps';
import { uhsThresholdEvidence } from './evidence';

export interface UhsEvaluationContext {
  subjectContext?: UhsSubjectContext;
  program?: 'medicine' | 'pharmacy';
}

/** Chỉ Y khoa/Dược có ngưỡng số cụ thể (`checkUhsMedicinePharmacyThreshold`) — 3 ngành còn lại
 * trả `eligibility.status: 'unknown'` cố ý, KHÔNG dùng nhầm ngưỡng Y khoa/Dược. */
export function evaluateUhsAdmission(profile: ApplicantProfile, context: UhsEvaluationContext = {}): AdmissionEvaluation {
  const input = buildUhsEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  const canCheckThreshold = context.program === 'medicine' || context.program === 'pharmacy';

  if (!context.subjectContext) {
    missingInputs.push('Chưa chọn tổ hợp để kiểm tra ngưỡng đầu vào.');
    missingRequirements.push({ kind: 'school-context', code: 'uhs-subject-combination', label: 'Chọn tổ hợp.' });
  } else if (input.combinationTotal30 === undefined) {
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => profile.thpt?.scores?.[subjectId] === undefined);
    missingInputs.push('Chưa đủ điểm các môn trong tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `uhs-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]}.`,
      }))
    );
  }

  let eligibility: AdmissionEvaluation['eligibility'] = {
    status: 'unknown',
    reasons: ['Chỉ Y khoa/Dược có ngưỡng đầu vào cụ thể — chọn ngành và đủ điểm tổ hợp để kiểm tra.'],
  };

  if (canCheckThreshold && input.combinationTotal30 !== undefined && input.subjectScores) {
    const result = checkUhsMedicinePharmacyThreshold(input.combinationTotal30, input.subjectScores);
    eligibility = { status: result.pass ? 'eligible' : 'ineligible', reasons: [result.requiredText] };
    explanation.push({
      id: 'uhs-threshold',
      label: 'Ngưỡng đảm bảo chất lượng',
      inputs: { combinationTotal30: input.combinationTotal30 },
      formula: result.requiredText,
      evidence: uhsThresholdEvidence.evidence,
    });
  } else if (!canCheckThreshold && context.program) {
    missingRequirements.push({
      kind: 'official-rule',
      code: 'uhs-threshold-other-programs',
      label: `Ngành ${context.program} chưa có ngưỡng số cụ thể trong nguồn đã đọc.`,
    });
  }

  missingRequirements.push(
    ...uhsKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  return {
    schoolId: 'uhs',
    year: uhsAdmissionMethods[0].year,
    methodId: uhsAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility,
    missingInputs,
    missingRules: uhsKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: uhsThresholdEvidence.evidence,
  };
}
