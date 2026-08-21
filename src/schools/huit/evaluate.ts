import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { huitAdmissionMethods } from './methods';
import { huitKnowledgeGaps } from './knowledgeGaps';
import { checkHuitThptExamThreshold, checkHuitTranscriptThreshold, type HuitThresholdGroup } from './eligibility';

export interface HuitSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function sumSubjectTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; missingSubjects: SubjectId[] } {
  let total = 0;
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else total += score;
  }
  if (missingSubjects.length > 0) return { missingSubjects };
  return { total30: Math.round(total * 100) / 100, missingSubjects };
}

export interface HuitThptExamEvaluationContext {
  thresholdGroup?: HuitThresholdGroup;
  subjectContext?: HuitSubjectContext;
}

/** Phương thức 1: Xét kết quả thi TN THPT 2026. */
export function evaluateHuitThptExamAdmission(profile: ApplicantProfile, context: HuitThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = huitAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HuitThresholdGroup = context.thresholdGroup ?? 'standard';

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `huit-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HUIT.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'huit-subject-combination', label: 'Chọn tổ hợp môn xét tuyển HUIT.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (total30 !== undefined) {
    const result = checkHuitThptExamThreshold(total30, group);
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({ id: 'huit-thpt-exam-threshold', label: 'Ngưỡng đảm bảo chất lượng HUIT 2026 (thi TN THPT)', output: total30, scale: 30, formula: result.requiredText });
  }

  return {
    schoolId: 'huit',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng HUIT.'] },
    missingInputs,
    missingRules: (method.knowledgeGaps ?? huitKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? huitKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}

export interface HuitTranscriptEvaluationContext {
  thresholdGroup?: HuitThresholdGroup;
  /** Tổng điểm học tập THPT theo tổ hợp xét tuyển (thang 30) — người dùng tự cung cấp vì nguồn
   * không nêu rõ công thức tính (xem `huit-transcript-methodology-unpublished`). */
  totalScore30?: number;
}

/** Phương thức 2: Xét kết quả học tập THPT (học bạ). */
export function evaluateHuitTranscriptAdmission(profile: ApplicantProfile, context: HuitTranscriptEvaluationContext = {}): AdmissionEvaluation {
  void profile;
  const method = huitAdmissionMethods[1];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HuitThresholdGroup = context.thresholdGroup ?? 'standard';

  if (context.totalScore30 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'huit-transcript-total-score', label: 'Tổng điểm học tập THPT theo tổ hợp xét tuyển (thang 30).' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (context.totalScore30 !== undefined) {
    const result = checkHuitTranscriptThreshold(context.totalScore30, group);
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({
      id: 'huit-transcript-threshold',
      label: 'Ngưỡng đảm bảo chất lượng HUIT 2026 (học tập THPT)',
      output: context.totalScore30,
      scale: 30,
      formula: result.requiredText,
    });
  }

  return {
    schoolId: 'huit',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần nhập tổng điểm học tập THPT theo tổ hợp xét tuyển để kiểm tra ngưỡng HUIT.'] },
    missingInputs: [],
    missingRules: (method.knowledgeGaps ?? huitKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? huitKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}
