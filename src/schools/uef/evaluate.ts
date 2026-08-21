import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { uefAdmissionMethods } from './methods';
import { uefKnowledgeGaps } from './knowledgeGaps';
import { checkUefThptExamThreshold, checkUefTranscriptEligibility, type UefAcademicRank, type UefThresholdGroup } from './eligibility';

export interface UefSubjectContext {
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

export interface UefThptExamEvaluationContext {
  thresholdGroup?: UefThresholdGroup;
  subjectContext?: UefSubjectContext;
}

/** Phương thức thi TN THPT 2026. */
export function evaluateUefThptExamAdmission(profile: ApplicantProfile, context: UefThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = uefAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: UefThresholdGroup = context.thresholdGroup ?? 'standard';

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `uef-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp UEF.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'uef-subject-combination', label: 'Chọn tổ hợp môn xét tuyển UEF.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (total30 !== undefined) {
    const result = checkUefThptExamThreshold(total30, group);
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({ id: 'uef-thpt-exam-threshold', label: 'Mức điểm nhận hồ sơ UEF 2026 (thi TN THPT)', output: total30, scale: 30, formula: result.requiredText });
  }

  return {
    schoolId: 'uef',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra mức điểm nhận hồ sơ UEF.'] },
    missingInputs,
    missingRules: (method.knowledgeGaps ?? uefKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? uefKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}

export interface UefTranscriptEvaluationContext {
  thresholdGroup?: UefThresholdGroup;
  /** Điểm trung bình tổ hợp 3 môn của 6 học kỳ (thang 30) — chỉ dùng cho nhóm `standard`, người
   * dùng tự cung cấp (xem `uef-transcript-methodology-unpublished`). */
  transcriptTotal30?: number;
  /** Chỉ dùng cho nhóm `law`. */
  academicRank12?: UefAcademicRank;
  thptExamTotal30?: number;
  graduationScore10?: number;
}

/** Phương thức học bạ (6 học kỳ). */
export function evaluateUefTranscriptAdmission(profile: ApplicantProfile, context: UefTranscriptEvaluationContext = {}): AdmissionEvaluation {
  void profile;
  const method = uefAdmissionMethods[1];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: UefThresholdGroup = context.thresholdGroup ?? 'standard';

  if (group === 'standard' && context.transcriptTotal30 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'uef-transcript-total-score', label: 'Điểm trung bình tổ hợp 3 môn của 6 học kỳ (thang 30).' });
  }
  if (group === 'law' && context.academicRank12 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'uef-academic-rank-12', label: 'Xếp loại học lực cả năm lớp 12 (khá/tốt-giỏi).' });
  }
  if (group === 'law' && context.thptExamTotal30 === undefined && context.graduationScore10 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'uef-transcript-alt-score', label: 'Tổng điểm 3 môn thi TN THPT hoặc điểm xét tốt nghiệp THPT (điều kiện thay thế nhóm Luật).' });
  }

  const result = checkUefTranscriptEligibility({
    group,
    transcriptTotal30: context.transcriptTotal30,
    academicRank12: context.academicRank12,
    thptExamTotal30: context.thptExamTotal30,
    graduationScore10: context.graduationScore10,
  });

  const hasEnoughInfo =
    group === 'standard'
      ? context.transcriptTotal30 !== undefined
      : context.academicRank12 !== undefined && (context.thptExamTotal30 !== undefined || context.graduationScore10 !== undefined);
  const status: 'eligible' | 'ineligible' | 'unknown' = hasEnoughInfo ? (result.pass ? 'eligible' : 'ineligible') : 'unknown';

  explanation.push({
    id: `${method.id}-threshold`,
    label: `Mức điểm nhận hồ sơ UEF 2026 (${method.name})`,
    output: context.transcriptTotal30 ?? 0,
    scale: 30,
    formula: result.requiredText,
  });

  return {
    schoolId: 'uef',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: [result.requiredText] },
    missingInputs: [],
    missingRules: (method.knowledgeGaps ?? uefKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? uefKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}
