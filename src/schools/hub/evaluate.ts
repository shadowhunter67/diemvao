import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hubAdmissionMethods } from './methods';
import { hubKnowledgeGaps } from './knowledgeGaps';
import {
  checkHubStandardThreshold,
  checkHubLawThptExamThreshold,
  checkHubEliteIeltsRequirement,
  checkHubStandardComprehensiveVsat2026Eligibility,
  checkHubLawComprehensiveVsat2026Eligibility,
  type HubAcademicRank,
  type HubProgramGroup,
} from './eligibility';

export interface HubSubjectContext {
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

function buildGapExtras(method: (typeof hubAdmissionMethods)[number]): { missingRules: string[]; missingRequirements: MissingRequirement[] } {
  const gaps = method.knowledgeGaps ?? hubKnowledgeGaps;
  return {
    missingRules: gaps.map((gap) => gap.label),
    missingRequirements: gaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
  };
}

export interface HubThptExamEvaluationContext {
  group?: HubProgramGroup;
  subjectContext?: HubSubjectContext;
  /** Chỉ dùng cho nhóm `law` — mã khu vực ưu tiên (vd 'KV3'). */
  priorityZone?: string;
  /** Chỉ dùng cho nhóm `finance-banking-elite` — điểm IELTS thí sinh cung cấp. */
  ielts?: number;
}

/** Phương thức 1: Xét kết quả thi TN THPT 2026. */
export function evaluateHubThptExamAdmission(profile: ApplicantProfile, context: HubThptExamEvaluationContext = {}): AdmissionEvaluation {
  const method = hubAdmissionMethods[0];
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HubProgramGroup = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ điểm 3 môn THPT trong tổ hợp đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `hub-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HUB.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'hub-subject-combination', label: 'Chọn tổ hợp môn xét tuyển HUB.' });
  }

  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (group === 'law') {
    if (context.priorityZone === undefined) {
      missingRequirements.push({ kind: 'profile-input', code: 'hub-priority-zone', label: 'Khu vực ưu tiên tuyển sinh (ngưỡng khối Luật chỉ xác định được cho khu vực 3).' });
    }
    if (total30 !== undefined) {
      const result = checkHubLawThptExamThreshold({
        totalScore30: total30,
        combinationId: context.subjectContext?.combinationId,
        mathScore: profile.thpt?.scores?.math,
        literatureScore: profile.thpt?.scores?.literature,
        priorityZone: context.priorityZone,
      });
      reasons.push(result.requiredText);
      explanation.push({ id: 'hub-thpt-exam-law-threshold', label: 'Ngưỡng đảm bảo chất lượng HUB 2026 — khối Luật (Phương thức 1)', output: total30, scale: 30, formula: result.requiredText });
      status = context.priorityZone === 'KV3' ? (result.pass ? 'eligible' : 'ineligible') : 'unknown';
    }
  } else {
    if (total30 !== undefined) {
      const result = checkHubStandardThreshold(total30);
      let pass = result.pass;
      reasons.push(result.requiredText);
      explanation.push({ id: 'hub-thpt-exam-threshold', label: 'Ngưỡng đảm bảo chất lượng HUB 2026 (Phương thức 1)', output: total30, scale: 30, formula: result.requiredText });

      if (group === 'finance-banking-elite') {
        const ieltsResult = checkHubEliteIeltsRequirement(context.ielts);
        reasons.push(ieltsResult.requiredText);
        if (context.ielts === undefined) {
          missingRequirements.push({ kind: 'profile-input', code: 'hub-elite-ielts', label: 'Điểm chứng chỉ IELTS (điều kiện riêng Elite Class).' });
          status = 'unknown';
        } else {
          pass = pass && ieltsResult.pass;
          status = pass ? 'eligible' : 'ineligible';
        }
      } else {
        status = pass ? 'eligible' : 'ineligible';
      }
    }
  }

  return {
    schoolId: 'hub',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn tổ hợp môn và nhập đủ điểm để kiểm tra ngưỡng HUB.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

export interface HubComprehensiveVsatEvaluationContext {
  group?: HubProgramGroup;
  subjectContext?: HubSubjectContext;
  academicRank10?: HubAcademicRank;
  academicRank11?: HubAcademicRank;
  academicRank12?: HubAcademicRank;
  /** Chỉ dùng cho nhóm `law` — mã khu vực ưu tiên, cho điều kiện thay thế (a) giống Phương thức 1. */
  priorityZone?: string;
  /** Chỉ dùng cho nhóm `law` — điểm xét tốt nghiệp THPT (thang 10), điều kiện thay thế (c). */
  graduationScore10?: number;
  /** Chỉ dùng cho nhóm `finance-banking-elite`. */
  ielts?: number;
}

/** Phương thức Tổng hợp/V-SAT dùng CHUNG điều kiện ngưỡng (nguồn không phân biệt 2 phương thức ở
 * mục ngưỡng đảm bảo chất lượng — chỉ khác nhau ở cách quy đổi điểm trúng tuyển, vốn đã bị chặn bởi
 * Phụ lục I/II, xem `methods.ts`). Thí sinh tốt nghiệp THPT trước 2026 dùng khái niệm "tổng điểm
 * xét tuyển" chưa định nghĩa rõ trong nguồn — trả `unknown`, KHÔNG suy đoán
 * (`hub-comprehensive-vsat-pre2026-graduate-not-modeled`). */
function evaluateHubComprehensiveVsatFamilyAdmission(
  method: (typeof hubAdmissionMethods)[number],
  profile: ApplicantProfile,
  context: HubComprehensiveVsatEvaluationContext = {}
): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const group: HubProgramGroup = context.group ?? 'standard';
  const gapExtras = buildGapExtras(method);

  let total30: number | undefined;
  if (context.subjectContext) {
    const { total30: total, missingSubjects } = sumSubjectTotal(profile, context.subjectContext.subjects);
    total30 = total;
    if (missingSubjects.length > 0) missingInputs.push('Chưa đủ điểm 3 môn thi TN THPT để đối chiếu điều kiện.');
  }

  const graduationYear = profile.graduationYear;
  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (graduationYear === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hub-graduation-year', label: 'Năm tốt nghiệp THPT (điều kiện ngưỡng HUB khác nhau giữa thí sinh 2026 và trước 2026).' });
    reasons.push('Cần biết năm tốt nghiệp THPT để xác định điều kiện ngưỡng HUB áp dụng.');
  } else if (graduationYear < 2026) {
    reasons.push(
      'Thí sinh tốt nghiệp THPT trước năm 2026 dùng khái niệm "tổng điểm xét tuyển" — nguồn chưa định nghĩa rõ cách tính độc lập với bảng quy đổi (Phụ lục II), UniscoreVN chưa model điều kiện này để tránh suy đoán công thức.'
    );
  } else {
    if (group === 'law') {
      const result = checkHubLawComprehensiveVsat2026Eligibility({
        totalScore30: total30,
        combinationId: context.subjectContext?.combinationId,
        mathScore: profile.thpt?.scores?.math,
        literatureScore: profile.thpt?.scores?.literature,
        priorityZone: context.priorityZone,
        academicRank12: context.academicRank12,
        graduationScore10: context.graduationScore10,
      });
      reasons.push(result.requiredText);
      explanation.push({ id: `${method.id}-law-threshold`, label: `Ngưỡng đảm bảo chất lượng HUB 2026 — khối Luật (${method.name})`, output: total30 ?? context.graduationScore10 ?? 0, scale: 30, formula: result.requiredText });

      const hasAnyPathInfo =
        (context.priorityZone !== undefined && total30 !== undefined) ||
        (context.academicRank12 !== undefined && total30 !== undefined) ||
        context.graduationScore10 !== undefined;
      status = hasAnyPathInfo ? (result.pass ? 'eligible' : 'ineligible') : 'unknown';
      if (!hasAnyPathInfo) {
        missingRequirements.push({ kind: 'profile-input', code: 'hub-law-comprehensive-vsat-path-input', label: 'Cần ít nhất 1 trong 3 điều kiện: khu vực + tổng điểm, hoặc học lực lớp 12 + tổng điểm, hoặc điểm xét tốt nghiệp THPT.' });
      }
    } else {
      const result = checkHubStandardComprehensiveVsat2026Eligibility({
        academicRank10: context.academicRank10,
        academicRank11: context.academicRank11,
        academicRank12: context.academicRank12,
        totalScore30: total30,
      });
      let pass = result.pass;
      reasons.push(result.requiredText);
      explanation.push({ id: `${method.id}-threshold`, label: `Ngưỡng đảm bảo chất lượng HUB 2026 (${method.name})`, output: total30 ?? 0, scale: 30, formula: result.requiredText });

      const ranksKnown = [context.academicRank10, context.academicRank11, context.academicRank12].every((rank) => rank !== undefined);
      const hasEnoughInfo = ranksKnown && total30 !== undefined;

      if (group === 'finance-banking-elite') {
        const ieltsResult = checkHubEliteIeltsRequirement(context.ielts);
        reasons.push(ieltsResult.requiredText);
        if (!hasEnoughInfo || context.ielts === undefined) {
          if (context.ielts === undefined) missingRequirements.push({ kind: 'profile-input', code: 'hub-elite-ielts', label: 'Điểm chứng chỉ IELTS (điều kiện riêng Elite Class).' });
          status = 'unknown';
        } else {
          pass = pass && ieltsResult.pass;
          status = pass ? 'eligible' : 'ineligible';
        }
      } else {
        status = hasEnoughInfo ? (pass ? 'eligible' : 'ineligible') : 'unknown';
      }

      if (!ranksKnown) missingRequirements.push({ kind: 'profile-input', code: 'hub-academic-rank-10-11-12', label: 'Xếp loại học lực cả năm lớp 10, 11 và 12 (khá/giỏi).' });
    }
  }

  return {
    schoolId: 'hub',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần nhập đủ điểm/xếp loại học lực để kiểm tra ngưỡng HUB.'] },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [],
  };
}

/** Phương thức Tổng hợp. */
export function evaluateHubComprehensiveAdmission(profile: ApplicantProfile, context: HubComprehensiveVsatEvaluationContext = {}): AdmissionEvaluation {
  return evaluateHubComprehensiveVsatFamilyAdmission(hubAdmissionMethods[1], profile, context);
}

/** Phương thức V-SAT. */
export function evaluateHubVsatAdmission(profile: ApplicantProfile, context: HubComprehensiveVsatEvaluationContext = {}): AdmissionEvaluation {
  return evaluateHubComprehensiveVsatFamilyAdmission(hubAdmissionMethods[2], profile, context);
}
