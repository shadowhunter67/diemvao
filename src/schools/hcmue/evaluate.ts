import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hcmueAdmissionMethods } from './methods';
import { hcmueKnowledgeGaps } from './knowledgeGaps';
import { checkHcmueThptThreshold, getHcmueProgramThreshold } from './eligibility';
import { hcmueProgramThresholdEvidence, hcmueThptFormulaEvidence } from './evidence';

export interface HcmueEvaluationContext {
  selectedProgramId?: string;
  subjectContext?: {
    combinationId?: string;
    subjects: readonly SubjectId[];
  };
}

export function evaluateHcmueAdmission(profile: ApplicantProfile, context: HcmueEvaluationContext = {}): AdmissionEvaluation {
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const explanation: CalculationStep[] = [];
  const program = getHcmueProgramThreshold(context.selectedProgramId);

  if (!context.selectedProgramId) {
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Chọn ngành HCMUE để kiểm tra ngưỡng đầu vào.' });
  } else if (!program) {
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Ngành HCMUE đã chọn không có trong bảng ngưỡng 2026 đã xác minh.' });
  }

  let thptTotal30: number | undefined;
  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmue-subject-combination', label: 'Chọn tổ hợp THPT HCMUE.' });
  } else {
    const missingSubjects: SubjectId[] = [];
    const total = context.subjectContext.subjects.reduce((sum, subjectId) => {
      const score = profile.thpt?.scores?.[subjectId];
      if (score === undefined) missingSubjects.push(subjectId);
      return sum + (score ?? 0);
    }, 0);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chưa đủ 3 môn THPT trong tổ hợp HCMUE đã chọn.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `hcmue-thpt-${subjectId}`,
          label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HCMUE.`,
        }))
      );
    } else {
      thptTotal30 = Math.round(total * 100) / 100;
    }
  }

  const reasons: string[] = [];
  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  if (program && thptTotal30 !== undefined) {
    const threshold = checkHcmueThptThreshold(thptTotal30, program.id);
    status = threshold.pass ? 'eligible' : 'ineligible';
    reasons.push(threshold.requiredText);
    explanation.push({
      id: 'hcmue-thpt-threshold',
      label: 'Ngưỡng đầu vào THPT HCMUE 2026',
      output: thptTotal30,
      scale: 30,
      formula: threshold.requiredText,
    });
  }

  return {
    schoolId: 'hcmue',
    year: hcmueAdmissionMethods[0].year,
    methodId: hcmueAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Cần chọn ngành, tổ hợp và nhập điểm THPT để kiểm tra ngưỡng HCMUE.'] },
    missingInputs,
    missingRules: hcmueKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: [
      ...missingRequirements,
      ...hcmueKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
    ],
    explanation,
    evidence: [...hcmueProgramThresholdEvidence.evidence, ...hcmueThptFormulaEvidence.evidence],
  };
}
