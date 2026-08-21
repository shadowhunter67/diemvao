import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { ctuAdmissionMethods } from './methods';
import { ctuKnowledgeGaps } from './knowledgeGaps';
import { checkCtuBaselineCondition, checkCtuAltPathEligibility, type CtuAcademicRank, type CtuProgramGroup } from './eligibility';

export interface CtuSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function sumSubjectTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; scores: number[]; missingSubjects: SubjectId[] } {
  let total = 0;
  const scores: number[] = [];
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else {
      total += score;
      scores.push(score);
    }
  }
  if (missingSubjects.length > 0) return { scores, missingSubjects };
  return { total30: Math.round(total * 100) / 100, scores, missingSubjects };
}

function buildGapExtras(method: (typeof ctuAdmissionMethods)[number]): { missingRules: string[]; missingRequirements: MissingRequirement[] } {
  const gaps = method.knowledgeGaps ?? ctuKnowledgeGaps;
  return {
    missingRules: gaps.map((gap) => gap.label),
    missingRequirements: gaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
  };
}

export interface CtuThptExamEvaluationContext {
  subjectContext?: CtuSubjectContext;
}

/** Phương thức 2: Xét điểm thi TN THPT 2026 — chỉ kiểm tra được điều kiện 1 (điều kiện CẦN, mọi
 * ngành/mọi nhóm giống nhau). Điều kiện 2 (điểm sàn theo mã xét tuyển) PDF-gated — KHÔNG kết luận
 * `eligible`, chỉ `ineligible` (điều kiện 1 fail) hoặc `unknown`. */
export function evaluateCtuThptExamAdmission(profile: ApplicantProfile, context: CtuThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = ctuAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const gapExtras = buildGapExtras(method);

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'ctu-subject-combination', label: 'Chọn tổ hợp môn xét tuyển CTU.' });
  } else {
    const { total30, scores, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `ctu-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp CTU.`,
        }))
      );
    }
    if (total30 !== undefined) {
      const result = checkCtuBaselineCondition(total30, scores);
      reasons.push(result.requiredText);
      explanation.push({ id: 'ctu-thpt-exam-baseline', label: 'Điều kiện 1 — ngưỡng đầu vào CTU 2026 (Phương thức 2)', output: total30, scale: 30, formula: result.requiredText });
      status = result.pass === false ? 'ineligible' : 'unknown';
    }
  }

  return {
    schoolId: 'ctu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra điều kiện 1 của CTU.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

export interface CtuAltPathEvaluationContext {
  group?: CtuProgramGroup;
  subjectContext?: CtuSubjectContext;
  academicRank12?: CtuAcademicRank;
  graduationScore10?: number;
}

/** Phương thức 3 (học bạ)/4 (V-SAT) — điều kiện thay thế qua học lực lớp 12 + điểm thi TN THPT
 * 2026/điểm xét tốt nghiệp THPT, CHỈ áp dụng nhóm `law`/`teacher` (mục 2.2.3/2.2.4). Nhóm
 * `standard` không có đường thay thế trong nguồn — trả `unknown` (cần bảng quy đổi hocba/V-SAT). */
function evaluateCtuAltPathAdmission(method: (typeof ctuAdmissionMethods)[number], profile: ApplicantProfile, context: CtuAltPathEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const gapExtras = buildGapExtras(method);
  const group = context.group;

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (group === undefined) {
    missingRequirements.push({ kind: 'school-context', code: 'ctu-program-group', label: 'Chọn nhóm ngành CTU (pháp luật/sư phạm/khác) để xét điều kiện thay thế.' });
    reasons.push('Điều kiện thay thế (học lực + điểm) chỉ áp dụng nhóm pháp luật/sư phạm — cần biết nhóm ngành để kiểm tra.');
  } else if (group === 'standard') {
    reasons.push('Nhóm ngành khác (không phải pháp luật/sư phạm) không có đường thay thế công bố — cần bảng quy đổi điểm học bạ/V-SAT (chưa đọc được) để kiểm tra điều kiện 2.2.2.');
  } else {
    let total30: number | undefined;
    if (context.subjectContext) {
      const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
      total30 = total;
      if (missingSubjects.length > 0) missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT 2026 để đối chiếu điều kiện thay thế.');
    }
    if (context.academicRank12 === undefined) {
      missingRequirements.push({ kind: 'profile-input', code: 'ctu-academic-rank-12', label: 'Xếp loại học lực cả năm lớp 12 (điều kiện thay thế).' });
    }
    if (total30 === undefined && context.graduationScore10 === undefined) {
      missingRequirements.push({ kind: 'profile-input', code: 'ctu-alt-path-score', label: 'Tổng điểm 3 môn thi TN THPT 2026 hoặc điểm xét tốt nghiệp THPT.' });
    }

    const result = checkCtuAltPathEligibility({ totalScore30: total30, academicRank12: context.academicRank12, graduationScore10: context.graduationScore10 }, group);
    reasons.push(result.requiredText);
    explanation.push({
      id: `${method.id}-alt-path`,
      label: `Điều kiện thay thế CTU 2026 (${method.name})`,
      output: total30 ?? context.graduationScore10 ?? 0,
      scale: total30 !== undefined ? 30 : 10,
      formula: result.requiredText,
    });

    if (result.pass === false) status = 'ineligible';
    else if (result.pass === true) {
      if (group === 'law') {
        status = 'unknown';
        reasons.push('Nhóm pháp luật còn điều kiện tổ hợp môn (Văn/Toán+Văn) dùng điểm V-SAT/học bạ quy đổi — chưa có bảng quy đổi, không thể kết luận eligible chắc chắn.');
      } else {
        status = 'eligible';
      }
    }
  }

  return {
    schoolId: 'ctu',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn nhóm ngành và nhập đủ thông tin để kiểm tra điều kiện thay thế CTU.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

/** Phương thức 3 (học bạ). */
export function evaluateCtuTranscriptAdmission(profile: ApplicantProfile, context: CtuAltPathEvaluationContext = {}): AdmissionEvaluation {
  return evaluateCtuAltPathAdmission(ctuAdmissionMethods[1], profile, context);
}

/** Phương thức 4 (V-SAT). */
export function evaluateCtuVsatAdmission(profile: ApplicantProfile, context: CtuAltPathEvaluationContext = {}): AdmissionEvaluation {
  return evaluateCtuAltPathAdmission(ctuAdmissionMethods[2], profile, context);
}
