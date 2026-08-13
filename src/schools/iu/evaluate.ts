import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { IuSubjectContext } from './applicantProfileAdapter';
import { buildIuEvaluationInput } from './applicantProfileAdapter';
import { calculateIuAcademicScore } from './calculator';
import { computeIuXetThuongBonus } from './bonus';
import { checkIuThresholdLowerBound } from './eligibility';
import { iuAdmissionMethods } from './methods';
import { iuKnowledgeGaps } from './knowledgeGaps';
import { iuAcademicWeightsEvidence } from './evidence';

export interface IuEvaluationContext {
  subjectContext?: IuSubjectContext;
  hasPrioritySchool?: boolean;
  specialAchievementCount?: number;
}

/** Trả về Điểm học lực + điểm xét thưởng đã biết — KHÔNG BAO GIỜ set `score` như thể đây là Điểm
 * xét tuyển chính thức (thiếu điểm thưởng/khuyến khích/ưu tiên). `confidence` luôn 'partial'. */
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

  missingRequirements.push(...iuKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));

  if (input.thptRawTotal30 === undefined || input.transcriptTotal30 === undefined) {
    return {
      schoolId: 'iu',
      year: iuAdmissionMethods[0].year,
      methodId: iuAdmissionMethods[0].id,
      confidence: 'partial',
      eligibility: { status: 'unknown', reasons: ['Cần đủ điểm THPT và học bạ theo tổ hợp để tính Điểm học lực.'] },
      missingInputs,
      missingRules: iuKnowledgeGaps.map((gap) => gap.label),
      missingRequirements,
      explanation,
      evidence: iuAcademicWeightsEvidence.evidence,
    };
  }

  const academic = calculateIuAcademicScore({
    thptRawTotal30: input.thptRawTotal30,
    dgnlRaw1200: input.dgnlRaw1200,
    transcriptTotal30: input.transcriptTotal30,
  });
  const xetThuong = computeIuXetThuongBonus(context.hasPrioritySchool ?? false, context.specialAchievementCount ?? 0);
  const lowerBoundScore = academic.academicScore + xetThuong;
  const threshold = checkIuThresholdLowerBound(lowerBoundScore);

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
      id: 'iu-xet-thuong',
      label: 'Điểm xét thưởng đã biết (2 tiêu chí)',
      output: xetThuong,
      scale: 5,
      formula: 'MIN(5, trường ưu tiên×3 + số giải×2)',
    }
  );

  return {
    schoolId: 'iu',
    year: iuAdmissionMethods[0].year,
    methodId: iuAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'unknown', reasons: [threshold.requiredText] },
    missingInputs,
    missingRules: iuKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: iuAcademicWeightsEvidence.evidence,
  };
}
