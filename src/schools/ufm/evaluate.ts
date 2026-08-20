import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { ufmAdmissionMethods } from './methods';
import { checkUfmThptThreshold, checkUfmHocbaThreshold, checkUfmDgnlThreshold, checkUfmVsatThreshold, type UfmThresholdGroup } from './eligibility';
import { calculateUfmThptRawScore, calculateUfmHocbaRawScore, calculateUfmThptFinalScore } from './calculator';
import { calculateUfmPriority30, lookupUfmStandardPriority30 } from './priority';
import { ufmFormulaEvidence, ufmThresholdEvidence, ufmPriorityEvidence, ufmBonusEvidence, ufmConversionEvidence } from './evidence';
import { calculateUfmBonus30, type UfmBonusInput } from './bonus';
import { convertUfmScoreToThpt30, UFM_HOCBA_CONVERSION_TABLE, UFM_DGNL_CONVERSION_TABLE, UFM_VSAT_CONVERSION_TABLE } from './conversionTable';

/** TB 3 năm lớp 10/11/12 mỗi môn — khớp trực tiếp công thức chính thức học bạ UFM (verified
 * 2026-08-19: "ĐTB TRUNG BÌNH CẢ 3 NĂM", không phải xấp xỉ 6HK như TDTU/HUTECH). */
function averageYearlyTranscript(profile: ApplicantProfile, subjectId: SubjectId): number | undefined {
  const g10 = profile.transcript?.grade10?.[subjectId];
  const g11 = profile.transcript?.grade11?.[subjectId];
  const g12 = profile.transcript?.grade12?.[subjectId];
  const values = [g10, g11, g12].filter((v): v is number => v !== undefined);
  if (values.length !== 3) return undefined;
  return values.reduce((sum, v) => sum + v, 0) / 3;
}

export interface UfmSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function partial(methodId: string, year: number, input: { missingInputs: string[]; missingRequirements: MissingRequirement[]; explanation: CalculationStep[]; eligibilityReason: string }): AdmissionEvaluation {
  return {
    schoolId: 'ufm',
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

export interface UfmThptEvaluationContext {
  subjectContext?: UfmSubjectContext;
  thresholdGroup?: UfmThresholdGroup;
  /** b1/b2/b3 — bảng điểm cộng verified 2026-08-19 (`evidence.ts:ufmBonusEvidence`). Bỏ trống = không
   * có thành tích cộng điểm (ĐC=0). */
  bonus?: UfmBonusInput;
}

/** Xét THPT (chương trình Chuẩn) — thang 30. Điểm học lực = tổng thô 3 môn (không nhân hệ số — hệ số
 * Toán×2 CHỈ áp dụng chương trình Tiếng Anh toàn phần, verified 2026-08-19, ngoài phạm vi module này
 * vốn chỉ phục vụ chương trình Chuẩn). Với `thresholdGroup: 'law-economics'`, cần thêm điểm Toán ≥6
 * và không môn nào <1 — nếu thiếu 1 trong 2 raw score đó, ngưỡng coi là CHƯA xác nhận (fail an toàn). */
export function evaluateUfmThptAdmission(profile: ApplicantProfile, context: UfmThptEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = ufmAdmissionMethods[0].id;
  const year = ufmAdmissionMethods[0].year;
  const group: UfmThresholdGroup = context.thresholdGroup ?? 'standard';

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'ufm-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển UFM.' });
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
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `ufm-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm 3 môn thi THPT theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn để kiểm tra ngưỡng.' });
  }

  const raw30 = calculateUfmThptRawScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  const mathRawScore = subjects.includes('math') ? profile.thpt?.scores?.math : undefined;
  const threshold = checkUfmThptThreshold({ total30: raw30, group, mathRawScore, subjectRawScores: scores });
  explanation.push({ id: 'ufm-eligibility-threshold', label: 'Ngưỡng đầu vào (xét THPT)', output: raw30, scale: 30, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });
  explanation.push({ id: 'ufm-academic-score', label: 'Điểm học lực (tổng thô 3 môn)', output: raw30, scale: 30, formula: 'MT1 + MT2 + MT3', evidence: ufmFormulaEvidence.evidence });

  const standardPriority30 = lookupUfmStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUfmPriority30({ academicScore30: raw30, standardPriority30 });
  explanation.push({
    id: 'ufm-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Học lực)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: ufmPriorityEvidence.evidence,
  });

  const bonus = calculateUfmBonus30(context.bonus ?? {});
  explanation.push({
    id: 'ufm-bonus',
    label: 'Điểm cộng (b1 thành tích + b2 xét thưởng + b3 chứng chỉ Tiếng Anh)',
    output: bonus.total30,
    scale: 30,
    formula: 'min(3,0; b1 + min(1,5; b2) + min(1,5; b3))',
    evidence: ufmBonusEvidence.evidence,
  });

  const finalScore = calculateUfmThptFinalScore({ raw30, priority30: priority.effectivePriority30, bonus30: bonus.total30 });
  explanation.push({ id: 'ufm-final', label: 'Điểm xét tuyển (xét THPT) cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...ufmFormulaEvidence.evidence, ...ufmThresholdEvidence.evidence, ...ufmPriorityEvidence.evidence, ...ufmBonusEvidence.evidence],
  };
}

export interface UfmHocbaEvaluationContext {
  subjectContext?: UfmSubjectContext;
  thresholdGroup?: UfmThresholdGroup;
  bonus?: UfmBonusInput;
}

/** Xét học bạ (chương trình Chuẩn) — thang 30. Điểm học lực = TB 3 năm × 3 môn tổ hợp
 * (`calculateUfmHocbaRawScore`); nếu đạt ngưỡng (≥18/20), quy đổi sang thang tương đương thi TN
 * THPT 2026 qua bảng bách phân vị (mục 3.1 Thông báo 2639/TB-ĐHTCM, `conversionTable.ts`) rồi cộng
 * ưu tiên/điểm cộng. Dưới ngưỡng: bảng quy đổi KHÔNG phủ khoảng đó (sàn bảng = đúng ngưỡng đầu vào)
 * nên KHÔNG trả `score` — chỉ trường hợp đạt ngưỡng mới có "Điểm xét tuyển" theo đúng nghĩa văn bản
 * gốc (không suy đoán quy đổi ngoài phạm vi bảng công bố). */
export function evaluateUfmHocbaAdmission(profile: ApplicantProfile, context: UfmHocbaEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = ufmAdmissionMethods[1].id;
  const year = ufmAdmissionMethods[1].year;
  const group: UfmThresholdGroup = context.thresholdGroup ?? 'standard';

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'ufm-hocba-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển UFM.' });
    return partial(methodId, year, { missingInputs: ['Chọn tổ hợp 3 môn.'], missingRequirements, explanation, eligibilityReason: 'Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.' });
  }

  const { subjects } = context.subjectContext;
  const scores: number[] = [];
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = averageYearlyTranscript(profile, subjectId);
    if (score === undefined) missingSubjects.push(subjectId);
    else scores.push(score);
  }
  if (missingSubjects.length > 0) {
    missingRequirements.push(
      ...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `ufm-hocba-${s}`, label: `Điểm học bạ cả 3 năm lớp 10/11/12 môn ${SUBJECT_LABELS[s]}.` }))
    );
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm học bạ cả 3 năm theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm học bạ 3 năm để kiểm tra ngưỡng.' });
  }

  const raw30 = calculateUfmHocbaRawScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  const threshold = checkUfmHocbaThreshold(raw30, group);
  explanation.push({ id: 'ufm-hocba-eligibility-threshold', label: 'Ngưỡng đầu vào (xét học bạ)', output: raw30, scale: 30, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });
  explanation.push({ id: 'ufm-hocba-academic-score', label: 'Điểm học lực (TB 3 năm × 3 môn tổ hợp)', output: raw30, scale: 30, formula: 'TB3nam(MT1) + TB3nam(MT2) + TB3nam(MT3)', evidence: ufmFormulaEvidence.evidence });

  if (!threshold.pass) {
    return {
      schoolId: 'ufm',
      year,
      methodId,
      confidence: 'exact-verified',
      eligibility: { status: 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: [],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [...ufmFormulaEvidence.evidence, ...ufmThresholdEvidence.evidence],
    };
  }

  const y = convertUfmScoreToThpt30(raw30, UFM_HOCBA_CONVERSION_TABLE);
  if (y === undefined) {
    missingRequirements.push({ kind: 'unsupported', code: 'ufm-hocba-conversion-out-of-range', label: 'Điểm học bạ nằm ngoài phạm vi bảng quy đổi bách phân vị chính thức.' });
    return partial(methodId, year, { missingInputs: ['Điểm nằm ngoài bảng quy đổi bách phân vị.'], missingRequirements, explanation, eligibilityReason: threshold.requiredText });
  }
  explanation.push({
    id: 'ufm-hocba-conversion',
    label: 'Điểm quy đổi tương đương thi TN THPT 2026',
    output: y,
    scale: 30,
    formula: 'y = c + (x-a)(d-c)/(b-a) — nội suy tuyến tính theo bảng bách phân vị (mục 3.1)',
    evidence: ufmConversionEvidence.evidence,
  });

  const standardPriority30 = lookupUfmStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUfmPriority30({ academicScore30: y, standardPriority30 });
  explanation.push({
    id: 'ufm-hocba-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Điểm quy đổi)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: ufmPriorityEvidence.evidence,
  });

  const bonus = calculateUfmBonus30(context.bonus ?? {});
  explanation.push({
    id: 'ufm-hocba-bonus',
    label: 'Điểm cộng (b1 thành tích + b2 xét thưởng + b3 chứng chỉ Tiếng Anh)',
    output: bonus.total30,
    scale: 30,
    formula: 'min(3,0; b1 + min(1,5; b2) + min(1,5; b3))',
    evidence: ufmBonusEvidence.evidence,
  });

  const finalScore = calculateUfmThptFinalScore({ raw30: y, priority30: priority.effectivePriority30, bonus30: bonus.total30 });
  explanation.push({ id: 'ufm-hocba-final', label: 'Điểm xét tuyển (xét học bạ) cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: 'eligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...ufmFormulaEvidence.evidence, ...ufmThresholdEvidence.evidence, ...ufmConversionEvidence.evidence, ...ufmPriorityEvidence.evidence, ...ufmBonusEvidence.evidence],
  };
}

export interface UfmDgnlEvaluationContext {
  thresholdGroup?: UfmThresholdGroup;
  bonus?: UfmBonusInput;
}

/** Xét ĐGNL ĐHQG TP.HCM 2026 — thang 30. Đọc điểm thô (thang 1200) từ hồ sơ dùng chung
 * `profile.exams.vact.total`; nếu đạt ngưỡng, quy đổi sang thang tương đương thi TN THPT 2026 qua
 * bảng bách phân vị (mục 3.2 Thông báo 2639/TB-ĐHTCM, `conversionTable.ts`) rồi cộng ưu
 * tiên/điểm cộng — cùng cấu trúc với `evaluateUfmHocbaAdmission`, xem comment ở đó về lý do không
 * trả `score` khi dưới ngưỡng. */
export function evaluateUfmDgnlAdmission(profile: ApplicantProfile, context: UfmDgnlEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = ufmAdmissionMethods[3].id;
  const year = ufmAdmissionMethods[3].year;
  const group: UfmThresholdGroup = context.thresholdGroup ?? 'standard';

  const dgnlScore1200 = profile.exams?.vact?.total;
  if (dgnlScore1200 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'ufm-dgnl-total', label: 'Tổng điểm ĐGNL ĐHQG-HCM (thang 1200).' });
    return partial(methodId, year, { missingInputs: ['Điểm ĐGNL ĐHQG-HCM (thang 1200).'], missingRequirements, explanation, eligibilityReason: 'Cần điểm ĐGNL để kiểm tra ngưỡng.' });
  }

  const threshold = checkUfmDgnlThreshold(dgnlScore1200, group);
  explanation.push({ id: 'ufm-dgnl-eligibility-threshold', label: 'Ngưỡng đầu vào (xét ĐGNL)', output: dgnlScore1200, scale: 1200, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });

  if (!threshold.pass) {
    return {
      schoolId: 'ufm',
      year,
      methodId,
      confidence: 'exact-verified',
      eligibility: { status: 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: [],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [...ufmThresholdEvidence.evidence],
    };
  }

  const y = convertUfmScoreToThpt30(dgnlScore1200, UFM_DGNL_CONVERSION_TABLE);
  if (y === undefined) {
    missingRequirements.push({ kind: 'unsupported', code: 'ufm-dgnl-conversion-out-of-range', label: 'Điểm ĐGNL nằm ngoài phạm vi bảng quy đổi bách phân vị chính thức.' });
    return partial(methodId, year, { missingInputs: ['Điểm nằm ngoài bảng quy đổi bách phân vị.'], missingRequirements, explanation, eligibilityReason: threshold.requiredText });
  }
  explanation.push({
    id: 'ufm-dgnl-conversion',
    label: 'Điểm quy đổi tương đương thi TN THPT 2026',
    output: y,
    scale: 30,
    formula: 'y = c + (x-a)(d-c)/(b-a) — nội suy tuyến tính theo bảng bách phân vị (mục 3.2)',
    evidence: ufmConversionEvidence.evidence,
  });

  const standardPriority30 = lookupUfmStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUfmPriority30({ academicScore30: y, standardPriority30 });
  explanation.push({
    id: 'ufm-dgnl-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Điểm quy đổi)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: ufmPriorityEvidence.evidence,
  });

  const bonus = calculateUfmBonus30(context.bonus ?? {});
  explanation.push({
    id: 'ufm-dgnl-bonus',
    label: 'Điểm cộng (b1 thành tích + b2 xét thưởng + b3 chứng chỉ Tiếng Anh)',
    output: bonus.total30,
    scale: 30,
    formula: 'min(3,0; b1 + min(1,5; b2) + min(1,5; b3))',
    evidence: ufmBonusEvidence.evidence,
  });

  const finalScore = calculateUfmThptFinalScore({ raw30: y, priority30: priority.effectivePriority30, bonus30: bonus.total30 });
  explanation.push({ id: 'ufm-dgnl-final', label: 'Điểm xét tuyển (xét ĐGNL) cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: 'eligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence, ...ufmConversionEvidence.evidence, ...ufmPriorityEvidence.evidence, ...ufmBonusEvidence.evidence],
  };
}

export interface UfmVsatEvaluationContext {
  vsatScore?: number;
  thresholdGroup?: UfmThresholdGroup;
  bonus?: UfmBonusInput;
}

/** Xét V-SAT 2026 — thang 30. Thang điểm thô tối đa 450 (verified 2026-08-19); nếu đạt ngưỡng, quy
 * đổi sang thang tương đương thi TN THPT 2026 qua bảng bách phân vị (mục 3.3 Thông báo
 * 2639/TB-ĐHTCM, `conversionTable.ts`) rồi cộng ưu tiên/điểm cộng — cùng cấu trúc với
 * `evaluateUfmHocbaAdmission`. Điểm thô V-SAT nhận trực tiếp qua context (KHÔNG persist vào
 * `ApplicantProfile` dùng chung); điểm ưu tiên khu vực/đối tượng vẫn đọc từ `profile.priority` như
 * các phương thức khác. */
export function evaluateUfmVsatAdmission(profile: ApplicantProfile, context: UfmVsatEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = ufmAdmissionMethods[2].id;
  const year = ufmAdmissionMethods[2].year;
  const group: UfmThresholdGroup = context.thresholdGroup ?? 'standard';

  if (context.vsatScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'ufm-vsat-score', label: 'Điểm bài thi V-SAT 2026.' });
    return partial(methodId, year, { missingInputs: ['Điểm bài thi V-SAT 2026.'], missingRequirements, explanation, eligibilityReason: 'Cần điểm V-SAT để kiểm tra ngưỡng.' });
  }

  const threshold = checkUfmVsatThreshold(context.vsatScore, group);
  explanation.push({ id: 'ufm-vsat-eligibility-threshold', label: 'Ngưỡng đầu vào (xét V-SAT)', output: context.vsatScore, scale: 450, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });

  if (!threshold.pass) {
    return {
      schoolId: 'ufm',
      year,
      methodId,
      confidence: 'exact-verified',
      eligibility: { status: 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: [],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [...ufmThresholdEvidence.evidence],
    };
  }

  const y = convertUfmScoreToThpt30(context.vsatScore, UFM_VSAT_CONVERSION_TABLE);
  if (y === undefined) {
    missingRequirements.push({ kind: 'unsupported', code: 'ufm-vsat-conversion-out-of-range', label: 'Điểm V-SAT nằm ngoài phạm vi bảng quy đổi bách phân vị chính thức.' });
    return partial(methodId, year, { missingInputs: ['Điểm nằm ngoài bảng quy đổi bách phân vị.'], missingRequirements, explanation, eligibilityReason: threshold.requiredText });
  }
  explanation.push({
    id: 'ufm-vsat-conversion',
    label: 'Điểm quy đổi tương đương thi TN THPT 2026',
    output: y,
    scale: 30,
    formula: 'y = c + (x-a)(d-c)/(b-a) — nội suy tuyến tính theo bảng bách phân vị (mục 3.3)',
    evidence: ufmConversionEvidence.evidence,
  });

  const standardPriority30 = lookupUfmStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUfmPriority30({ academicScore30: y, standardPriority30 });
  explanation.push({
    id: 'ufm-vsat-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Điểm quy đổi)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: ufmPriorityEvidence.evidence,
  });

  const bonus = calculateUfmBonus30(context.bonus ?? {});
  explanation.push({
    id: 'ufm-vsat-bonus',
    label: 'Điểm cộng (b1 thành tích + b2 xét thưởng + b3 chứng chỉ Tiếng Anh)',
    output: bonus.total30,
    scale: 30,
    formula: 'min(3,0; b1 + min(1,5; b2) + min(1,5; b3))',
    evidence: ufmBonusEvidence.evidence,
  });

  const finalScore = calculateUfmThptFinalScore({ raw30: y, priority30: priority.effectivePriority30, bonus30: bonus.total30 });
  explanation.push({ id: 'ufm-vsat-final', label: 'Điểm xét tuyển (xét V-SAT) cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: 'eligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence, ...ufmConversionEvidence.evidence, ...ufmPriorityEvidence.evidence, ...ufmBonusEvidence.evidence],
  };
}
