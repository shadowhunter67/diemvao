import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hutechAdmissionMethods } from './methods';
import { checkHutechThptThreshold, checkHutechDgnlThreshold, checkHutechVsatThreshold, type HutechThresholdGroup } from './eligibility';
import { calculateHutechThptRawScore, calculateHutechThptFinalScore, calculateHutechDgnlFinalScore } from './calculator';
import { calculateHutechPriority30, calculateHutechPriority1200, lookupHutechStandardPriority30 } from './priority';
import { hutechFormulaEvidence, hutechThresholdEvidence, hutechPriorityEvidence } from './evidence';

export interface HutechSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

function partial(methodId: string, year: number, input: { missingInputs: string[]; missingRequirements: MissingRequirement[]; explanation: CalculationStep[]; eligibilityReason: string }): AdmissionEvaluation {
  return {
    schoolId: 'hutech',
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

export interface HutechThptEvaluationContext {
  subjectContext?: HutechSubjectContext;
  thresholdGroup?: HutechThresholdGroup;
  /** `false`/bỏ trống = không có thành tích cộng điểm (ĐC=0, tính exact được). `true` = có thành
   * tích nhưng mức cộng cụ thể chưa công bố (`knowledgeGaps.ts`) — kết quả vẫn `partial`. */
  hasBonusAchievement?: boolean;
}

/** Xét THPT — thang 30. Điểm học lực = tổng thô 3 môn (không nhân hệ số). Exact khi
 * `hasBonusAchievement` không phải `true` (cùng semantics USSH/HUFLIT `hasBonusAchievement`). */
export function evaluateHutechThptAdmission(profile: ApplicantProfile, context: HutechThptEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = hutechAdmissionMethods[0].id;
  const year = hutechAdmissionMethods[0].year;
  const group: HutechThresholdGroup = context.thresholdGroup ?? 'standard';

  if (!context.subjectContext || context.subjectContext.subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'hutech-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển HUTECH.' });
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
    missingRequirements.push(...missingSubjects.map((s) => ({ kind: 'profile-input' as const, code: `hutech-thpt-${s}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[s]}.` })));
    return partial(methodId, year, { missingInputs: ['Chưa đủ điểm 3 môn thi THPT theo tổ hợp.'], missingRequirements, explanation, eligibilityReason: 'Cần đủ điểm 3 môn để kiểm tra ngưỡng.' });
  }

  const raw30 = calculateHutechThptRawScore({ subject1Score: scores[0], subject2Score: scores[1], subject3Score: scores[2] });
  const threshold = checkHutechThptThreshold(raw30, group);
  explanation.push({ id: 'hutech-eligibility-threshold', label: 'Ngưỡng đầu vào (xét THPT)', output: raw30, scale: 30, formula: threshold.requiredText, evidence: hutechThresholdEvidence.evidence });
  explanation.push({ id: 'hutech-academic-score', label: 'Điểm học lực (tổng thô 3 môn)', output: raw30, scale: 30, formula: 'MT1 + MT2 + MT3', evidence: hutechFormulaEvidence.evidence });

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'hutech-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'hutech',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm thưởng/khuyến khích cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm thưởng/điểm khuyến khích HUTECH chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...hutechFormulaEvidence.evidence, ...hutechThresholdEvidence.evidence],
    };
  }

  const standardPriority30 = lookupHutechStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHutechPriority30({ academicScore30: raw30, standardPriority30 });
  explanation.push({
    id: 'hutech-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30 – Học lực)/7,5] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: hutechPriorityEvidence.evidence,
  });

  const finalScore = calculateHutechThptFinalScore({ raw30, priority30: priority.effectivePriority30 });
  explanation.push({ id: 'hutech-final', label: 'Điểm xét tuyển (xét THPT) cuối cùng', output: finalScore, scale: 30 });

  return {
    schoolId: 'hutech',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 30 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...hutechFormulaEvidence.evidence, ...hutechThresholdEvidence.evidence, ...hutechPriorityEvidence.evidence],
  };
}

/** Xét học bạ THPT (6 học kỳ) — LUÔN `partial`. Công thức chính thức cần TB 3 môn theo tổ hợp CỦA
 * 6 HỌC KỲ, nhưng `ApplicantProfile.transcript` dùng chung chỉ lưu TB CẢ NĂM (không đủ chi tiết để
 * tính đúng, xem `knowledgeGaps.ts:hutech-hocba-semester-granularity-gap`). Hàm này tồn tại để
 * method có 1 evaluator nhất quán với 3 phương thức còn lại thay vì im lặng bỏ qua, và để test
 * conformance phần "verified quan trọng" (ngưỡng đầu vào theo nhóm ngành, xem `eligibility.ts`). */
export function evaluateHutechHocbaAdmission(): AdmissionEvaluation {
  const methodId = hutechAdmissionMethods[1].id;
  const year = hutechAdmissionMethods[1].year;
  return {
    schoolId: 'hutech',
    year,
    methodId,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: ['Công thức cần điểm theo 6 học kỳ riêng lẻ, hồ sơ dùng chung chỉ lưu TB cả năm — không đủ dữ liệu để tính đúng công thức.'] },
    missingInputs: ['Điểm trung bình từng học kỳ (HK1/HK2 của lớp 10/11/12) — hồ sơ dùng chung hiện chỉ lưu TB cả năm.'],
    missingRules: ['Chưa xác nhận TB cả năm có tương đương phép tính TB 6 học kỳ của HUTECH hay không.'],
    missingRequirements: [{ kind: 'unsupported', code: 'hutech-hocba-semester-granularity-gap', label: 'Phương thức học bạ HUTECH cần dữ liệu theo học kỳ, chưa được hồ sơ dùng chung hỗ trợ.' }],
    explanation: [],
    evidence: [...hutechFormulaEvidence.evidence],
  };
}

export interface HutechDgnlEvaluationContext {
  thresholdGroup?: HutechThresholdGroup;
  hasBonusAchievement?: boolean;
}

/** Xét ĐGNL ĐHQG TP.HCM 2026, thang 1200. Đọc từ hồ sơ điểm dùng chung `profile.exams.vact.total`.
 * Exact khi `hasBonusAchievement` không phải `true` (cùng semantics phương thức THPT ở trên — chưa
 * có nguồn xác nhận riêng phương thức ĐGNL KHÔNG có thành phần điểm cộng, nên giữ cùng điều kiện an
 * toàn thay vì coi mặc định exact toàn bộ như HUFLIT PT3). */
export function evaluateHutechDgnlAdmission(profile: ApplicantProfile, context: HutechDgnlEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = hutechAdmissionMethods[3].id;
  const year = hutechAdmissionMethods[3].year;
  const group: HutechThresholdGroup = context.thresholdGroup ?? 'standard';

  const dgnlScore1200 = profile.exams?.vact?.total;
  if (dgnlScore1200 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hutech-dgnl-total', label: 'Tổng điểm ĐGNL ĐHQG-HCM (thang 1200).' });
    return partial(methodId, year, { missingInputs: ['Điểm ĐGNL ĐHQG-HCM (thang 1200).'], missingRequirements, explanation, eligibilityReason: 'Cần điểm ĐGNL để tính điểm xét tuyển.' });
  }

  const threshold = checkHutechDgnlThreshold(dgnlScore1200, group);
  explanation.push({ id: 'hutech-dgnl-eligibility-threshold', label: 'Ngưỡng đầu vào (xét ĐGNL)', output: dgnlScore1200, scale: 1200, formula: threshold.requiredText, evidence: hutechThresholdEvidence.evidence });

  if (context.hasBonusAchievement === true) {
    missingRequirements.push({ kind: 'official-rule', code: 'hutech-bonus-table-not-found', label: 'Có thành tích cộng điểm nhưng bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn chính thức.' });
    return {
      schoolId: 'hutech',
      year,
      methodId,
      confidence: 'partial',
      eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
      missingInputs: ['Mức điểm thưởng/khuyến khích cụ thể chưa có nguồn — không tính được Điểm cộng.'],
      missingRules: ['Bảng điểm thưởng/điểm khuyến khích HUTECH chưa tìm được nguồn chính thức.'],
      missingRequirements,
      explanation,
      evidence: [...hutechThresholdEvidence.evidence],
    };
  }

  const standardPriority30 = lookupHutechStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateHutechPriority1200({ dgnlScore1200, standardPriority30 });
  explanation.push({
    id: 'hutech-dgnl-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority1200,
    scale: 1200,
    formula: priority.reduced ? '[(1200 – Tổng điểm ĐGNL)/300] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: hutechPriorityEvidence.evidence,
  });

  const finalScore = calculateHutechDgnlFinalScore({ dgnlScore1200, priority1200: priority.effectivePriority1200 });
  explanation.push({ id: 'hutech-dgnl-final', label: 'Điểm xét tuyển (xét ĐGNL) cuối cùng', output: finalScore, scale: 1200 });

  return {
    schoolId: 'hutech',
    year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale: 1200 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...hutechThresholdEvidence.evidence, ...hutechPriorityEvidence.evidence],
  };
}

export interface HutechVsatEvaluationContext {
  vsatScore?: number;
  thresholdGroup?: HutechThresholdGroup;
}

/** Xét V-SAT 2026 — eligibility-only. Thang điểm/công thức quy đổi CHƯA xác định rõ ràng (xem
 * `knowledgeGaps.ts:hutech-vsat-scale-conflicting`), nên hàm này luôn trả `partial` (không lắp
 * ráp điểm xét tuyển cuối), chỉ báo trạng thái đạt/không đạt ngưỡng dựa trên điểm thô người dùng
 * nhập trực tiếp qua context (KHÔNG persist vào `ApplicantProfile` dùng chung). */
export function evaluateHutechVsatAdmission(context: HutechVsatEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = hutechAdmissionMethods[2].id;
  const year = hutechAdmissionMethods[2].year;
  const group: HutechThresholdGroup = context.thresholdGroup ?? 'standard';

  if (context.vsatScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hutech-vsat-score', label: 'Điểm bài thi V-SAT 2026.' });
    return partial(methodId, year, { missingInputs: ['Điểm bài thi V-SAT 2026.'], missingRequirements, explanation, eligibilityReason: 'Cần điểm V-SAT để kiểm tra ngưỡng.' });
  }

  const threshold = checkHutechVsatThreshold(context.vsatScore, group);
  explanation.push({ id: 'hutech-vsat-eligibility-threshold', label: 'Ngưỡng đầu vào (xét V-SAT)', output: context.vsatScore, formula: threshold.requiredText, evidence: hutechThresholdEvidence.evidence });

  return {
    schoolId: 'hutech',
    year,
    methodId,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    missingInputs: ['Công thức quy đổi điểm xét tuyển cuối từ V-SAT chưa xác định rõ ràng từ nguồn — chỉ kiểm tra được ngưỡng đầu vào.'],
    missingRules: ['Thang điểm tối đa/công thức quy đổi V-SAT HUTECH chưa xác định (nguồn mâu thuẫn).'],
    missingRequirements,
    explanation,
    evidence: [...hutechThresholdEvidence.evidence],
  };
}
