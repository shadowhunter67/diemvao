import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import { nttuAdmissionMethods } from './methods';
import { nttuKnowledgeGaps } from './knowledgeGaps';
import { checkNttuTranscriptEligibility, type NttuAcademicRank, type NttuThresholdGroup } from './eligibility';

export interface NttuTranscriptEvaluationContext {
  thresholdGroup?: NttuThresholdGroup;
  /** Tổng điểm học bạ theo tổ hợp xét tuyển (thang 30) — người dùng tự cung cấp vì nguồn không nêu
   * rõ công thức tính (xem `nttu-transcript-methodology-unpublished`). */
  transcriptTotal30?: number;
  academicRank12?: NttuAcademicRank;
  /** Tổng 3 môn thi TN THPT (điều kiện thay thế cho nhóm Sức khỏe/Luật). */
  thptExamTotal30?: number;
  graduationScore10?: number;
}

/** Phương thức học bạ (2026). */
export function evaluateNttuTranscriptAdmission(profile: ApplicantProfile, context: NttuTranscriptEvaluationContext = {}): AdmissionEvaluation {
  void profile;
  const method = nttuAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: NttuThresholdGroup = context.thresholdGroup ?? 'standard';
  const needsExtra = group !== 'standard';

  if (context.transcriptTotal30 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'nttu-transcript-total-score', label: 'Tổng điểm học bạ theo tổ hợp xét tuyển (thang 30).' });
  }
  if (needsExtra && context.academicRank12 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'nttu-academic-rank-12', label: 'Xếp loại học lực lớp 12 (khá/tốt).' });
  }
  if (needsExtra && context.thptExamTotal30 === undefined && context.graduationScore10 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'nttu-transcript-alt-score', label: 'Tổng điểm 3 môn thi TN THPT hoặc điểm xét tốt nghiệp THPT (điều kiện thay thế).' });
  }

  const result = checkNttuTranscriptEligibility({
    group,
    transcriptTotal30: context.transcriptTotal30,
    academicRank12: context.academicRank12,
    thptExamTotal30: context.thptExamTotal30,
    graduationScore10: context.graduationScore10,
  });

  const hasEnoughInfo =
    context.transcriptTotal30 !== undefined &&
    (!needsExtra || (context.academicRank12 !== undefined && (context.thptExamTotal30 !== undefined || context.graduationScore10 !== undefined)));
  const status: 'eligible' | 'ineligible' | 'unknown' = hasEnoughInfo ? (result.pass ? 'eligible' : 'ineligible') : 'unknown';

  explanation.push({
    id: `${method.id}-threshold`,
    label: `Ngưỡng điểm sàn NTTU 2026 (${method.name})`,
    output: context.transcriptTotal30 ?? 0,
    scale: 30,
    formula: result.requiredText,
  });

  return {
    schoolId: 'nttu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: [result.requiredText] },
    missingInputs: [],
    missingRules: (method.knowledgeGaps ?? nttuKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? nttuKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}
