import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import { convertDgnlToThpt } from './dgnlConversion';
import { checkUehThreshold } from './eligibility';
import { uehAdmissionMethods } from './methods';
import { uehDgnlConversionEvidence, uehFinalConversionEvidence, uehBonusEvidence, uehPriorityEvidence } from './evidence';
import { calculateUehExactScore } from './calculator';
import type { UehPriorityObjectGroup, UehPriorityZone } from './priority';

export interface UehPartialInput {
  dgnlScore?: number;
  /** Điểm xét tuyển thang 100 người dùng tự biết từ nguồn khác — dùng để check eligibility khi
   * chưa nhập đủ input cho exact calculator bên dưới. */
  knownAdmissionScore100?: number;
  campus?: 'hcmc' | 'mekong';
}

export interface UehExactEvaluationInput {
  /** Điểm thi thang 30 — trực tiếp (tổng 3 môn tổ hợp) hoặc đã quy đổi từ ĐGNL/V-SAT. */
  examScore30?: number;
  gpaGrade10?: number;
  gpaGrade11?: number;
  gpaGrade12?: number;
  bonusIds?: readonly string[];
  priorityZone?: UehPriorityZone;
  priorityObjectGroup?: UehPriorityObjectGroup;
  campus: 'hcmc' | 'mekong';
}

const evidenceBase = [
  ...uehDgnlConversionEvidence.evidence,
  ...uehFinalConversionEvidence.evidence,
  ...uehBonusEvidence.evidence,
  ...uehPriorityEvidence.evidence,
];

/**
 * UEH exact — Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam), Phương thức xét tuyển tích hợp.
 * Trả `confidence: 'partial'` (score để trống) khi thiếu `examScore30` hoặc 1 trong 3 GPA — MISSING
 * INPUT khác hẳn MISSING RULE (công thức đã đủ, chỉ chờ người dùng nhập).
 */
export function evaluateUehExactAdmission(input: UehExactEvaluationInput): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  const hasExam = input.examScore30 !== undefined;
  const hasGpa = input.gpaGrade10 !== undefined && input.gpaGrade11 !== undefined && input.gpaGrade12 !== undefined;

  if (!hasExam) {
    const label = 'Điểm thi (thang 30) — trực tiếp hoặc quy đổi từ ĐGNL/V-SAT.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'ueh-exam-score-30', label });
  }
  if (!hasGpa) {
    const label = 'Điểm trung bình 3 năm học THPT (lớp 10, 11, 12).';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'ueh-gpa', label });
  }

  if (!hasExam || !hasGpa) {
    return {
      schoolId: 'ueh',
      year: uehAdmissionMethods[0].year,
      methodId: uehAdmissionMethods[0].id,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần đủ điểm thi và học bạ 3 năm để tính điểm xét tuyển.'] },
      missingInputs,
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: evidenceBase,
    };
  }

  const result = calculateUehExactScore({
    examScore30: input.examScore30!,
    gpaGrade10: input.gpaGrade10!,
    gpaGrade11: input.gpaGrade11!,
    gpaGrade12: input.gpaGrade12!,
    bonusIds: input.bonusIds ?? [],
    priorityZone: input.priorityZone ?? 'kv3',
    priorityObjectGroup: input.priorityObjectGroup ?? 'none',
  });

  explanation.push(
    {
      id: 'ueh-exam-scale-100',
      label: 'Điểm thi quy đổi thang 100',
      inputs: { examScore30: input.examScore30! },
      output: result.examScaled100,
      scale: 100,
      formula: 'Điểm thi (thang 30) × 100/30',
      evidence: uehFinalConversionEvidence.evidence,
    },
    {
      id: 'ueh-transcript-scale-100',
      label: 'Điểm học bạ quy đổi thang 100',
      inputs: { gpaGrade10: input.gpaGrade10!, gpaGrade11: input.gpaGrade11!, gpaGrade12: input.gpaGrade12! },
      output: result.transcriptScaled100,
      scale: 100,
      formula: '((ĐTB lớp10×1 + ĐTB lớp11×2 + ĐTB lớp12×3)/6) × 10',
      evidence: uehFinalConversionEvidence.evidence,
    },
    {
      id: 'ueh-admission-before-bonus',
      label: 'Điểm xét tuyển (chưa gồm điểm cộng/ưu tiên) — dùng để so ngưỡng đầu vào',
      output: result.admissionScoreBeforeBonus,
      scale: 100,
      formula: 'Điểm thi×60% + Điểm học bạ×40%',
    },
    {
      id: 'ueh-bonus',
      label: 'Điểm cộng',
      output: result.bonus.total,
      scale: 10,
      formula: 'MAX(điểm xét thưởng, tối đa 5) + MIN(điểm khuyến khích, tối đa 5)',
      evidence: uehBonusEvidence.evidence,
    },
    {
      id: 'ueh-priority',
      label: 'Điểm ưu tiên KV/ĐT',
      output: result.priority.received,
      formula: result.priority.reduced ? '[(100 − tổng điểm)/25] × mức điểm ưu tiên' : 'Mức điểm ưu tiên trọn vẹn (tổng điểm < 75)',
      evidence: uehPriorityEvidence.evidence,
    },
    {
      id: 'ueh-final',
      label: 'Điểm xét tuyển cuối cùng',
      output: result.finalScore,
      scale: 100,
    }
  );

  const thresholdCheck = checkUehThreshold(result.admissionScoreBeforeBonus, input.campus);

  return {
    schoolId: 'ueh',
    year: uehAdmissionMethods[0].year,
    methodId: uehAdmissionMethods[0].id,
    confidence: 'exact-verified',
    score: { value: result.finalScore, scale: 100 },
    eligibility: {
      status: thresholdCheck.pass ? 'eligible' : 'ineligible',
      reasons: [thresholdCheck.requiredText],
    },
    missingInputs: [],
    missingRules: [],
    explanation,
    evidence: evidenceBase,
  };
}

/**
 * Legacy partial path — vẫn giữ cho use case "tôi đã tự biết điểm xét tuyển thang 100 từ nguồn
 * khác, chỉ muốn check ngưỡng" (không cần nhập lại đủ input exact calculator). KHÔNG suy đoán
 * `score` từ `dgnlScore` một mình — chỉ quy đổi ĐGNL→THPT (thang 30) để dùng làm `examScore30`
 * đầu vào cho `evaluateUehExactAdmission`.
 */
export function evaluateUehAdmission(input: UehPartialInput): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];

  if (input.dgnlScore !== undefined) {
    const thptEquivalent = convertDgnlToThpt(input.dgnlScore);
    explanation.push({
      id: 'dgnl-to-thpt',
      label: 'Quy đổi ĐGNL-HCM sang điểm THPT tương đương',
      inputs: { dgnlScore: input.dgnlScore },
      output: thptEquivalent ?? undefined,
      scale: 30,
      formula: 'Nội suy tuyến tính theo bảng 12 khoảng công bố',
      evidence: uehDgnlConversionEvidence.evidence,
    });
  }

  const eligibility =
    input.knownAdmissionScore100 !== undefined && input.campus
      ? (() => {
          const result = checkUehThreshold(input.knownAdmissionScore100!, input.campus!);
          return {
            status: result.pass ? ('eligible' as const) : ('ineligible' as const),
            reasons: [result.requiredText],
          };
        })()
      : { status: 'unknown' as const, reasons: ['Cần biết điểm xét tuyển thang 100 từ nguồn khác để so sánh ngưỡng.'] };

  return {
    schoolId: 'ueh',
    year: uehAdmissionMethods[0].year,
    methodId: uehAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility,
    missingInputs: [],
    missingRules: [],
    explanation,
    evidence: uehDgnlConversionEvidence.evidence,
  };
}
