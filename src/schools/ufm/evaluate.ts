import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { ufmAdmissionMethods } from './methods';
import { checkUfmThptThreshold, checkUfmDgnlThreshold, checkUfmVsatThreshold, type UfmThresholdGroup } from './eligibility';
import { calculateUfmThptRawScore, calculateUfmThptFinalScore, calculateUfmDgnlFinalScore } from './calculator';
import { calculateUfmPriority30, calculateUfmPriority1200, lookupUfmStandardPriority30 } from './priority';
import { ufmFormulaEvidence, ufmThresholdEvidence, ufmPriorityEvidence } from './evidence';

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
  /** `false`/bỏ trống = không có thành tích cộng điểm (ĐC=0, tính exact được). `true` = có thành
   * tích nhưng mức cộng cụ thể chưa công bố (`knowledgeGaps.ts`) — kết quả vẫn `partial`. */
  hasBonusAchievement?: boolean;
}

/** Xét THPT (chương trình Chuẩn) — thang 30. Điểm học lực = tổng thô 3 môn (không nhân hệ số).
 * Exact khi `hasBonusAchievement` không phải `true` (cùng semantics USSH/HUFLIT/HUTECH
 * `hasBonusAchievement`). Với `thresholdGroup: 'law-economics'`, cần thêm điểm Toán ≥6 và không môn
 * nào <1 — nếu thiếu 1 trong 2 raw score đó, ngưỡng coi là CHƯA xác nhận (fail an toàn). */
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

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'ufm-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm cộng/xét thưởng cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'ufm',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm cộng/xét thưởng cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm cộng/xét thưởng UFM chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...ufmFormulaEvidence.evidence, ...ufmThresholdEvidence.evidence],
    };
  }

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

  const finalScore = calculateUfmThptFinalScore({ raw30, priority30: priority.effectivePriority30 });
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
    evidence: [...ufmFormulaEvidence.evidence, ...ufmThresholdEvidence.evidence, ...ufmPriorityEvidence.evidence],
  };
}

/** Xét học bạ THPT — LUÔN `unavailable`. Công thức chính thức cần điểm tính từ lớp 10 đến HK1 lớp
 * 12 (5 học kỳ, theo nguồn thứ cấp), nhưng `ApplicantProfile.transcript` dùng chung chỉ lưu TB CẢ
 * NĂM, và bản thân công thức tổng/chia cũng đọc được mơ hồ giữa các nguồn (xem
 * `knowledgeGaps.ts:ufm-hocba-semester-granularity-gap`). */
export function evaluateUfmHocbaAdmission(): AdmissionEvaluation {
  const methodId = ufmAdmissionMethods[1].id;
  const year = ufmAdmissionMethods[1].year;
  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: ['Công thức cần điểm theo học kỳ (đến HK1 lớp 12), hồ sơ dùng chung chỉ lưu TB cả năm — không đủ dữ liệu để tính đúng công thức, và bản thân công thức đọc được mơ hồ giữa các nguồn thứ cấp.'] },
    missingInputs: ['Điểm trung bình từng học kỳ (đến HK1 lớp 12) — hồ sơ dùng chung hiện chỉ lưu TB cả năm.'],
    missingRules: ['Chưa xác nhận công thức tổng/chia chính xác từ nguồn chính thức UFM.'],
    missingRequirements: [{ kind: 'unsupported', code: 'ufm-hocba-semester-granularity-gap', label: 'Phương thức học bạ UFM cần dữ liệu theo học kỳ, chưa được hồ sơ dùng chung hỗ trợ.' }],
    explanation: [],
    evidence: [],
  };
}

export interface UfmDgnlEvaluationContext {
  thresholdGroup?: UfmThresholdGroup;
  hasBonusAchievement?: boolean;
}

/** Xét ĐGNL ĐHQG TP.HCM 2026, thang 1200. Đọc từ hồ sơ điểm dùng chung `profile.exams.vact.total`.
 * Exact khi `hasBonusAchievement` không phải `true`. */
export function evaluateUfmDgnlAdmission(profile: ApplicantProfile, context: UfmDgnlEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = ufmAdmissionMethods[3].id;
  const year = ufmAdmissionMethods[3].year;
  const group: UfmThresholdGroup = context.thresholdGroup ?? 'standard';

  const dgnlScore1200 = profile.exams?.vact?.total;
  if (dgnlScore1200 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'ufm-dgnl-total', label: 'Tổng điểm ĐGNL ĐHQG-HCM (thang 1200).' });
    return partial(methodId, year, { missingInputs: ['Điểm ĐGNL ĐHQG-HCM (thang 1200).'], missingRequirements, explanation, eligibilityReason: 'Cần điểm ĐGNL để tính điểm xét tuyển.' });
  }

  const threshold = checkUfmDgnlThreshold(dgnlScore1200, group);
  explanation.push({ id: 'ufm-dgnl-eligibility-threshold', label: 'Ngưỡng đầu vào (xét ĐGNL)', output: dgnlScore1200, scale: 1200, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'ufm-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm cộng/xét thưởng cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'ufm',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm cộng/xét thưởng cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm cộng/xét thưởng UFM chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...ufmThresholdEvidence.evidence],
    };
  }

  const standardPriority30 = lookupUfmStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateUfmPriority1200({ dgnlScore1200, standardPriority30 });
  explanation.push({
    id: 'ufm-dgnl-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority1200,
    scale: 1200,
    formula: priority.reduced ? '[(1200 – Tổng điểm ĐGNL)/300] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: ufmPriorityEvidence.evidence,
  });

  const finalScore = calculateUfmDgnlFinalScore({ dgnlScore1200, priority1200: priority.effectivePriority1200 });
  explanation.push({ id: 'ufm-dgnl-final', label: 'Điểm xét tuyển (xét ĐGNL) cuối cùng', output: finalScore, scale: 1200 });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 1200 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence, ...ufmPriorityEvidence.evidence],
  };
}

export interface UfmVsatEvaluationContext {
  vsatScore?: number;
  thresholdGroup?: UfmThresholdGroup;
}

/** Xét V-SAT 2026 — eligibility-only, cùng lý do HUTECH (thang điểm/công thức quy đổi chưa xác
 * định). Nhận điểm thô trực tiếp qua context, KHÔNG persist vào `ApplicantProfile` dùng chung. */
export function evaluateUfmVsatAdmission(context: UfmVsatEvaluationContext = {}): AdmissionEvaluation {
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
  explanation.push({ id: 'ufm-vsat-eligibility-threshold', label: 'Ngưỡng đầu vào (xét V-SAT)', output: context.vsatScore, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    missingInputs: ['Công thức quy đổi điểm xét tuyển cuối từ V-SAT chưa xác định rõ ràng từ nguồn — chỉ kiểm tra được ngưỡng đầu vào.'],
    missingRules: ['Thang điểm tối đa/công thức quy đổi V-SAT UFM chưa xác định.'],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence],
  };
}
