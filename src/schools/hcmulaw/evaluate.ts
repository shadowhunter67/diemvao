import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hcmulawAdmissionMethods } from './methods';
import { hcmulawKnowledgeGaps } from './knowledgeGaps';
import { findHcmulawProgram, findHcmulawCombination, type HcmulawProgramId } from './programs';
import { checkHcmulawThreshold, checkHcmulawThpt5Threshold } from './eligibility';
import { calculateHcmulawSubjectGroupScore, calculateHcmulawThpt5FinalScore, calculateHcmulawVsat4SubjectGroupScore, calculateHcmulawVsat4FinalScore } from './calculator';
import { calculateHcmulawPriority30, lookupHcmulawStandardPriority30 } from './priority';
import { convertHcmulawVsatSubjectScore } from './conversionTable';
import { hcmulawFormulaEvidence, hcmulawThresholdEvidence, hcmulawPriorityEvidence, hcmulawVsatConversionEvidence } from './evidence';

function partial(methodId: string, year: number, input: { missingInputs: string[]; missingRequirements: MissingRequirement[]; explanation: CalculationStep[]; eligibilityReason: string }): AdmissionEvaluation {
  return {
    schoolId: 'hcmulaw',
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

function unavailableForHocbaGranularityGap(methodId: string, year: number): AdmissionEvaluation {
  const gap = hcmulawKnowledgeGaps.find((g) => g.id === 'hcmulaw-hocba-semester-granularity-gap')!;
  return {
    schoolId: 'hcmulaw',
    year,
    methodId,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: [gap.label] },
    missingInputs: ['Điểm học bạ theo TỪNG HỌC KỲ (6 học kỳ lớp 10/11/12) — hồ sơ dùng chung chỉ lưu TB cả năm, không đủ granularity cho công thức quy đổi y=x-k của HCMULAW.'],
    missingRules: [gap.label],
    missingRequirements: [{ kind: 'unsupported', code: gap.id, label: gap.label }],
    explanation: [],
    evidence: [],
  };
}

export interface HcmulawThpt5EvaluationContext {
  programId?: HcmulawProgramId;
  combinationCode?: string;
}

/** Phương thức 5 (mã 100, xét kết quả thi TN THPT 2026) — thang 30. Điểm tổ hợp môn = tổng thô 3
 * môn theo tổ hợp (không nhân hệ số), điểm cộng = 0 (PT5 không có điểm cộng), điểm ưu tiên theo
 * bảng chuẩn quốc gia (giảm dần khi tổng ≥ 22,5/30). */
export function evaluateHcmulawThpt5Admission(profile: ApplicantProfile, context: HcmulawThpt5EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = hcmulawAdmissionMethods[3].id;
  const year = hcmulawAdmissionMethods[3].year;

  if (!context.programId) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-program', label: 'Chọn ngành xét tuyển HCMULAW.' });
    return partial(methodId, year, { missingInputs: ['Chọn ngành xét tuyển.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn ngành để tra ngưỡng đầu vào.' });
  }

  const program = findHcmulawProgram(context.programId);
  if (!program) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-program', label: 'Ngành xét tuyển không hợp lệ.' });
    return partial(methodId, year, { missingInputs: ['Chọn ngành xét tuyển hợp lệ.'], missingRequirements, explanation, eligibilityReason: 'Ngành không tồn tại trong danh mục đã import.' });
  }

  const combination = findHcmulawCombination(program, context.combinationCode);
  if (!combination) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-combination', label: 'Chọn tổ hợp 3 môn xét tuyển thuộc ngành đã chọn.' });
    return partial(methodId, year, { missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để tính điểm.' });
  }

  const subjects: readonly SubjectId[] = combination.subjects;
  const scores: number[] = [];
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else scores.push(score);
  }
  if (missingSubjects.length > 0) {
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `hcmulaw-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm 3 môn thi THPT theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn để tính điểm.' });
  }

  const subjectGroupScore30 = calculateHcmulawSubjectGroupScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  explanation.push({
    id: 'hcmulaw-subject-group',
    label: 'Điểm tổ hợp môn (tổng thô 3 môn)',
    output: subjectGroupScore30,
    scale: 30,
    formula: `${SUBJECT_LABELS[subjects[0]]} + ${SUBJECT_LABELS[subjects[1]]} + ${SUBJECT_LABELS[subjects[2]]}`,
    evidence: hcmulawFormulaEvidence.evidence,
  });

  const standardPriority30 = lookupHcmulawStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHcmulawPriority30({ academicScore30: subjectGroupScore30, standardPriority30 });
  explanation.push({
    id: 'hcmulaw-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Điểm tổ hợp môn)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: hcmulawPriorityEvidence.evidence,
  });

  const finalScore = calculateHcmulawThpt5FinalScore({ subjectGroupScore30, priority30: priority.effectivePriority30 });
  explanation.push({ id: 'hcmulaw-final', label: 'Điểm xét tuyển (Phương thức 5) cuối cùng', output: finalScore, scale: 30 });

  const threshold = checkHcmulawThpt5Threshold(finalScore, program.id);
  explanation.push({ id: 'hcmulaw-eligibility-threshold', label: 'Ngưỡng đầu vào', output: finalScore, scale: 30, formula: threshold.requiredText, evidence: hcmulawThresholdEvidence.evidence });

  return {
    schoolId: 'hcmulaw',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...hcmulawFormulaEvidence.evidence, ...hcmulawThresholdEvidence.evidence, ...hcmulawPriorityEvidence.evidence],
  };
}

/** Phương thức 2 (mã 410, kết hợp học bạ + chứng chỉ/SAT) — LUÔN `unavailable`: công thức quy đổi
 * y=x-k đã có (batch 2026-08-20) nhưng x cần TB học bạ theo 6 học kỳ, granularity hồ sơ dùng chung
 * không đáp ứng, xem `knowledgeGaps.ts:hcmulaw-hocba-semester-granularity-gap`. */
export function evaluateHcmulawCombined2Admission(): AdmissionEvaluation {
  return unavailableForHocbaGranularityGap(hcmulawAdmissionMethods[0].id, hcmulawAdmissionMethods[0].year);
}

/** Phương thức 3 (mã 200, học bạ trường ưu tiên ĐHQG-HCM) — LUÔN `unavailable`, cùng lý do Phương
 * thức 2. */
export function evaluateHcmulawPriorityHighschool3Admission(): AdmissionEvaluation {
  return unavailableForHocbaGranularityGap(hcmulawAdmissionMethods[1].id, hcmulawAdmissionMethods[1].year);
}

export interface HcmulawVsat4EvaluationContext {
  programId?: HcmulawProgramId;
  combinationCode?: string;
  /** Điểm thô V-SAT (thang 150) TỪNG MÔN — key theo `SubjectId` của môn đó trong tổ hợp đã chọn.
   * KHÔNG persist vào `ApplicantProfile` dùng chung (cùng quy ước UFM). */
  vsatScoresBySubject?: Partial<Record<SubjectId, number>>;
}

/** Phương thức 4 (mã 417, V-SAT 2026) — thang 30. "Điểm tổ hợp môn" = tổng 3 điểm môn ĐÃ quy đổi
 * riêng từng môn sang thang thi TN THPT (mục 2.2 Thông báo 9/7/2026, `conversionTable.ts`), + điểm
 * ưu tiên (PT4 không có điểm cộng, cùng PT5). Môn không có bảng quy đổi công bố (Tin học/Công nghệ/
 * GDKTPL — chỉ 7 môn Toán/Văn/Anh/Lý/Hóa/Sử/Địa có bảng) khiến kết quả `unsupported`. */
export function evaluateHcmulawVsat4Admission(profile: ApplicantProfile, context: HcmulawVsat4EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = hcmulawAdmissionMethods[2].id;
  const year = hcmulawAdmissionMethods[2].year;

  if (!context.programId) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-program', label: 'Chọn ngành xét tuyển HCMULAW.' });
    return partial(methodId, year, { missingInputs: ['Chọn ngành xét tuyển.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn ngành để tra ngưỡng đầu vào.' });
  }

  const program = findHcmulawProgram(context.programId);
  if (!program) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-program', label: 'Ngành xét tuyển không hợp lệ.' });
    return partial(methodId, year, { missingInputs: ['Chọn ngành xét tuyển hợp lệ.'], missingRequirements, explanation, eligibilityReason: 'Ngành không tồn tại trong danh mục đã import.' });
  }

  const combination = findHcmulawCombination(program, context.combinationCode);
  if (!combination) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmulaw-combination', label: 'Chọn tổ hợp 3 môn xét tuyển thuộc ngành đã chọn.' });
    return partial(methodId, year, { missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để tính điểm.' });
  }

  const subjects: readonly SubjectId[] = combination.subjects;
  const unsupportedSubjects = subjects.filter((s) => convertHcmulawVsatSubjectScore(s, 150) === undefined);
  if (unsupportedSubjects.length > 0) {
    missingRequirements.push({
      kind: 'unsupported',
      code: 'hcmulaw-vsat-subject-table-missing',
      label: `Bảng quy đổi V-SAT chưa công bố cho môn ${unsupportedSubjects.map((s) => SUBJECT_LABELS[s]).join(', ')} — chỉ 7 môn Toán/Ngữ văn/Tiếng Anh/Vật lý/Hoá học/Lịch sử/Địa lý có bảng.`,
    });
    return partial(methodId, year, { missingInputs: ['Tổ hợp có môn chưa có bảng quy đổi V-SAT.'], missingRequirements, explanation, eligibilityReason: 'Không đủ bảng quy đổi cho tổ hợp này.' });
  }

  const rawScores: number[] = [];
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = context.vsatScoresBySubject?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else rawScores.push(score);
  }
  if (missingSubjects.length > 0) {
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `hcmulaw-vsat-${s}`, label: `Điểm bài thi V-SAT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm 3 môn V-SAT theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn V-SAT để tính điểm.' });
  }

  const converted: number[] = [];
  for (let i = 0; i < subjects.length; i++) {
    const y = convertHcmulawVsatSubjectScore(subjects[i], rawScores[i]);
    if (y === undefined) {
      missingRequirements.push({ kind: 'unsupported', code: `hcmulaw-vsat-out-of-range-${subjects[i]}`, label: `Điểm V-SAT môn ${SUBJECT_LABELS[subjects[i]]} nằm ngoài phạm vi bảng quy đổi công bố.` });
      return partial(methodId, year, { missingInputs: ['Điểm nằm ngoài bảng quy đổi.'], missingRequirements, explanation, eligibilityReason: 'Điểm V-SAT nằm ngoài phạm vi bảng quy đổi.' });
    }
    converted.push(y);
    explanation.push({
      id: `hcmulaw-vsat-conversion-${subjects[i]}`,
      label: `Điểm môn ${SUBJECT_LABELS[subjects[i]]} — quy đổi tương đương thi TN THPT`,
      output: y,
      scale: 10,
      formula: 'y = c + (x-a)(d-c)/(b-a)',
      evidence: hcmulawVsatConversionEvidence.evidence,
    });
  }

  const subjectGroupScore30 = calculateHcmulawVsat4SubjectGroupScore({ subject1Converted10: converted[0], subject2Converted10: converted[1], subject3Converted10: converted[2] });
  explanation.push({
    id: 'hcmulaw-vsat-subject-group',
    label: 'Điểm tổ hợp môn (tổng 3 môn đã quy đổi)',
    output: subjectGroupScore30,
    scale: 30,
    formula: `${SUBJECT_LABELS[subjects[0]]} + ${SUBJECT_LABELS[subjects[1]]} + ${SUBJECT_LABELS[subjects[2]]} (đã quy đổi)`,
    evidence: hcmulawVsatConversionEvidence.evidence,
  });

  const standardPriority30 = lookupHcmulawStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHcmulawPriority30({ academicScore30: subjectGroupScore30, standardPriority30 });
  explanation.push({
    id: 'hcmulaw-vsat-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Điểm tổ hợp môn)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: hcmulawPriorityEvidence.evidence,
  });

  const finalScore = calculateHcmulawVsat4FinalScore({ subjectGroupScore30, priority30: priority.effectivePriority30 });
  explanation.push({ id: 'hcmulaw-vsat-final', label: 'Điểm xét tuyển (Phương thức 4) cuối cùng', output: finalScore, scale: 30 });

  const threshold = checkHcmulawThreshold(finalScore, program.id, 'Phương thức 4, V-SAT 2026');
  explanation.push({ id: 'hcmulaw-vsat-eligibility-threshold', label: 'Ngưỡng đầu vào', output: finalScore, scale: 30, formula: threshold.requiredText, evidence: hcmulawThresholdEvidence.evidence });

  return {
    schoolId: 'hcmulaw',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...hcmulawVsatConversionEvidence.evidence, ...hcmulawThresholdEvidence.evidence, ...hcmulawPriorityEvidence.evidence],
  };
}
