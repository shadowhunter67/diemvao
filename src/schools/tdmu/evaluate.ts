import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { tdmuAdmissionMethods } from './methods';
import { tdmuKnowledgeGaps } from './knowledgeGaps';
import { checkTdmuThptExamThreshold, checkTdmuTranscriptThreshold, checkTdmuVactThreshold, type TdmuProgramGroup } from './eligibility';

export interface TdmuSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function sumThptTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; missingSubjects: SubjectId[] } {
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

/** Điểm trung bình 3 môn tổ hợp qua 6 học kỳ (cả năm lớp 10, 11, 12) — mỗi môn lấy trung bình 3
 * năm rồi cộng lại (chỉ tính khi ĐỦ cả 3 năm cho môn đó, không suy đoán năm thiếu). */
function sumTranscriptAverageTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; missingSubjects: SubjectId[] } {
  let total = 0;
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const g10 = profile.transcript?.grade10?.[subjectId];
    const g11 = profile.transcript?.grade11?.[subjectId];
    const g12 = profile.transcript?.grade12?.[subjectId];
    if (g10 === undefined || g11 === undefined || g12 === undefined) {
      missingSubjects.push(subjectId);
      continue;
    }
    total += (g10 + g11 + g12) / 3;
  }
  if (missingSubjects.length > 0) return { missingSubjects };
  return { total30: Math.round(total * 100) / 100, missingSubjects };
}

function buildGapExtras(method: (typeof tdmuAdmissionMethods)[number]): { missingRules: string[]; missingRequirements: MissingRequirement[] } {
  const gaps = method.knowledgeGaps ?? tdmuKnowledgeGaps;
  return {
    missingRules: gaps.map((gap) => gap.label),
    missingRequirements: gaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
  };
}

export interface TdmuThptExamEvaluationContext {
  group?: TdmuProgramGroup;
  subjectContext?: TdmuSubjectContext;
}

/** Xét kết quả thi TN THPT 2026 — điểm thô thang 30, áp dụng cả 3 nhóm ngành. */
export function evaluateTdmuThptExamAdmission(profile: ApplicantProfile, context: TdmuThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = tdmuAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: TdmuProgramGroup = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'tdmu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển TDMU.' });
  } else {
    const { total30, missingSubjects } = sumThptTotal(profile, context.subjectContext.subjects);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `tdmu-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp TDMU.`,
        }))
      );
    }
    if (total30 !== undefined) {
      const result = checkTdmuThptExamThreshold(total30, group);
      reasons.push(result.requiredText);
      explanation.push({ id: 'tdmu-thpt-exam-threshold', label: 'Ngưỡng đầu vào TDMU 2026 (thi TN THPT)', output: total30, scale: 30, formula: result.requiredText });
      status = result.pass ? 'eligible' : 'ineligible';
    }
  }

  return {
    schoolId: 'tdmu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng TDMU.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

export interface TdmuTranscriptEvaluationContext {
  group?: 'standard' | 'law';
  subjectContext?: TdmuSubjectContext;
}

/** Xét học bạ THPT — điểm trung bình 3 môn tổ hợp qua 6 học kỳ, thang 30. Chỉ áp dụng
 * standard/law — nhóm `teacher` không có ngưỡng công bố cho phương thức này. */
export function evaluateTdmuTranscriptAdmission(profile: ApplicantProfile, context: TdmuTranscriptEvaluationContext = {}): AdmissionEvaluation {
  const method = tdmuAdmissionMethods[1];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'tdmu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển TDMU.' });
  } else {
    const { total30, missingSubjects } = sumTranscriptAverageTotal(profile, context.subjectContext.subjects);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm học bạ cả 3 năm (lớp 10, 11, 12) cho tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `tdmu-transcript-${subjectId}`,
          label: `Điểm học bạ môn ${SUBJECT_LABELS[subjectId]} cả 3 năm lớp 10, 11, 12.`,
        }))
      );
    }
    if (total30 !== undefined) {
      const result = checkTdmuTranscriptThreshold(total30, group);
      reasons.push(result.requiredText);
      explanation.push({ id: 'tdmu-transcript-threshold', label: 'Ngưỡng đầu vào TDMU 2026 (học bạ)', output: total30, scale: 30, formula: result.requiredText });
      status = result.pass ? 'eligible' : 'ineligible';
    }
  }

  return {
    schoolId: 'tdmu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm học bạ 3 năm để kiểm tra ngưỡng TDMU.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

export interface TdmuVactEvaluationContext {
  group?: 'standard' | 'law';
}

/** Xét ĐGNL ĐHQG-HCM 2026 — điểm thô thang 1200, khớp trực tiếp `ApplicantProfile.exams.vact.total`.
 * Chỉ áp dụng standard/law. */
export function evaluateTdmuVactAdmission(profile: ApplicantProfile, context: TdmuVactEvaluationContext = {}): AdmissionEvaluation {
  const method = tdmuAdmissionMethods[2];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  const vactTotal = profile.exams?.vact?.total;
  if (vactTotal === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'tdmu-vact-total', label: 'Điểm thi ĐGNL ĐHQG-HCM (thang 1200).' });
    reasons.push('Cần điểm thi ĐGNL ĐHQG-HCM để kiểm tra ngưỡng TDMU.');
  } else {
    const result = checkTdmuVactThreshold(vactTotal, group);
    reasons.push(result.requiredText);
    explanation.push({ id: 'tdmu-vact-threshold', label: 'Ngưỡng đầu vào TDMU 2026 (ĐGNL ĐHQG-HCM)', output: vactTotal, scale: 1200, formula: result.requiredText });
    status = result.pass ? 'eligible' : 'ineligible';
  }

  return {
    schoolId: 'tdmu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons },
    missingInputs: [],
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}
