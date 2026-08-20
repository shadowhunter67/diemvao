import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { umpAdmissionMethods } from './methods';
import { findUmpProgram } from './programs';
import { checkUmpThreshold } from './eligibility';
import { calculateUmpRawScore, calculateUmpFinalScore } from './calculator';
import { calculateUmpPriority30, lookupUmpStandardPriority30 } from './priority';
import { calculateUmpBonus30 } from './bonus';
import { umpFormulaEvidence, umpPriorityEvidence, umpBonusEvidence, umpThresholdEvidence } from './evidence';

export interface UmpSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface UmpEvaluationContext {
  subjectContext?: UmpSubjectContext;
  selectedProgramId?: string;
}

function partial(missingInputs: string[], missingRequirements: MissingRequirement[], explanation: CalculationStep[], eligibilityReason: string): AdmissionEvaluation {
  const method = umpAdmissionMethods[0];
  return {
    schoolId: 'ump',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status: 'unknown', reasons: [eligibilityReason] },
    missingInputs,
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [],
  };
}

/** Xét kết quả thi TN THPT 2026 — Điểm xét tuyển = Tổng 3 môn (thang 30) + Điểm ưu tiên + Điểm
 * khuyến khích, kẹp 30. Công thức + điểm ưu tiên + điểm khuyến khích đều verified đầy đủ từ nguồn
 * UMP tự công bố (xem `methods.ts` — không có điều kiện "chỉ exact khi không có thành tích cộng
 * điểm" như nhiều trường khác trong dự án). */
export function evaluateUmpAdmission(profile: ApplicantProfile, context: UmpEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const method = umpAdmissionMethods[0];

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'ump-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển UMP (A00/B00/B08/D01/D07).' });
    return partial(['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, 'Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.');
  }

  const { subjects } = context.subjectContext;
  const scores: number[] = [];
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else scores.push(score);
  }
  if (missingSubjects.length > 0) {
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `ump-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(['Chưa đủ điểm 3 môn thi THPT theo tổ hợp.'], missingRequirements, explanation, 'Cần đủ điểm 3 môn để kiểm tra ngưỡng.');
  }

  const raw30 = calculateUmpRawScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  explanation.push({ id: 'ump-academic-score', label: 'Tổng điểm 3 môn theo tổ hợp', output: raw30, scale: 30, formula: 'Môn 1 + Môn 2 + Môn 3 (không nhân hệ số)', evidence: umpFormulaEvidence.evidence });

  const program = findUmpProgram(context.selectedProgramId);
  let eligibility: AdmissionEvaluation['eligibility'] = { status: 'unknown', reasons: ['Chưa chọn ngành — không tra được ngưỡng đầu vào.'] };
  if (context.selectedProgramId) {
    const threshold = checkUmpThreshold(context.selectedProgramId, raw30);
    eligibility = { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] };
    explanation.push({ id: 'ump-eligibility-threshold', label: 'Ngưỡng đảm bảo chất lượng đầu vào', output: raw30, scale: 30, formula: threshold.requiredText, evidence: umpThresholdEvidence.evidence });
    if (program?.femaleOnly) {
      missingRequirements.push({ kind: 'unsupported', code: 'ump-gender-restriction-not-modeled', label: 'Ngành Hộ sinh chỉ tuyển Nữ — UniscoreVN chưa kiểm tra điều kiện giới tính.' });
    }
  }

  const standardPriority30 = lookupUmpStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUmpPriority30({ academicScore30: raw30, standardPriority30 });
  explanation.push({
    id: 'ump-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Tổng điểm)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: umpPriorityEvidence.evidence,
  });

  const certificates = profile.certificates;
  const englishCertificate =
    certificates?.ielts !== undefined && certificates?.toeflIbt !== undefined
      ? certificates.ielts / 9 >= certificates.toeflIbt / 120
        ? ({ type: 'ielts' as const, score: certificates.ielts })
        : ({ type: 'toefl-ibt' as const, score: certificates.toeflIbt })
      : certificates?.ielts !== undefined
        ? ({ type: 'ielts' as const, score: certificates.ielts })
        : certificates?.toeflIbt !== undefined
          ? ({ type: 'toefl-ibt' as const, score: certificates.toeflIbt })
          : undefined;
  const bonus = calculateUmpBonus30({ englishCertificate, satScore: certificates?.sat });
  if (bonus.total30 > 0) {
    explanation.push({
      id: 'ump-bonus',
      label: 'Điểm khuyến khích (chứng chỉ ngoại ngữ/SAT)',
      output: bonus.total30,
      scale: 30,
      formula: '0,9 × (điểm/thang tối đa), cộng dồn, kẹp trần 1,50',
      evidence: umpBonusEvidence.evidence,
    });
  }

  const finalScore = calculateUmpFinalScore({ raw30, priority30: priority.effectivePriority30, bonus30: bonus.total30 });
  explanation.push({ id: 'ump-final', label: 'Điểm xét tuyển cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'ump',
    year: method.year,
    methodId: method.id,
    confidence: 'exact-verified',
    eligibility,
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...umpFormulaEvidence.evidence, ...umpThresholdEvidence.evidence, ...umpPriorityEvidence.evidence, ...(bonus.total30 > 0 ? umpBonusEvidence.evidence : [])],
  };
}
