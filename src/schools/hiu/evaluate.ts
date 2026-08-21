import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hiuAdmissionMethods } from './methods';
import { hiuKnowledgeGaps } from './knowledgeGaps';
import { checkHiuThptExamThreshold, checkHiuVactThreshold, type HiuThptExamGroup, type HiuVactGroup } from './eligibility';

export interface HiuSubjectContext {
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

function buildGapExtras(method: (typeof hiuAdmissionMethods)[number]): { missingRules: string[]; missingRequirements: MissingRequirement[] } {
  const gaps = method.knowledgeGaps ?? hiuKnowledgeGaps;
  return {
    missingRules: gaps.map((gap) => gap.label),
    missingRequirements: gaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
  };
}

export interface HiuThptExamEvaluationContext {
  group?: HiuThptExamGroup;
  subjectContext?: HiuSubjectContext;
}

/** Xét kết quả thi TN THPT 2026 — chỉ nhóm `standard` (15/30) checkable đầy đủ; nhóm
 * `healthLicenseOrLaw` trả `unknown` (ngưỡng Bộ GD&ĐT quy định, chưa có số trong nguồn HIU). */
export function evaluateHiuThptExamAdmission(profile: ApplicantProfile, context: HiuThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = hiuAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HiuThptExamGroup = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'hiu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển HIU.' });
  } else {
    const { total30, missingSubjects } = sumThptTotal(profile, context.subjectContext.subjects);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `hiu-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HIU.`,
        }))
      );
    }
    if (total30 !== undefined) {
      const result = checkHiuThptExamThreshold(total30, group);
      reasons.push(result.requiredText);
      explanation.push({ id: 'hiu-thpt-exam-threshold', label: 'Ngưỡng đầu vào HIU 2026 (thi TN THPT)', output: total30, scale: 30, formula: result.requiredText });
      status = result.pass === undefined ? 'unknown' : result.pass ? 'eligible' : 'ineligible';
    }
  }

  return {
    schoolId: 'hiu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng HIU.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

export interface HiuVactEvaluationContext {
  group?: HiuVactGroup;
}

/** Xét ĐGNL ĐHQG-HCM 2026 — điểm thô thang 1200, khớp trực tiếp `ApplicantProfile.exams.vact.total`.
 * Cả 3 nhóm đều có ngưỡng công bố (650/700/675). */
export function evaluateHiuVactAdmission(profile: ApplicantProfile, context: HiuVactEvaluationContext = {}): AdmissionEvaluation {
  const method = hiuAdmissionMethods[2];
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HiuVactGroup = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  const vactTotal = profile.exams?.vact?.total;
  if (vactTotal === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hiu-vact-total', label: 'Điểm thi ĐGNL ĐHQG-HCM (thang 1200).' });
    reasons.push('Cần điểm thi ĐGNL ĐHQG-HCM để kiểm tra ngưỡng HIU.');
  } else {
    const result = checkHiuVactThreshold(vactTotal, group);
    reasons.push(result.requiredText);
    explanation.push({ id: 'hiu-vact-threshold', label: 'Ngưỡng đầu vào HIU 2026 (ĐGNL ĐHQG-HCM)', output: vactTotal, scale: 1200, formula: result.requiredText });
    status = result.pass ? 'eligible' : 'ineligible';
  }

  return {
    schoolId: 'hiu',
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
