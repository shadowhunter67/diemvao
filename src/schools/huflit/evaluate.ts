import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { huflitAdmissionMethods } from './methods';
import { checkHuflitPt1Threshold, checkHuflitPt2Threshold, checkHuflitPt3Threshold, HUFLIT_LAW_PROGRAM_IDS } from './eligibility';
import { calculateHuflitPt1RawScore, calculateHuflitPt2RawScore, calculateHuflitFinalScore30, calculateHuflitPt3FinalScore } from './calculator';
import { calculateHuflitPriority30, calculateHuflitPriority1200, lookupHuflitStandardPriority30 } from './priority';
import { huflitFormulaEvidence, huflitThresholdEvidence, huflitPriorityEvidence } from './evidence';

export interface HuflitSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function isLaw(programId: string | undefined): boolean {
  return programId !== undefined && HUFLIT_LAW_PROGRAM_IDS.has(programId);
}

function partial(methodId: string, year: number, input: { missingInputs: string[]; missingRequirements: MissingRequirement[]; explanation: CalculationStep[]; eligibilityReason: string }): AdmissionEvaluation {
  return {
    schoolId: 'huflit',
    year,
    methodId,
    confidence: 'partial',
    eligibility: { status: 'unknown', reasons: [input.eligibilityReason] },
    missingInputs: input.missingInputs,
    missingRules: [],
    missingRequirements: input.missingRequirements,
    explanation: input.explanation,
    evidence: [],
  };
}

export interface HuflitPt1EvaluationContext {
  subjectContext?: HuflitSubjectContext;
  programId?: string;
  /** `false`/bỏ trống = không có thành tích cộng điểm (ĐC=0, tính exact được). `true` = có thành
   * tích nhưng mức cộng cụ thể chưa công bố (`knowledgeGaps.ts`) — kết quả vẫn `partial`. */
  hasBonusAchievement?: boolean;
}

/** PT1 — thi THPT, thang 30. Điểm học lực = tổng thô 3 môn (không nhân hệ số). Exact khi
 * `hasBonusAchievement` không phải `true` (cùng semantics USSH `hasBonusAchievement`). */
export function evaluateHuflitPt1Admission(profile: ApplicantProfile, context: HuflitPt1EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = huflitAdmissionMethods[0].id;
  const year = huflitAdmissionMethods[0].year;

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'huflit-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển HUFLIT.' });
    return partial(methodId, year, { missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.' });
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
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `huflit-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm 3 môn thi THPT theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn để kiểm tra ngưỡng.' });
  }

  const raw30 = calculateHuflitPt1RawScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  const lawProgram = isLaw(context.programId);
  const threshold = checkHuflitPt1Threshold(raw30, lawProgram);
  explanation.push({ id: 'huflit-eligibility-threshold', label: 'Ngưỡng đầu vào PT1', output: raw30, scale: 30, formula: threshold.requiredText, evidence: huflitThresholdEvidence.evidence });
  explanation.push({ id: 'huflit-academic-score', label: 'Điểm học lực (tổng thô 3 môn)', output: raw30, scale: 30, formula: 'MT1 + MT2 + MT3', evidence: huflitFormulaEvidence.evidence });

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'huflit-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'huflit',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm thưởng/khuyến khích cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm thưởng/điểm khuyến khích HUFLIT chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...huflitFormulaEvidence.evidence, ...huflitThresholdEvidence.evidence],
    };
  }

  const standardPriority30 = lookupHuflitStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHuflitPriority30({ academicPlusBonus30: raw30, standardPriority30 });
  explanation.push({
    id: 'huflit-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Học lực – Cộng)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: huflitPriorityEvidence.evidence,
  });

  const finalScore = calculateHuflitFinalScore30({ raw30, bonus30: 0, priority30: priority.effectivePriority30 });
  explanation.push({ id: 'huflit-final', label: 'Điểm xét tuyển PT1 cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'huflit',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...huflitFormulaEvidence.evidence, ...huflitThresholdEvidence.evidence, ...huflitPriorityEvidence.evidence],
  };
}

export interface HuflitPt2EvaluationContext {
  subjectContext?: HuflitSubjectContext;
  programId?: string;
  hasBonusAchievement?: boolean;
}

/** PT2 — học bạ, thang 30. Cần điểm thi THPT (điều kiện tiên quyết ≥15/30) VÀ điểm TB 3 năm theo
 * tổ hợp. Điểm xét tuyển dùng điểm TB 3 năm (không phải điểm thi). Exact cùng semantics PT1. */
export function evaluateHuflitPt2Admission(profile: ApplicantProfile, context: HuflitPt2EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = huflitAdmissionMethods[1].id;
  const year = huflitAdmissionMethods[1].year;

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'huflit-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển HUFLIT.' });
    return partial(methodId, year, { missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.' });
  }

  const { subjects } = context.subjectContext;
  const thptScores: number[] = [];
  const transcriptScores: number[] = [];
  const missing: string[] = [];
  for (const subjectId of subjects) {
    const thptScore = profile.thpt?.scores?.[subjectId];
    if (thptScore === undefined) missing.push(`huflit-thpt-${subjectId}`);
    else thptScores.push(thptScore);

    const g10 = profile.transcript?.grade10?.[subjectId];
    const g11 = profile.transcript?.grade11?.[subjectId];
    const g12 = profile.transcript?.grade12?.[subjectId];
    const values = [g10, g11, g12].filter((v): v is number => v !== undefined);
    if (values.length === 0) missing.push(`huflit-transcript-${subjectId}`);
    else transcriptScores.push(values.reduce((s, v) => s + v, 0) / values.length);
  }
  if (missing.length > 0) {
    missingRequirements.push(
      ...missing.map((code) => ({
        kind: 'profile-input' as const,
        code,
        label: code.startsWith('huflit-thpt-')
          ? `Điểm thi TN THPT môn ${SUBJECT_LABELS[code.replace('huflit-thpt-', '') as SubjectId]}.`
          : `Điểm học bạ (10/11/12) môn ${SUBJECT_LABELS[code.replace('huflit-transcript-', '') as SubjectId]}.`,
      }))
    );
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm thi THPT và/hoặc điểm học bạ theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm THPT + học bạ để kiểm tra ngưỡng PT2.' });
  }

  const thptTotal30 = Math.round(thptScores.reduce((s, v) => s + v, 0) * 100) / 100;
  const transcriptRaw30 = calculateHuflitPt2RawScore({ subject1Score: transcriptScores[0], subject2Score: transcriptScores[1], subject3Score: transcriptScores[2] });
  const lawProgram = isLaw(context.programId);
  const threshold = checkHuflitPt2Threshold({ thptTotal30, transcriptTotal30: transcriptRaw30, isLawProgram: lawProgram });
  explanation.push({ id: 'huflit-eligibility-threshold', label: 'Ngưỡng đầu vào PT2', output: transcriptRaw30, scale: 30, formula: threshold.requiredText, evidence: huflitThresholdEvidence.evidence });
  explanation.push({ id: 'huflit-academic-score', label: 'Điểm học lực (tổng thô TB 3 môn 3 năm)', output: transcriptRaw30, scale: 30, formula: 'TB(MH1) + TB(MH2) + TB(MH3)', evidence: huflitFormulaEvidence.evidence });

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'huflit-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'huflit',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm thưởng/khuyến khích cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm thưởng/điểm khuyến khích HUFLIT chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...huflitFormulaEvidence.evidence, ...huflitThresholdEvidence.evidence],
    };
  }

  const standardPriority30 = lookupHuflitStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHuflitPriority30({ academicPlusBonus30: transcriptRaw30, standardPriority30 });
  explanation.push({
    id: 'huflit-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Học lực – Cộng)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: huflitPriorityEvidence.evidence,
  });

  const finalScore = calculateHuflitFinalScore30({ raw30: transcriptRaw30, bonus30: 0, priority30: priority.effectivePriority30 });
  explanation.push({ id: 'huflit-final', label: 'Điểm xét tuyển PT2 cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'huflit',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...huflitFormulaEvidence.evidence, ...huflitThresholdEvidence.evidence, ...huflitPriorityEvidence.evidence],
  };
}

export interface HuflitPt3EvaluationContext {
  programId?: string;
}

/** PT3 — ĐGNL ĐHQG-HCM, thang 1200. Không có thành phần Điểm cộng ở phương thức này — luôn exact
 * khi có điểm ĐGNL. Đọc từ hồ sơ dùng chung `profile.exams.vact.total`. */
export function evaluateHuflitPt3Admission(profile: ApplicantProfile, context: HuflitPt3EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = huflitAdmissionMethods[2].id;
  const year = huflitAdmissionMethods[2].year;

  const dgnlScore1200 = profile.exams?.vact?.total;
  if (dgnlScore1200 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'huflit-dgnl-total', label: 'Tổng điểm ĐGNL ĐHQG-HCM (thang 1200).' });
    return partial(methodId, year, { missingInputs: ['Điểm ĐGNL ĐHQG-HCM (thang 1200).'], missingRequirements, explanation, eligibilityReason: 'Cần điểm ĐGNL để tính điểm xét tuyển.' });
  }

  const lawProgram = isLaw(context.programId);
  const threshold = checkHuflitPt3Threshold(dgnlScore1200, lawProgram);
  explanation.push({ id: 'huflit-pt3-eligibility-threshold', label: 'Ngưỡng đầu vào PT3 (ĐGNL)', output: dgnlScore1200, scale: 1200, formula: threshold.requiredText, evidence: huflitThresholdEvidence.evidence });

  const standardPriority30 = lookupHuflitStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHuflitPriority1200({ dgnlScore1200, standardPriority30 });
  explanation.push({
    id: 'huflit-pt3-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority1200,
    scale: 1200,
    formula: priority.reduced ? '[(1200 – Tổng điểm ĐGNL)/300] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: huflitPriorityEvidence.evidence,
  });

  const finalScore = calculateHuflitPt3FinalScore({ dgnlScore1200, priority1200: priority.effectivePriority1200 });
  explanation.push({ id: 'huflit-pt3-final', label: 'Điểm xét tuyển PT3 (ĐGNL) cuối cùng', output: finalScore, scale: 1200 });

  return {
    schoolId: 'huflit',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 1200 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...huflitThresholdEvidence.evidence, ...huflitPriorityEvidence.evidence],
  };
}
