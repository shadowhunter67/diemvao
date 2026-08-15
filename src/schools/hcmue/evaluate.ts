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
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Chon nganh HCMUE de kiem tra nguong dau vao.' });
  } else if (!program) {
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Nganh HCMUE da chon khong co trong bang nguong 2026 da xac minh.' });
  }

  let thptTotal30: number | undefined;
  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmue-subject-combination', label: 'Chon to hop THPT HCMUE.' });
  } else {
    const missingSubjects: SubjectId[] = [];
    const total = context.subjectContext.subjects.reduce((sum, subjectId) => {
      const score = profile.thpt?.scores?.[subjectId];
      if (score === undefined) missingSubjects.push(subjectId);
      return sum + (score ?? 0);
    }, 0);
    if (missingSubjects.length > 0) {
      missingInputs.push('Chua du 3 mon THPT trong to hop HCMUE da chon.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `hcmue-thpt-${subjectId}`,
          label: `Diem THPT mon ${SUBJECT_LABELS[subjectId]} cho to hop HCMUE.`,
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
      label: 'Nguong dau vao THPT HCMUE 2026',
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
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Can chon nganh, to hop va nhap diem THPT de kiem tra nguong HCMUE.'] },
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
