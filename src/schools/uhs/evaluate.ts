import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UhsSubjectContext } from './applicantProfileAdapter';
import { buildUhsEvaluationInput } from './applicantProfileAdapter';
import { calculateUhsBonus, type UhsBonusInput } from './bonus';
import { calculateUhsNormalizedComponents } from './calculator';
import { checkUhsEntryEligibility, type UhsAcademicPerformanceLevel } from './eligibility';
import { uhsAdmissionMethods } from './methods';
import { uhsKnowledgeGaps } from './knowledgeGaps';
import { uhsBonusEvidence, uhsIntegratedFormulaEvidence, uhsThresholdEvidence } from './evidence';
import { findUhsProgram } from './programs';

export interface UhsEvaluationContext {
  subjectContext?: UhsSubjectContext;
  selectedProgramId?: string;
  grade12Performance?: UhsAcademicPerformanceLevel;
  graduationScore10?: number;
  bonus?: UhsBonusInput;
  priority100?: number;
}

function numericInputs(inputs: Record<string, number | undefined>): Record<string, number> {
  return Object.fromEntries(Object.entries(inputs).filter((entry): entry is [string, number] => entry[1] !== undefined));
}

export function evaluateUhsAdmission(profile: ApplicantProfile, context: UhsEvaluationContext = {}): AdmissionEvaluation {
  const program = findUhsProgram(context.selectedProgramId);
  const input = buildUhsEvaluationInput(profile, context.subjectContext);
  const components = calculateUhsNormalizedComponents({
    thptTotal30: input.combinationTotal30,
    dgnlRaw1200: input.dgnlRaw1200,
    transcriptTotal30: input.transcriptTotal30,
    graduationYear: input.graduationYear,
  });
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (!program) {
    missingInputs.push('Chua chon nganh UHS.');
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Chon nganh UHS.' });
  }

  if (!context.subjectContext) {
    missingInputs.push('Chua chon to hop de tinh thanh phan THPT/HB.');
    missingRequirements.push({ kind: 'school-context', code: 'uhs-subject-combination', label: 'Chon to hop xet tuyen UHS.' });
  } else if (input.combinationTotal30 === undefined) {
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => profile.thpt?.scores?.[subjectId] === undefined);
    missingInputs.push('Chua du diem THPT cac mon trong to hop da chon.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `uhs-thpt-${subjectId}`,
        label: `Diem THPT mon ${SUBJECT_LABELS[subjectId]}.`,
      }))
    );
  }

  let eligibility: AdmissionEvaluation['eligibility'] = {
    status: 'unknown',
    reasons: ['Can chon nganh va khai bao hoc luc lop 12/de diem duong vao de kiem tra dieu kien UHS.'],
  };

  if (program) {
    const entry = checkUhsEntryEligibility({
      programGroup: program.group,
      combinationTotal30: input.combinationTotal30,
      grade12Performance: context.grade12Performance,
      graduationScore10: context.graduationScore10,
    });
    eligibility = { status: entry.pass ? 'eligible' : 'ineligible', reasons: [entry.requiredText] };
    explanation.push({
      id: 'uhs-entry-threshold',
      label: 'Dieu kien dau vao',
      inputs: numericInputs({
        combinationTotal30: input.combinationTotal30,
        graduationScore10: context.graduationScore10,
      }),
      formula: entry.requiredText,
      evidence: uhsThresholdEvidence.evidence,
    });
    if (!context.grade12Performance) {
      missingRequirements.push({ kind: 'profile-input', code: 'uhs-grade12-performance', label: 'Hoc luc lop 12 theo dieu kien UHS.' });
    }
  }

  if (components.thpt100 !== undefined) {
    explanation.push({
      id: 'uhs-thpt-component',
      label: components.inferredThptFromDgnl ? 'THPT quy doi tu DGNL' : 'THPT thang 100',
      inputs: numericInputs({ combinationTotal30: input.combinationTotal30, dgnlRaw1200: input.dgnlRaw1200 }),
      output: components.thpt100,
      scale: 100,
      formula: components.inferredThptFromDgnl ? 'THPT = DGNL x 1.15' : 'THPT = tong 3 mon x 100 / 30',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  }

  if (components.dgnl100 !== undefined) {
    explanation.push({
      id: 'uhs-dgnl-component',
      label: components.inferredDgnlFromThpt ? 'DGNL quy doi tu THPT' : 'DGNL thang 100',
      inputs: numericInputs({ combinationTotal30: input.combinationTotal30, dgnlRaw1200: input.dgnlRaw1200 }),
      output: components.dgnl100,
      scale: 100,
      formula: components.inferredDgnlFromThpt ? 'DGNL = THPT x 0.87' : 'DGNL = diem DGNL x 100 / 1200',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  } else {
    missingRequirements.push({ kind: 'profile-input', code: 'uhs-dgnl-or-conversion', label: 'Diem DGNL hoac dieu kien quy doi thanh phan DGNL.' });
  }

  if (components.transcript100 !== undefined) {
    explanation.push({
      id: 'uhs-transcript-component',
      label: 'Hoc ba thang 100',
      inputs: numericInputs({ transcriptTotal30: input.transcriptTotal30 }),
      output: components.transcript100,
      scale: 100,
      formula: 'HB = tong diem TB 3 mon x 100 / 30',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  } else if (context.subjectContext) {
    missingRequirements.push({ kind: 'profile-input', code: 'uhs-transcript', label: 'Diem hoc ba 3 nam cho cac mon trong to hop UHS.' });
  }

  if (context.bonus) {
    const bonus = calculateUhsBonus(context.bonus);
    explanation.push({
      id: 'uhs-bonus',
      label: 'Diem cong UHS',
      inputs: numericInputs({
        satScore: context.bonus.satScore,
        preferredAverage: context.bonus.preferredSchool?.averageAcademicScore10,
      }),
      output: bonus.totalBonus,
      formula: 'Diem cong chung chi/SAT dung he so 5 va cap nhom chung chi/SAT 5 diem.',
      description: bonus.notes.join(' '),
      evidence: uhsBonusEvidence.evidence,
    });
  }

  if (context.priority100 !== undefined) {
    explanation.push({
      id: 'uhs-priority-input',
      label: 'Diem uu tien thang 100',
      inputs: { priority100: context.priority100 },
      output: context.priority100,
      scale: 100,
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  }

  missingRequirements.push(
    ...uhsKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  return {
    schoolId: 'uhs',
    year: uhsAdmissionMethods[0].year,
    methodId: uhsAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility,
    missingInputs,
    missingRules: uhsKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: [...uhsIntegratedFormulaEvidence.evidence, ...uhsThresholdEvidence.evidence, ...uhsBonusEvidence.evidence],
  };
}
