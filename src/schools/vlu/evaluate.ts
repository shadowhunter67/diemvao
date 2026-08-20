import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { vluAdmissionMethods } from './methods';
import { vluKnowledgeGaps } from './knowledgeGaps';
import {
  checkVluThptExamThreshold,
  checkVluTranscriptOrCombinedEligibility,
  type VluAcademicRank,
  type VluThresholdGroup,
} from './eligibility';

export interface VluSubjectContext {
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

export interface VluThptExamEvaluationContext {
  thresholdGroup?: VluThresholdGroup;
  subjectContext?: VluSubjectContext;
}

/** Phương thức 1: Xét kết quả thi TN THPT 2026. */
export function evaluateVluThptExamAdmission(profile: ApplicantProfile, context: VluThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = vluAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: VluThresholdGroup = context.thresholdGroup ?? 'standard';

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `vlu-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp VLU.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'vlu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển VLU.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];
  if (total30 !== undefined) {
    const result = checkVluThptExamThreshold(total30, group);
    status = result.pass ? 'eligible' : 'ineligible';
    reasons.push(result.requiredText);
    explanation.push({ id: 'vlu-thpt-exam-threshold', label: 'Ngưỡng đảm bảo chất lượng VLU 2026 (Phương thức 1)', output: total30, scale: 30, formula: result.requiredText });
  }

  return {
    schoolId: 'vlu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng VLU.'] },
    missingInputs,
    missingRules: (method.knowledgeGaps ?? vluKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? vluKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}

export interface VluTranscriptEvaluationContext {
  thresholdGroup?: VluThresholdGroup;
  academicRank12?: VluAcademicRank;
  /** Tổng 3 môn thi TN THPT theo tổ hợp xét tuyển (dùng làm điều kiện thay thế cho khối Sức khỏe/Luật). */
  subjectContext?: VluSubjectContext;
  /** Điểm xét tốt nghiệp THPT (thang 10), nếu người dùng tự cung cấp — không có consumer field
   * tương ứng trong `ApplicantProfile` hiện tại nên nhận trực tiếp từ context. */
  graduationScore10?: number;
}

/** Phương thức 2 (học bạ, mã dùng chung): Xét kết quả học tập cấp THPT. Method 3 (kết hợp) dùng
 * chung hàm này ở phần điều kiện bổ sung (giống nhau theo nguồn — chỉ khác nguồn điểm 80% còn
 * lại chưa quy đổi được, xem `vlu-combined-method-conversion-table-unpublished`). */
function evaluateVluTranscriptFamilyAdmission(method: (typeof vluAdmissionMethods)[number], profile: ApplicantProfile, context: VluTranscriptEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: VluThresholdGroup = context.thresholdGroup ?? 'standard';

  let thptExamTotal30: number | undefined;
  if (context.subjectContext) {
    const { total30, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    thptExamTotal30 = total30;
    if (missingSubjects.length > 0 && group !== 'standard') {
      missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT để đối chiếu điều kiện thay thế (chỉ cần cho khối Sức khỏe/Luật).');
    }
  }

  if (group !== 'standard' && context.academicRank12 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'vlu-academic-rank-12', label: 'Xếp loại học lực lớp 12 (khá/giỏi).' });
  }
  if (group !== 'standard' && thptExamTotal30 === undefined && context.graduationScore10 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'vlu-transcript-alt-score', label: 'Tổng điểm 3 môn thi TN THPT hoặc điểm xét tốt nghiệp THPT (điều kiện thay thế).' });
  }

  const result = checkVluTranscriptOrCombinedEligibility({
    group,
    academicRank12: context.academicRank12,
    thptExamTotal30,
    graduationScore10: context.graduationScore10,
  });
  const hasEnoughInfo = group === 'standard' || (context.academicRank12 !== undefined && (thptExamTotal30 !== undefined || context.graduationScore10 !== undefined));
  const status: 'eligible' | 'ineligible' | 'unknown' = hasEnoughInfo ? (result.pass ? 'eligible' : 'ineligible') : 'unknown';
  explanation.push({ id: `${method.id}-threshold`, label: `Ngưỡng đảm bảo chất lượng VLU 2026 (${method.name})`, output: thptExamTotal30 ?? 0, scale: 30, formula: result.requiredText });

  return {
    schoolId: 'vlu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: [result.requiredText] },
    missingInputs,
    missingRules: (method.knowledgeGaps ?? vluKnowledgeGaps).map((gap) => gap.label),
    missingRequirements: [...missingRequirements, ...(method.knowledgeGaps ?? vluKnowledgeGaps).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))],
    explanation,
    evidence: [],
  };
}

/** Phương thức 2: Xét kết quả học tập cấp THPT (học bạ). */
export function evaluateVluTranscriptAdmission(profile: ApplicantProfile, context: VluTranscriptEvaluationContext = {}): AdmissionEvaluation {
  return evaluateVluTranscriptFamilyAdmission(vluAdmissionMethods[1], profile, context);
}

/** Phương thức 3: Xét tuyển kết hợp học bạ THPT với ĐGNL/ĐGTD/chứng chỉ quốc tế. */
export function evaluateVluCombinedAdmission(profile: ApplicantProfile, context: VluTranscriptEvaluationContext = {}): AdmissionEvaluation {
  return evaluateVluTranscriptFamilyAdmission(vluAdmissionMethods[2], profile, context);
}
