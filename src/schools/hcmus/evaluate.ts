import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { HcmusSubjectContext } from './applicantProfileAdapter';
import { buildHcmusEvaluationInput } from './applicantProfileAdapter';
import { checkHcmusNuclearEngineeringCondition, checkHcmusThptThreshold } from './eligibility';
import { hcmusAdmissionMethods } from './methods';
import { hcmusKnowledgeGaps } from './knowledgeGaps';
import { hcmusThresholdEvidence, hcmusAcademicScoreEvidence } from './evidence';
import { calculateHcmusAcademicScore } from './academicScore';

export interface HcmusEvaluationContext {
  subjectContext?: HcmusSubjectContext;
  checkNuclearEngineering?: boolean;
}

export function evaluateHcmusAdmission(profile: ApplicantProfile, context: HcmusEvaluationContext = {}): AdmissionEvaluation {
  const input = buildHcmusEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (context.subjectContext && input.thptRawTotal30 !== undefined) {
    const threshold = checkHcmusThptThreshold(input.thptRawTotal30);
    explanation.push({
      id: 'hcmus-thpt-threshold',
      label: `THPT ${context.subjectContext.combinationId ?? 'theo tổ hợp'} so ngưỡng đầu vào`,
      inputs: { thptTotal30: input.thptRawTotal30 },
      output: input.thptRawTotal30,
      scale: 30,
      formula: threshold.requiredText,
      description: threshold.pass ? 'Đạt ngưỡng' : 'Chưa đạt ngưỡng',
      evidence: hcmusThresholdEvidence.evidence,
    });
  } else if (context.subjectContext) {
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => profile.thpt?.scores?.[subjectId] === undefined);
    missingInputs.push('Chưa đủ 3 môn THPT trong tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `hcmus-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp ${context.subjectContext?.combinationId ?? 'đã chọn'}.`,
      }))
    );
  } else {
    missingInputs.push('Chưa chọn tổ hợp THPT để kiểm tra ngưỡng đầu vào.');
    missingRequirements.push({ kind: 'school-context', code: 'hcmus-subject-combination', label: 'Chọn tổ hợp THPT.' });
  }

  if (context.checkNuclearEngineering) {
    if (input.mathScore !== undefined && input.physicsScore !== undefined) {
      const nuclear = checkHcmusNuclearEngineeringCondition(input.mathScore, input.physicsScore);
      explanation.push({
        id: 'hcmus-nuclear-condition',
        label: 'Điều kiện riêng ngành Kỹ thuật hạt nhân',
        formula: nuclear.requiredText,
        description: nuclear.pass ? 'Đạt điều kiện' : 'Chưa đạt điều kiện',
      });
    } else {
      missingInputs.push('Điểm Toán/Vật lý (thi tốt nghiệp THPT) để kiểm tra điều kiện ngành Kỹ thuật hạt nhân.');
      missingRequirements.push({ kind: 'profile-input', code: 'hcmus-nuclear-math-physics', label: 'Điểm Toán và Vật lý thi tốt nghiệp THPT.' });
    }
  }

  const academic = calculateHcmusAcademicScore({
    thptTotal30: input.thptRawTotal30,
    vactRaw1200: input.vactRaw1200,
    transcriptTotal30: input.transcriptTotal30,
  });

  if (academic.academicScore !== undefined) {
    explanation.push({
      id: 'hcmus-academic-score',
      label: `Điểm học lực (MAX route ${academic.usedRoute === 'thpt' ? 'THPT' : 'ĐGNL'})`,
      inputs: {
        ...(academic.route1Thpt.value !== undefined ? { route1Thpt: academic.route1Thpt.value } : {}),
        ...(academic.route2Vact.value !== undefined ? { route2Vact: academic.route2Vact.value } : {}),
      },
      output: academic.academicScore,
      scale: 30,
      formula: 'MAX(0.8×THPT + 0.2×Học bạ, 0.8×ĐGNL quy đổi thang 30 + 0.2×Học bạ)',
      description: 'Điểm học lực hiện tính được — CHƯA gồm Điểm cộng/Điểm ưu tiên, KHÔNG phải điểm xét tuyển cuối cùng.',
      evidence: hcmusAcademicScoreEvidence.evidence,
    });
  } else {
    if (input.transcriptTotal30 === undefined) {
      missingInputs.push('Điểm học bạ (thang 30, theo tổ hợp đã chọn) để tính Điểm học lực.');
      missingRequirements.push({ kind: 'profile-input', code: 'hcmus-transcript', label: 'Điểm học bạ 3 năm theo tổ hợp đã chọn.' });
    }
    if (input.thptRawTotal30 === undefined && input.vactRaw1200 === undefined) {
      missingInputs.push('Cần điểm THPT hoặc điểm ĐGNL ĐHQG-HCM để tính Điểm học lực.');
      missingRequirements.push({ kind: 'profile-input', code: 'hcmus-thpt-or-vact', label: 'Điểm THPT hoặc điểm ĐGNL ĐHQG-HCM.' });
    }
    if (academic.route2Vact.vactOutOfSupportedRange) {
      missingInputs.push('Điểm ĐGNL nằm ngoài phạm vi bảng quy đổi chính thức (370–1139) nên chưa quy đổi được.');
      missingRequirements.push({
        kind: 'unsupported',
        code: 'hcmus-vact-out-of-range',
        label: 'Điểm ĐGNL ngoài phạm vi bảng quy đổi chính thức (370–1139).',
      });
    }
  }

  missingRequirements.push(
    ...hcmusKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  return {
    schoolId: 'hcmus',
    year: hcmusAdmissionMethods[0].year,
    methodId: hcmusAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility:
      context.subjectContext && input.thptRawTotal30 !== undefined
        ? {
            status: checkHcmusThptThreshold(input.thptRawTotal30).pass ? 'eligible' : 'ineligible',
            reasons: [checkHcmusThptThreshold(input.thptRawTotal30).requiredText],
          }
        : { status: 'unknown', reasons: ['Cần đủ tổng 3 môn THPT theo tổ hợp để kiểm tra ngưỡng đầu vào.'] },
    missingInputs,
    missingRules: hcmusKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: hcmusThresholdEvidence.evidence,
  };
}
