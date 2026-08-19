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
    missingInputs.push('Chưa chọn ngành UHS.');
    missingRequirements.push({ kind: 'school-context', code: 'program', label: 'Chọn ngành UHS.' });
  }

  if (!context.subjectContext) {
    missingInputs.push('Chưa chọn tổ hợp để tính thành phần THPT/HB.');
    missingRequirements.push({ kind: 'school-context', code: 'uhs-subject-combination', label: 'Chọn tổ hợp xét tuyển UHS.' });
  } else if (input.combinationTotal30 === undefined) {
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => profile.thpt?.scores?.[subjectId] === undefined);
    missingInputs.push('Chưa đủ điểm THPT các môn trong tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `uhs-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]}.`,
      }))
    );
  }

  let eligibility: AdmissionEvaluation['eligibility'] = {
    status: 'unknown',
    reasons: ['Cần chọn ngành và khai báo học lực lớp 12/điểm đường vào để kiểm tra điều kiện UHS.'],
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
      label: 'Điều kiện đầu vào',
      inputs: numericInputs({
        combinationTotal30: input.combinationTotal30,
        graduationScore10: context.graduationScore10,
      }),
      formula: entry.requiredText,
      evidence: uhsThresholdEvidence.evidence,
    });
    if (!context.grade12Performance) {
      missingRequirements.push({ kind: 'profile-input', code: 'uhs-grade12-performance', label: 'Học lực lớp 12 theo điều kiện UHS.' });
    }
  }

  if (components.thpt100 !== undefined) {
    explanation.push({
      id: 'uhs-thpt-component',
      label: components.inferredThptFromDgnl ? 'THPT quy đổi từ ĐGNL' : 'THPT thang 100',
      inputs: numericInputs({ combinationTotal30: input.combinationTotal30, dgnlRaw1200: input.dgnlRaw1200 }),
      output: components.thpt100,
      scale: 100,
      formula: components.inferredThptFromDgnl ? 'THPT = ĐGNL x 1.15' : 'THPT = tổng 3 môn x 100 / 30',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  }

  if (components.dgnl100 !== undefined) {
    explanation.push({
      id: 'uhs-dgnl-component',
      label: components.inferredDgnlFromThpt ? 'ĐGNL quy đổi từ THPT' : 'ĐGNL thang 100',
      inputs: numericInputs({ combinationTotal30: input.combinationTotal30, dgnlRaw1200: input.dgnlRaw1200 }),
      output: components.dgnl100,
      scale: 100,
      formula: components.inferredDgnlFromThpt ? 'ĐGNL = THPT x 0.87' : 'ĐGNL = điểm ĐGNL x 100 / 1200',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  } else {
    missingRequirements.push({ kind: 'profile-input', code: 'uhs-dgnl-or-conversion', label: 'Điểm ĐGNL hoặc điều kiện quy đổi thành phần ĐGNL.' });
  }

  if (components.transcript100 !== undefined) {
    explanation.push({
      id: 'uhs-transcript-component',
      label: 'Học bạ thang 100',
      inputs: numericInputs({ transcriptTotal30: input.transcriptTotal30 }),
      output: components.transcript100,
      scale: 100,
      formula: 'HB = tổng điểm TB 3 môn x 100 / 30',
      evidence: uhsIntegratedFormulaEvidence.evidence,
    });
  } else if (context.subjectContext) {
    missingRequirements.push({ kind: 'profile-input', code: 'uhs-transcript', label: 'Điểm học bạ 3 năm cho các môn trong tổ hợp UHS.' });
  }

  if (context.bonus) {
    const bonus = calculateUhsBonus(context.bonus);
    explanation.push({
      id: 'uhs-bonus',
      label: 'Điểm cộng UHS',
      inputs: numericInputs({
        satScore: context.bonus.satScore,
        preferredAverage: context.bonus.preferredSchool?.averageAcademicScore10,
      }),
      output: bonus.totalBonus,
      formula: 'Điểm cộng chứng chỉ/SAT dùng hệ số 5 và cấp nhóm chứng chỉ/SAT 5 điểm.',
      description: bonus.notes.join(' '),
      evidence: uhsBonusEvidence.evidence,
    });
  }

  if (context.priority100 !== undefined) {
    explanation.push({
      id: 'uhs-priority-input',
      label: 'Điểm ưu tiên thang 100',
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
