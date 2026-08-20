import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { iuhAdmissionMethods } from './methods';
import { checkIuhStandardThreshold } from './eligibility';
import {
  calculateIuhThptTotal,
  calculateIuhTranscriptTotal,
  calculateIuhDgnlConverted,
  calculateIuhAcademicScore,
  calculateIuhXt1,
  calculateIuhXt2,
  calculateIuhXt3,
  calculateIuhCombinedFinalScore,
} from './calculator';
import { calculateIuhPriority30, lookupIuhStandardPriority30 } from './priority';
import { calculateIuhReward30, calculateIuhTotalBonus30, type IuhRewardInput } from './bonus';
import { iuhFormulaEvidence, iuhThresholdEvidence, iuhPriorityEvidence, iuhBonusEvidence } from './evidence';

const METHOD_ID = iuhAdmissionMethods[0].id;
const YEAR = iuhAdmissionMethods[0].year;

export interface IuhSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface IuhEvaluationContext {
  subjectContext?: IuhSubjectContext;
  /** Điểm khuyến khích Phụ lục 2 — mốc IELTS đã quy đổi (nếu chứng chỉ khác, caller tự quy đổi trước
   * qua bảng Phụ lục 2 mục 3, module không tự tra ngược). Bỏ trống = không có chứng chỉ. */
  englishEncouragement30?: number;
  /** Điểm xét thưởng Phụ lục 1 (4/7 dòng tự chứa) — bỏ trống = không có thành tích thuộc 4 dòng này. */
  reward?: IuhRewardInput;
}

function partial(input: { missingInputs: string[]; missingRequirements: MissingRequirement[]; explanation: CalculationStep[]; eligibilityReason: string; evidence?: AdmissionEvaluation['evidence'] }): AdmissionEvaluation {
  return {
    schoolId: 'iuh',
    year: YEAR,
    methodId: METHOD_ID,
    confidence: 'partial',
    eligibility: { status: 'unknown', reasons: [input.eligibilityReason] },
    missingInputs: input.missingInputs,
    missingRules: [],
    missingRequirements: input.missingRequirements,
    explanation: input.explanation,
    evidence: input.evidence ?? [],
  };
}

/**
 * Xét tuyển kết hợp IUH 2026 — thang 30, phạm vi Trụ sở chính TP.HCM/chương trình Chuẩn. ĐXT =
 * Max(XT1;XT2;XT3) đầy đủ cả 3 nhánh (batch 2026-08-20 đóng gap ĐTK, xem `calculator.ts:IUH_DTK_2026`)
 * — nếu thí sinh có điểm ĐGNL (`profile.exams?.vact?.total`), ĐĐGNL được quy đổi và dùng cả trong ĐK
 * (nhánh XT1) lẫn XT3.
 */
export function evaluateIuhCombinedAdmission(profile: ApplicantProfile, context: IuhEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'iuh-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển IUH.' });
    return partial({ missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.' });
  }

  const { subjects } = context.subjectContext;
  const thptScores: number[] = [];
  const transcriptScores: number[] = [];
  const missingThpt: SubjectId[] = [];
  const missingTranscript: SubjectId[] = [];
  for (const subjectId of subjects) {
    const thptScore = profile.thpt?.scores?.[subjectId];
    if (thptScore === undefined) missingThpt.push(subjectId);
    else thptScores.push(thptScore);

    const transcriptScore = profile.transcript?.grade12?.[subjectId];
    if (transcriptScore === undefined) missingTranscript.push(subjectId);
    else transcriptScores.push(transcriptScore);
  }

  if (missingThpt.length > 0) {
    missingRequirements.push(...missingThpt.map((s) => ({ kind: 'profile-input' as const, code: `iuh-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial({ missingInputs: ['Chưa đủ điểm 3 môn thi TN THPT theo tổ hợp (cần cho ĐTN — XT2 và ĐK trong XT1).'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn thi TN THPT để kiểm tra ngưỡng và tính điểm.' });
  }

  const thptTotal30 = calculateIuhThptTotal({ subject1Score: thptScores[0], subject2Score: thptScores[1], subject3Score: thptScores[2] });
  const threshold = checkIuhStandardThreshold(thptTotal30);
  explanation.push({ id: 'iuh-eligibility-threshold', label: 'Ngưỡng đầu vào', output: thptTotal30, scale: 30, formula: threshold.requiredText, evidence: iuhThresholdEvidence.evidence });
  explanation.push({ id: 'iuh-dtn', label: 'ĐTN — tổng thô 3 môn thi TN THPT', output: thptTotal30, scale: 30, formula: 'MT1 + MT2 + MT3', evidence: iuhFormulaEvidence.evidence });

  const vactScore = profile.exams?.vact?.total;
  let dgnlConverted30: number | undefined;
  if (vactScore !== undefined) {
    dgnlConverted30 = calculateIuhDgnlConverted(vactScore);
    explanation.push({
      id: 'iuh-ddgnl',
      label: 'ĐĐGNL — quy đổi điểm ĐGNL ĐHQG-HCM sang thang 30',
      output: dgnlConverted30,
      scale: 30,
      formula: `(Kết quả ĐGNL × 30) / ĐTK (ĐTK 2026 = 1139)`,
      evidence: iuhFormulaEvidence.evidence,
    });
  }

  const standardPriority30 = lookupIuhStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateIuhPriority30({ academicScore30: thptTotal30, standardPriority30 });
  explanation.push({
    id: 'iuh-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Học lực)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: iuhPriorityEvidence.evidence,
  });

  const reward = calculateIuhReward30(context.reward ?? {});
  const bonus30 = calculateIuhTotalBonus30({ reward30: reward.total30, encouragement30: context.englishEncouragement30 ?? 0 });
  explanation.push({
    id: 'iuh-bonus',
    label: 'Điểm cộng (Điểm xét thưởng + Điểm khuyến khích)',
    output: bonus30,
    scale: 30,
    formula: 'min(1,5; xét thưởng) + khuyến khích',
    evidence: iuhBonusEvidence.evidence,
  });

  const academicScore30 = calculateIuhAcademicScore({ thptTotal30, dgnlConverted30 });
  if (dgnlConverted30 !== undefined && academicScore30 === dgnlConverted30 && dgnlConverted30 !== thptTotal30) {
    explanation.push({ id: 'iuh-dk', label: 'ĐK — Max(ĐTN, ĐĐGNL)', output: academicScore30, scale: 30, formula: 'Max(ĐTN; ĐĐGNL)', evidence: iuhFormulaEvidence.evidence });
  }

  let xt1: number | undefined;
  const xt1FormulaNote = 'Cần đủ điểm 3 môn học bạ lớp 12 theo tổ hợp để tính XT1.';
  if (missingTranscript.length === 0) {
    const transcriptTotal30 = calculateIuhTranscriptTotal({ subject1Score: transcriptScores[0], subject2Score: transcriptScores[1], subject3Score: transcriptScores[2] });
    explanation.push({ id: 'iuh-dhb', label: 'ĐHB — tổng thô 3 môn học bạ lớp 12', output: transcriptTotal30, scale: 30, formula: 'HB1 + HB2 + HB3', evidence: iuhFormulaEvidence.evidence });
    xt1 = calculateIuhXt1({ academicScore30, transcriptTotal30, priority30: priority.effectivePriority30, bonus30 });
    explanation.push({ id: 'iuh-xt1', label: 'XT1 (kết hợp học bạ + thi TN THPT)', output: xt1, scale: 30, formula: '0.7×ĐK + 0.3×ĐHB + Đ(Kv;Đt) + ĐC', evidence: iuhFormulaEvidence.evidence });
  } else {
    missingRequirements.push(...missingTranscript.map((s) => ({ kind: 'profile-input' as const, code: `iuh-transcript-${s}`, label: `Điểm học bạ lớp 12 môn ${SUBJECT_LABELS[s]} (dùng cho XT1).` })));
  }

  const xt2 = calculateIuhXt2({ thptTotal30, priority30: priority.effectivePriority30, bonus30 });
  explanation.push({ id: 'iuh-xt2', label: 'XT2 (xét kết quả thi TN THPT)', output: xt2, scale: 30, formula: 'ĐTN + Đ(Kv;Đt) + ĐC', evidence: iuhFormulaEvidence.evidence });

  let xt3: number | undefined;
  if (dgnlConverted30 !== undefined) {
    xt3 = calculateIuhXt3({ dgnlConverted30, priority30: priority.effectivePriority30, bonus30 });
    explanation.push({ id: 'iuh-xt3', label: 'XT3 (xét kết quả ĐGNL)', output: xt3, scale: 30, formula: 'ĐĐGNL + Đ(Kv;Đt) + ĐC', evidence: iuhFormulaEvidence.evidence });
  }

  const finalScore = calculateIuhCombinedFinalScore({ xt1: xt1 ?? -Infinity, xt2, xt3 });
  explanation.push({ id: 'iuh-final', label: 'ĐXT — Điểm xét tuyển cuối cùng', output: finalScore, scale: 30, formula: 'Max(XT1;XT2;XT3)' });

  if (xt1 === undefined) {
    return {
      schoolId: 'iuh',
      year: YEAR,
      methodId: METHOD_ID,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: [xt1FormulaNote],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [...iuhThresholdEvidence.evidence, ...iuhFormulaEvidence.evidence, ...iuhPriorityEvidence.evidence, ...iuhBonusEvidence.evidence],
    };
  }

  return {
    schoolId: 'iuh',
    year: YEAR,
    methodId: METHOD_ID,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...iuhThresholdEvidence.evidence, ...iuhFormulaEvidence.evidence, ...iuhPriorityEvidence.evidence, ...iuhBonusEvidence.evidence],
  };
}
