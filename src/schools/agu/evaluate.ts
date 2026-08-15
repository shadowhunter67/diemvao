import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { aguAdmissionMethods } from './methods';
import { aguKnowledgeGaps } from './knowledgeGaps';
import { checkAguDgnlThreshold, checkAguThptThreshold } from './eligibility';

export interface AguEvaluationContext {
  selectedProgramCode?: string;
  subjectContext?: {
    combinationId?: string;
    subjects: readonly SubjectId[];
  };
}

export function evaluateAguAdmission(profile: ApplicantProfile, context: AguEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (!context.selectedProgramCode) {
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Chon nganh AGU de doi chieu nguong dang ky xet tuyen 2026.' });
  }

  let thptTotal30: number | undefined;
  if (context.subjectContext) {
    let total = 0;
    const missingSubjects: SubjectId[] = [];
    for (const subjectId of context.subjectContext.subjects) {
      const score = profile.thpt?.scores?.[subjectId];
      if (score === undefined) missingSubjects.push(subjectId);
      else total += score;
    }
    if (missingSubjects.length === 0) thptTotal30 = Math.round(total * 100) / 100;
    else {
      missingInputs.push('Chua du 3 mon THPT trong to hop AGU da chon.');
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `agu-thpt-${subjectId}`,
          label: `Diem THPT mon ${SUBJECT_LABELS[subjectId]} cho to hop AGU.`,
        }))
      );
    }
  } else {
    missingRequirements.push({ kind: 'school-context', code: 'agu-subject-combination', label: 'Chon to hop THPT AGU.' });
  }

  const reasons: string[] = [];
  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  if (context.selectedProgramCode && thptTotal30 !== undefined) {
    const thpt = checkAguThptThreshold(thptTotal30, context.selectedProgramCode);
    status = thpt.pass ? 'eligible' : 'ineligible';
    reasons.push(thpt.requiredText);
    explanation.push({ id: 'agu-thpt-threshold', label: 'Nguong THPT AGU 2026', output: thptTotal30, scale: 30, formula: thpt.requiredText });
  }
  if (context.selectedProgramCode && profile.exams?.vact?.total !== undefined) {
    const dgnl = checkAguDgnlThreshold(profile.exams.vact.total, context.selectedProgramCode);
    reasons.push(dgnl.requiredText);
    explanation.push({ id: 'agu-dgnl-threshold', label: 'Nguong DGNL AGU 2026', output: profile.exams.vact.total, scale: 1200, formula: dgnl.requiredText });
    if (status === 'unknown') status = dgnl.pass ? 'eligible' : 'ineligible';
  }

  return {
    schoolId: 'agu',
    year: aguAdmissionMethods[0].year,
    methodId: aguAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: { status, reasons: reasons.length > 0 ? reasons : ['Can chon nganh va nhap diem de kiem tra nguong AGU.'] },
    missingInputs,
    missingRules: aguKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: [
      ...missingRequirements,
      ...aguKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
    ],
    explanation,
    evidence: [],
  };
}
