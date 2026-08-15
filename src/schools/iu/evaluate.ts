import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { round2 } from '../../core/round2';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { IuSubjectContext } from './applicantProfileAdapter';
import { buildIuEvaluationInput } from './applicantProfileAdapter';
import { calculateIuAcademicScore } from './calculator';
import { computeIuTotalBonus, type IuAwardTier } from './bonus';
import { lookupIuStandardPriority } from './priority';
import { calculateIuEffectivePriority } from './priorityReduction';
import { checkIuThresholdLowerBound } from './eligibility';
import { iuAdmissionMethods } from './methods';
import { iuAcademicWeightsEvidence, iuBonusEvidence, iuPriorityEvidence, iuPriorityReductionEvidence } from './evidence';
import { findIuCutoff } from './data/cutoffs';

export interface IuEvaluationContext {
  subjectContext?: IuSubjectContext;
  hasPrioritySchool?: boolean;
  specialAchievementCount?: number;
  awardTier?: IuAwardTier;
  /** true nếu chứng chỉ ngoại ngữ đã dùng để miễn thi/quy đổi điểm môn Tiếng Anh THPT — theo quy
   * định thì không được dùng lại cho "Điểm khuyến khích" (xem `bonus.ts`). */
  certificateUsedForThptExemption?: boolean;
  /** Chọn ngành để so sánh điểm xét tuyển với điểm trúng tuyển 2026 (`data/cutoffs.ts`) — bỏ
   * trống thì chỉ so với ngưỡng đảm bảo chất lượng chung. */
  programId?: string;
}

const YEAR = 2026;

/** Đánh giá đầy đủ Phương thức 2 IU 2026 cho "Thí sinh tốt nghiệp THPT 2026" (đối tượng 1.1/1.2
 * — có/không có ĐGNL 2026). Điểm học lực + Điểm cộng (3 thành phần) + Điểm ưu tiên (có giảm) đều
 * đã verified đầy đủ từ nguồn chính thức (`sources.ts`) — `confidence: 'exact-verified'`.
 * Đối tượng 2 (tốt nghiệp trước 2026) và 3 (THPT nước ngoài, cần điểm Phỏng vấn) NGOÀI phạm vi
 * hàm này (xem `knowledgeGaps.ts`) — không ảnh hưởng tính exact cho đối tượng 1 đang hỗ trợ. */
export function evaluateIuAdmission(profile: ApplicantProfile, context: IuEvaluationContext = {}): AdmissionEvaluation {
  const input = buildIuEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (!context.subjectContext) {
    missingInputs.push('Chưa chọn tổ hợp để tính Điểm học lực.');
    missingRequirements.push({ kind: 'school-context', code: 'iu-subject-combination', label: 'Chọn tổ hợp.' });
  } else if (input.thptRawTotal30 === undefined || input.transcriptTotal30 === undefined) {
    const missingSubjects = context.subjectContext.subjects.filter(
      (subjectId) =>
        profile.thpt?.scores?.[subjectId] === undefined ||
        profile.transcript?.grade10?.[subjectId] === undefined ||
        profile.transcript?.grade11?.[subjectId] === undefined ||
        profile.transcript?.grade12?.[subjectId] === undefined
    );
    missingInputs.push('Chưa đủ điểm THPT hoặc học bạ 3 năm cho tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `iu-subject-${subjectId}`,
        label: `Điểm THPT/học bạ môn ${SUBJECT_LABELS[subjectId]}.`,
      }))
    );
  }

  const allEvidence = [
    ...iuAcademicWeightsEvidence.evidence,
    ...iuBonusEvidence.evidence,
    ...iuPriorityEvidence.evidence,
    ...iuPriorityReductionEvidence.evidence,
  ];

  if (input.thptRawTotal30 === undefined || input.transcriptTotal30 === undefined) {
    return {
      schoolId: 'iu',
      year: iuAdmissionMethods[0].year,
      methodId: iuAdmissionMethods[0].id,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần đủ điểm THPT và học bạ theo tổ hợp để tính Điểm học lực.'] },
      missingInputs,
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: allEvidence,
    };
  }

  const academic = calculateIuAcademicScore({
    thptRawTotal30: input.thptRawTotal30,
    dgnlRaw1200: input.dgnlRaw1200,
    transcriptTotal30: input.transcriptTotal30,
  });

  const bonus = computeIuTotalBonus({
    awardTier: context.awardTier ?? 'none',
    hasPrioritySchool: context.hasPrioritySchool ?? false,
    specialAchievementCount: context.specialAchievementCount ?? 0,
    certificate: {
      ielts: input.ielts,
      toeflIbt: input.toeflIbt,
      toeic: input.toeic,
      usedForThptEnglishExemption: context.certificateUsedForThptExemption ?? false,
    },
  });

  const academicPlusBonus = round2(academic.academicScore + bonus.total);
  const standardPriority = lookupIuStandardPriority(input.priorityRegion, input.priorityCategory);
  const priority = calculateIuEffectivePriority({ academicPlusBonus, standardPriority });
  const finalScore = round2(Math.min(100, academicPlusBonus + priority.effectivePriority));

  const threshold = checkIuThresholdLowerBound(finalScore);
  const cutoff = findIuCutoff(context.programId, YEAR);

  explanation.push(
    {
      id: 'iu-academic',
      label: academic.usedDgnlSubstitute ? 'Điểm học lực (không có ĐGNL 2026, dùng Hs3×THPT thay thế)' : 'Điểm học lực',
      inputs: { thptScaled100: academic.thptScaled100, transcriptScaled100: academic.transcriptScaled100 },
      output: academic.academicScore,
      scale: 100,
      formula: '0.4×THPT + 0.5×ĐGNL + 0.1×Học bạ (mỗi thành phần đã quy đổi thang 100)',
      evidence: iuAcademicWeightsEvidence.evidence,
    },
    {
      id: 'iu-bonus',
      label: 'Điểm cộng (điểm thưởng + điểm xét thưởng + điểm khuyến khích, cap 10)',
      inputs: { awardBonus: bonus.awardBonus, xetThuongBonus: bonus.xetThuongBonus, encouragementBonus: bonus.encouragementBonus },
      output: bonus.total,
      scale: 10,
      formula: 'MIN(10, Điểm thưởng + Điểm xét thưởng + Điểm khuyến khích)',
      evidence: iuBonusEvidence.evidence,
    },
    {
      id: 'iu-priority',
      label: priority.reduced ? 'Điểm ưu tiên (đã giảm do Điểm học lực+Điểm cộng ≥ 75)' : 'Điểm ưu tiên',
      inputs: { standardPriority, academicPlusBonus },
      output: priority.effectivePriority,
      scale: standardPriority,
      formula: priority.reduced
        ? '[(100 − Điểm học lực − Điểm cộng)/25] × mức ưu tiên chuẩn'
        : 'Mức ưu tiên chuẩn (Điểm học lực+Điểm cộng < 75, không giảm)',
      evidence: [...iuPriorityEvidence.evidence, ...iuPriorityReductionEvidence.evidence],
    },
    {
      id: 'iu-final',
      label: 'Điểm xét tuyển',
      inputs: { academicScore: academic.academicScore, bonus: bonus.total, priority: priority.effectivePriority },
      output: finalScore,
      scale: 100,
      formula: 'Điểm học lực + Điểm cộng + Điểm ưu tiên',
      evidence: allEvidence,
    }
  );

  const eligibilityReasons = [threshold.requiredText];
  let eligibilityStatus: 'eligible' | 'ineligible' | 'unknown' = threshold.pass ? 'eligible' : 'ineligible';
  if (cutoff) {
    const cutoffPass = finalScore >= cutoff.score;
    eligibilityStatus = cutoffPass ? 'eligible' : 'ineligible';
    eligibilityReasons.push(
      `So với điểm trúng tuyển ${cutoff.score}/100 ngành đã chọn (công bố ${cutoff.publishedAt}): ${
        cutoffPass ? 'đạt' : 'chưa đạt'
      } (${finalScore}/100).`
    );
  }

  return {
    schoolId: 'iu',
    year: YEAR,
    methodId: iuAdmissionMethods[0].id,
    confidence: 'exact-verified',
    eligibility: { status: eligibilityStatus, reasons: eligibilityReasons },
    score: { value: finalScore, scale: 100 },
    missingInputs,
    missingRules: [],
    missingRequirements,
    explanation,
    evidence: allEvidence,
  };
}
