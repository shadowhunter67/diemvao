import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { ufmAdmissionMethods } from './methods';
import { checkUfmThptThreshold, checkUfmDgnlThreshold, checkUfmVsatThreshold, type UfmThresholdGroup } from './eligibility';
import { calculateUfmThptRawScore, calculateUfmThptFinalScore } from './calculator';
import { calculateUfmPriority30, lookupUfmStandardPriority30 } from './priority';
import { ufmFormulaEvidence, ufmThresholdEvidence, ufmPriorityEvidence, ufmBonusEvidence } from './evidence';
import { calculateUfmBonus30, type UfmBonusInput } from './bonus';

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

/** Xét học bạ THPT — LUÔN `unavailable`. Công thức tính học lực (verified 2026-08-19: ĐTB TB 3 năm
 * lớp 10/11/12 mỗi môn) KHỚP với `ApplicantProfile.transcript` — KHÔNG còn granularity gap. Blocker
 * thật là "Điểm xét tuyển" chính thức phải quy đổi ĐTB đó qua bảng bách phân vị Bộ GD-ĐT sang thang
 * 30, bảng đó CHƯA parse hết (`knowledgeGaps.ts:ufm-final-score-conversion-unparsed`). */
export function evaluateUfmHocbaAdmission(): AdmissionEvaluation {
  const methodId = ufmAdmissionMethods[1].id;
  const year = ufmAdmissionMethods[1].year;
  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: ['Bảng quy đổi bách phân vị (học bạ↔thi TN THPT) dùng để ra "Điểm xét tuyển" chính thức thang 30 chưa parse hết từ nguồn chính thức.'] },
    missingInputs: ['Bảng quy đổi bách phân vị học bạ↔thi TN THPT (Bộ GD-ĐT) — hiện chỉ đọc được vài dòng đầu của bảng chính thức.'],
    missingRules: ['Bảng quy đổi tương đương điểm (mục 3.1 Thông báo 2639/TB-ĐHTCM) chưa transcribe đầy đủ.'],
    missingRequirements: [{ kind: 'unsupported', code: 'ufm-final-score-conversion-unparsed', label: 'Phương thức học bạ UFM cần bảng quy đổi bách phân vị chính thức, chưa parse hết.' }],
    explanation: [],
    evidence: [],
  };
}

export interface UfmDgnlEvaluationContext {
  thresholdGroup?: UfmThresholdGroup;
}

/** Xét ĐGNL ĐHQG TP.HCM 2026 — eligibility-only. Đọc điểm thô (thang 1200) từ hồ sơ dùng chung
 * `profile.exams.vact.total` CHỈ để so ngưỡng đầu vào. "Điểm xét tuyển" chính thức (dùng xếp hạng
 * trúng tuyển) theo văn bản gốc phải quy đổi điểm ĐGNL sang thang 30 qua bảng bách phân vị Bộ GD-ĐT
 * trước khi cộng ưu tiên/điểm cộng — bảng đó CHƯA parse hết
 * (`knowledgeGaps.ts:ufm-final-score-conversion-unparsed`), nên module này KHÔNG trả `score`. */
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
  missingRequirements.push({ kind: 'official-rule', code: 'ufm-final-score-conversion-unparsed', label: 'Bảng quy đổi bách phân vị ĐGNL↔thi TN THPT (dùng để tính "Điểm xét tuyển" chính thức thang 30) chưa parse hết từ nguồn chính thức.' });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    missingInputs: ['Bảng quy đổi bách phân vị ĐGNL↔thi TN THPT (Bộ GD-ĐT) chưa parse — chỉ kiểm tra được ngưỡng đầu vào, chưa tính được "Điểm xét tuyển" chính thức thang 30.'],
    missingRules: ['Bảng quy đổi tương đương điểm (mục 3 Thông báo 2639/TB-ĐHTCM) chưa transcribe đầy đủ.'],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence],
  };
}

export interface UfmVsatEvaluationContext {
  vsatScore?: number;
  thresholdGroup?: UfmThresholdGroup;
}

/** Xét V-SAT 2026 — eligibility-only. Thang điểm tối đa NAY ĐÃ XÁC ĐỊNH (450 tổng 3 môn, verified
 * 2026-08-19) nhưng "Điểm xét tuyển" chính thức vẫn cần quy đổi qua bảng bách phân vị V-SAT↔thi TN
 * THPT (Bộ GD-ĐT) sang thang 30, bảng đó CHƯA parse hết
 * (`knowledgeGaps.ts:ufm-final-score-conversion-unparsed`). Nhận điểm thô trực tiếp qua context,
 * KHÔNG persist vào `ApplicantProfile` dùng chung. */
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
  explanation.push({ id: 'ufm-vsat-eligibility-threshold', label: 'Ngưỡng đầu vào (xét V-SAT)', output: context.vsatScore, scale: 450, formula: threshold.requiredText, evidence: ufmThresholdEvidence.evidence });
  missingRequirements.push({ kind: 'official-rule', code: 'ufm-final-score-conversion-unparsed', label: 'Bảng quy đổi bách phân vị V-SAT↔thi TN THPT (dùng để tính "Điểm xét tuyển" chính thức thang 30) chưa parse hết từ nguồn chính thức.' });

  return {
    schoolId: 'ufm',
    year,
    methodId,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    missingInputs: ['Bảng quy đổi bách phân vị V-SAT↔thi TN THPT (Bộ GD-ĐT) chưa parse — chỉ kiểm tra được ngưỡng đầu vào (thang tối đa 450 đã xác định), chưa tính được "Điểm xét tuyển" chính thức thang 30.'],
    missingRules: ['Bảng quy đổi tương đương điểm (mục 3 Thông báo 2639/TB-ĐHTCM) chưa transcribe đầy đủ.'],
    missingRequirements,
    explanation,
    evidence: [...ufmThresholdEvidence.evidence],
  };
}
