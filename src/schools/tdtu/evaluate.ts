import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { tdtuAdmissionMethods } from './methods';
import { tdtuKnowledgeGaps } from './knowledgeGaps';
import { checkTdtuGeneralThreshold } from './eligibility';
import { calculateTdtuCompetencyObject11, calculateTdtuPt1FinalScore, calculateTdtuPt2FinalScore } from './calculator';
import { calculateTdtuDiemCong, type TdtuThuongAchievement, type TdtuXetThuongAchievement } from './bonus';
import { calculateTdtuPt1EffectivePriority, calculateTdtuPt2EffectivePriority, lookupTdtuStandardPriority30 } from './priority';
import { tdtuCompetencyFormulaEvidence, tdtuBonusEvidence, tdtuPriorityEvidence, tdtuGeneralThresholdEvidence } from './evidence';

export interface TdtuSubjectContext {
  combinationId?: string;
  mainSubjectId: SubjectId;
  subjects: readonly SubjectId[];
}

export interface TdtuPt1EvaluationContext {
  subjectContext?: TdtuSubjectContext;
  thuong?: TdtuThuongAchievement[];
  xetThuong?: TdtuXetThuongAchievement[];
}

/** TB 6HK xấp xỉ bằng trung bình 3 năm (grade10/11/12) — `ApplicantProfile.transcript` chỉ lưu
 * theo NĂM, không theo học kỳ, nên "TB 6HK" chỉ tính xấp xỉ được ở mức trung bình năm. Đây là
 * approximation CÓ CHỦ Ý và được ghi rõ ở đây, không phải suy đoán ẩn — nếu UniscoreVN sau này lưu
 * theo học kỳ, thay hàm này mà không đổi chữ ký `evaluateTdtuPt1Admission`. */
function averageYearlyTranscript(profile: ApplicantProfile, subjectId: SubjectId): number | undefined {
  const g10 = profile.transcript?.grade10?.[subjectId];
  const g11 = profile.transcript?.grade11?.[subjectId];
  const g12 = profile.transcript?.grade12?.[subjectId];
  const values = [g10, g11, g12].filter((v): v is number => v !== undefined);
  if (values.length === 0) return undefined;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * PT1 (Xét tuyển tổng hợp), Đối tượng 1.1 — thang 100. Điểm năng lực dùng THPT + xấp xỉ TB 6HK
 * (`averageYearlyTranscript`); Điểm cộng = Điểm thưởng+xét thưởng (Phụ lục 6/7, đầy đủ); Điểm ưu
 * tiên có quy tắc giảm khi (Năng lực+Cộng)≥75. `confidence: 'exact-verified'` khi đủ input — công
 * thức + bảng số đều verified từ nguồn chính thức (`sources.ts`), không có gap chặn phạm vi Đối
 * tượng 1.1. Ngưỡng đầu vào riêng ngành CHƯA có dữ liệu nên `eligibility.status` không bao giờ là
 * `'eligible'` chắc chắn — chỉ `'ineligible'` (dưới ngưỡng chung) hoặc `'unknown'` (đạt ngưỡng
 * chung, còn cần ngưỡng riêng ngành).
 */
export function evaluateTdtuPt1Admission(profile: ApplicantProfile, context: TdtuPt1EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = tdtuAdmissionMethods[0].id;

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'tdtu-subject-combination', label: 'Chọn tổ hợp 3 môn xét tuyển TDTU (và môn chính nhân hệ số 2).' });
    return {
      schoolId: 'tdtu',
      year: tdtuAdmissionMethods[0].year,
      methodId,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần chọn tổ hợp để kiểm tra ngưỡng đầu vào.'] },
      missingInputs: ['Chọn tổ hợp xét tuyển.'],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [],
    };
  }

  const { mainSubjectId, subjects } = context.subjectContext;
  if (subjects.length !== 3) {
    missingRequirements.push({ kind: 'school-context', code: 'tdtu-subject-count-mismatch', label: 'PT1 cần đúng 3 môn trong tổ hợp.' });
    return {
      schoolId: 'tdtu',
      year: tdtuAdmissionMethods[0].year,
      methodId,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Tổ hợp cần đúng 3 môn.'] },
      missingInputs: ['Tổ hợp cần đúng 3 môn.'],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [],
    };
  }

  const secondaryIds = subjects.filter((id) => id !== mainSubjectId);
  const thptScores: Partial<Record<SubjectId, number>> = {};
  const missingThpt: SubjectId[] = [];
  const transcriptScores: Partial<Record<SubjectId, number>> = {};
  const missingTranscript: SubjectId[] = [];
  for (const subjectId of subjects) {
    const thptScore = profile.thpt?.scores?.[subjectId];
    if (thptScore === undefined) missingThpt.push(subjectId);
    else thptScores[subjectId] = thptScore;

    const transcriptScore = averageYearlyTranscript(profile, subjectId);
    if (transcriptScore === undefined) missingTranscript.push(subjectId);
    else transcriptScores[subjectId] = transcriptScore;
  }

  if (missingThpt.length > 0 || missingTranscript.length > 0) {
    missingInputs.push('Chưa đủ điểm thi TN THPT và/hoặc điểm học bạ (10/11/12) theo tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingThpt.map((subjectId) => ({ kind: 'profile-input' as const, code: `tdtu-thpt-${subjectId}`, label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]}.` })),
      ...missingTranscript.map((subjectId) => ({ kind: 'profile-input' as const, code: `tdtu-transcript-${subjectId}`, label: `Điểm học bạ (lớp 10/11/12) môn ${SUBJECT_LABELS[subjectId]}.` }))
    );
    return {
      schoolId: 'tdtu',
      year: tdtuAdmissionMethods[0].year,
      methodId,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần đủ điểm TN THPT và học bạ theo tổ hợp để tính Điểm năng lực.'] },
      missingInputs,
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [],
    };
  }

  const totalThpt30 = Math.round(subjects.reduce((sum, id) => sum + (thptScores[id] ?? 0), 0) * 100) / 100;
  const threshold = checkTdtuGeneralThreshold(totalThpt30);
  explanation.push({ id: 'tdtu-eligibility-threshold', label: 'Ngưỡng đầu vào chung TDTU 2026', output: totalThpt30, scale: 30, formula: threshold.requiredText, evidence: tdtuGeneralThresholdEvidence.evidence });

  const thptInput = { mainSubjectScore: thptScores[mainSubjectId] ?? 0, subject2Score: thptScores[secondaryIds[0]] ?? 0, subject3Score: thptScores[secondaryIds[1]] ?? 0 };
  const transcriptInput = { mainSubjectScore: transcriptScores[mainSubjectId] ?? 0, subject2Score: transcriptScores[secondaryIds[0]] ?? 0, subject3Score: transcriptScores[secondaryIds[1]] ?? 0 };
  const competency = calculateTdtuCompetencyObject11({ thpt: thptInput, transcript: transcriptInput });
  explanation.push({
    id: 'tdtu-competency',
    label: 'Điểm năng lực (Đối tượng 1.1)',
    output: competency,
    scale: 100,
    formula: '(Điểm năng lực THPT×0,75) + (Điểm quá trình THPT×0,25); mỗi thành phần = (Môn1+Môn2+Môn3×2)×2,5',
    evidence: tdtuCompetencyFormulaEvidence.evidence,
  });

  const bonus = calculateTdtuDiemCong({ thuong: context.thuong, xetThuong: context.xetThuong });
  explanation.push({ id: 'tdtu-bonus', label: 'Điểm cộng (Điểm thưởng + Điểm xét thưởng)', output: bonus, scale: 100, formula: 'min(10, Điểm thưởng + Điểm xét thưởng)', evidence: tdtuBonusEvidence.evidence });

  const standardPriority30 = lookupTdtuStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateTdtuPt1EffectivePriority({ competencyPlusBonus100: competency + bonus, standardPriority30 });
  explanation.push({
    id: 'tdtu-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority100,
    scale: 100,
    formula: priority.reduced ? '[(100 – Năng lực – Cộng)/25] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: tdtuPriorityEvidence.evidence,
  });

  const finalScore = calculateTdtuPt1FinalScore({ competency100: competency, bonus100: bonus, priority100: priority.effectivePriority100 });
  explanation.push({ id: 'tdtu-final', label: 'Điểm xét tuyển PT1 cuối cùng', output: finalScore, scale: 100 });

  missingRequirements.push(...tdtuKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));

  return {
    schoolId: 'tdtu',
    year: tdtuAdmissionMethods[0].year,
    methodId,
    confidence: 'exact-verified',
    eligibility: {
      status: threshold.pass ? 'unknown' : 'ineligible',
      reasons: [threshold.requiredText],
    },
    score: { value: finalScore, scale: 100 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...tdtuGeneralThresholdEvidence.evidence, ...tdtuCompetencyFormulaEvidence.evidence, ...tdtuBonusEvidence.evidence, ...tdtuPriorityEvidence.evidence],
  };
}

export interface TdtuPt2EvaluationContext {
  dgnlScore1200?: number;
}

/**
 * PT2 (Xét theo ĐGNL ĐHQG-HCM) — thang 1200. Điểm xét tuyển = Tổng điểm ĐGNL + Điểm ưu tiên (giảm
 * khi ĐGNL≥900). KHÔNG có thành phần Điểm cộng ở phương thức này. Đọc ĐGNL từ
 * `profile.exams.vact.total` (hồ sơ điểm dùng chung, không cần nhập lại — cùng pattern UEH).
 */
export function evaluateTdtuPt2Admission(profile: ApplicantProfile, _context: TdtuPt2EvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const methodId = tdtuAdmissionMethods[1].id;

  const dgnlScore1200 = profile.exams?.vact?.total;
  if (dgnlScore1200 === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'tdtu-dgnl-total', label: 'Tổng điểm ĐGNL ĐHQG-HCM (thang 1200).' });
    return {
      schoolId: 'tdtu',
      year: tdtuAdmissionMethods[1].year,
      methodId,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần điểm ĐGNL ĐHQG-HCM để tính điểm xét tuyển.'] },
      missingInputs: ['Điểm ĐGNL ĐHQG-HCM (thang 1200).'],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [],
    };
  }

  const standardPriority30 = lookupTdtuStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateTdtuPt2EffectivePriority({ dgnlScore1200, standardPriority30 });
  explanation.push({
    id: 'tdtu-pt2-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority1200,
    scale: 1200,
    formula: priority.reduced ? '[(1200 – Tổng điểm ĐGNL)/300] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
    evidence: tdtuPriorityEvidence.evidence,
  });

  const finalScore = calculateTdtuPt2FinalScore({ dgnlScore1200, priority1200: priority.effectivePriority1200 });
  explanation.push({ id: 'tdtu-pt2-final', label: 'Điểm xét tuyển PT2 (ĐGNL) cuối cùng', output: finalScore, scale: 1200 });

  missingRequirements.push(...tdtuKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));

  return {
    schoolId: 'tdtu',
    year: tdtuAdmissionMethods[1].year,
    methodId,
    confidence: 'exact-verified',
    eligibility: { status: 'unknown', reasons: ['Cần đạt ngưỡng điểm đầu vào riêng theo ngành do TDTU quy định (chưa có dữ liệu).'] },
    score: { value: finalScore, scale: 1200 },
    missingInputs: [],
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: [...tdtuPriorityEvidence.evidence],
  };
}
