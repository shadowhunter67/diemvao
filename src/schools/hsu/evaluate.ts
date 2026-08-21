import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hsuAdmissionMethods } from './methods';
import { hsuKnowledgeGaps } from './knowledgeGaps';
import { checkHsuThptExamThreshold, checkHsuTranscriptThreshold, type HsuThresholdGroup } from './eligibility';

export interface HsuSubjectContext {
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

export interface HsuThptExamEvaluationContext {
  thresholdGroup?: HsuThresholdGroup;
  subjectContext?: HsuSubjectContext;
}

/** Phương thức thi TN THPT 2026. */
export function evaluateHsuThptExamAdmission(profile: ApplicantProfile, context: HsuThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = hsuAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HsuThresholdGroup = context.thresholdGroup ?? 'standard';

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `hsu-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HSU.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'hsu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển HSU.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (total30 !== undefined) {
    const result = checkHsuThptExamThreshold(total30, group);
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({ id: 'hsu-thpt-exam-threshold', label: 'Điểm sàn HSU 2026 (thi TN THPT)', output: total30, scale: 30, formula: result.requiredText });
  }

  return {
    schoolId: 'hsu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng HSU.'] },
    missingInputs,
    missingRules: (method.knowledgeGaps ?? hsuKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? hsuKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}

export interface HsuTranscriptEvaluationContext {
  thresholdGroup?: HsuThresholdGroup;
  /** Tổng điểm học bạ theo tổ hợp 3 môn, trung bình 6 học kỳ (thang 30) — người dùng tự cung cấp
   * (xem `hsu-transcript-methodology-unpublished`). */
  totalScore30?: number;
}

/** Phương thức học bạ (tổ hợp 3 môn, 6 học kỳ). Nhóm `law` chưa có ngưỡng công bố cho phương thức
 * này -> luôn trả `unknown` kèm gap, không phải `ineligible`. */
export function evaluateHsuTranscriptAdmission(profile: ApplicantProfile, context: HsuTranscriptEvaluationContext = {}): AdmissionEvaluation {
  void profile;
  const method = hsuAdmissionMethods[1];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HsuThresholdGroup = context.thresholdGroup ?? 'standard';

  const result = context.totalScore30 !== undefined ? checkHsuTranscriptThreshold(context.totalScore30, group) : undefined;

  if (context.totalScore30 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hsu-transcript-total-score', label: 'Tổng điểm học bạ theo tổ hợp 3 môn (trung bình 6 học kỳ, thang 30).' });
  }
  if (group === 'law') {
    missingRequirements.push({ kind: 'official-rule', code: 'hsu-law-non-thpt-threshold-unpublished', label: 'HSU chưa công bố ngưỡng phương thức học bạ cho khối ngành Pháp luật.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (result) {
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({ id: 'hsu-transcript-threshold', label: 'Điểm sàn HSU 2026 (học bạ)', output: context.totalScore30 ?? 0, scale: 30, formula: result.requiredText });
  } else if (group === 'law') {
    reasons.push('HSU chưa công bố ngưỡng phương thức học bạ cho khối ngành Pháp luật.');
  } else {
    reasons.push('Cần nhập tổng điểm học bạ theo tổ hợp 3 môn (trung bình 6 học kỳ) để kiểm tra ngưỡng HSU.');
  }

  return {
    schoolId: 'hsu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons },
    missingInputs: [],
    missingRules: (method.knowledgeGaps ?? hsuKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? hsuKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}
