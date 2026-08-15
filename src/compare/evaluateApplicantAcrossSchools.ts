import type { ApplicantProfile } from '../core/applicantProfile';
import type { AdmissionEvaluation, MissingRequirement } from '../core/admissionEvaluation';
import type { CutoffComparison } from '../core/cutoffComparison';
import { findCutoffComparison } from '../core/cutoffComparison';
import { canCompareEvaluationToCutoff } from './cutoffEligibility';
import { schoolRegistry } from '../schools';
import { buildHcmutAdmissionInput, type HcmutMethodContext } from '../schools/hcmut/applicantProfileAdapter';
import { evaluateHcmutAdmission } from '../schools/hcmut/evaluate';
import { hcmutAdmissionMethods } from '../schools/hcmut/methods';
import { hcmutCutoffs } from '../schools/hcmut/data/cutoffs';
import { buildUehEvaluationInput, buildUehExactEvaluationInput } from '../schools/ueh/applicantProfileAdapter';
import { evaluateUehAdmission, evaluateUehExactAdmission, type UehPartialInput } from '../schools/ueh/evaluate';
import { uehAdmissionMethods } from '../schools/ueh/methods';
import { uehCutoffs } from '../schools/ueh/data/cutoffs';
import { uehPrograms } from '../schools/ueh/data/programs';
import { evaluateUelAdmission, type UelEvaluationContext } from '../schools/uel/evaluate';
import { uelAdmissionMethods } from '../schools/uel/methods';
import { uelCutoffs } from '../schools/uel/data/cutoffs';
import { evaluateUitAdmission, type UitEvaluationContext } from '../schools/uit/evaluate';
import { uitAdmissionMethods } from '../schools/uit/methods';
import { evaluateHcmusAdmission, type HcmusEvaluationContext } from '../schools/hcmus/evaluate';
import { hcmusAdmissionMethods } from '../schools/hcmus/methods';
import { evaluateUsshAdmission, type UsshEvaluationContext } from '../schools/ussh/evaluate';
import { usshAdmissionMethods } from '../schools/ussh/methods';
import { usshCutoffs } from '../schools/ussh/data/cutoffs';
import { evaluateUhsAdmission, type UhsEvaluationContext } from '../schools/uhs/evaluate';
import { uhsAdmissionMethods } from '../schools/uhs/methods';
import { evaluateIuAdmission, type IuEvaluationContext } from '../schools/iu/evaluate';
import { iuAdmissionMethods } from '../schools/iu/methods';
import { iuCutoffs2026 } from '../schools/iu/data/cutoffs';
import { evaluateAguAdmission, type AguEvaluationContext } from '../schools/agu/evaluate';
import { aguAdmissionMethods } from '../schools/agu/methods';

export interface SchoolEvaluationSummary {
  schoolId: string;
  schoolName: string;
  shortName: string;
  methodId: string;
  methodName: string;
  evaluation: AdmissionEvaluation;
  cutoffComparison?: CutoffComparison;
}

export const COMPARE_SCHOOL_ORDER = ['hcmut', 'ueh', 'iu', 'uel', 'hcmus', 'ussh', 'uhs', 'uit', 'agu'] as const;

export interface MultiSchoolEvaluationContext {
  hcmut?: {
    methodContext?: HcmutMethodContext;
    selectedProgramId?: string;
  };
  ueh?: UehPartialInput & {
    selectedProgramId?: string;
  };
  uel?: UelEvaluationContext & {
    selectedProgramId?: string;
  };
  uit?: UitEvaluationContext & {
    selectedProgramId?: string;
  };
  hcmus?: HcmusEvaluationContext;
  ussh?: UsshEvaluationContext & {
    selectedProgramId?: string;
  };
  uhs?: UhsEvaluationContext;
  iu?: IuEvaluationContext;
  agu?: AguEvaluationContext;
}

function unavailableEvaluation(input: {
  schoolId: string;
  year: number;
  methodId: string;
  missingInputs: string[];
  missingRules?: string[];
  missingRequirements?: MissingRequirement[];
}): AdmissionEvaluation {
  return {
    schoolId: input.schoolId,
    year: input.year,
    methodId: input.methodId,
    confidence: 'unavailable',
    eligibility: { status: 'unknown', reasons: ['Chưa đủ dữ liệu hoặc ngữ cảnh để đánh giá.'] },
    missingInputs: input.missingInputs,
    missingRules: input.missingRules ?? [],
    missingRequirements: input.missingRequirements ?? [],
    explanation: [],
    evidence: [],
  };
}

function classifyHcmutMissingInput(message: string): MissingRequirement {
  const normalized = message.toLowerCase();
  if (normalized.includes('dgnl') || normalized.includes('đgnl')) {
    return { kind: 'profile-input', code: 'hcmut-dgnl', label: message };
  }
  if (normalized.includes('thpt')) {
    return { kind: 'profile-input', code: 'hcmut-thpt', label: message };
  }
  if (normalized.includes('học bạ') || normalized.includes('hoc ba') || normalized.includes('transcript')) {
    return { kind: 'profile-input', code: 'hcmut-transcript', label: message };
  }
  return { kind: 'profile-input', code: 'hcmut-profile-input', label: message };
}

function summarize(schoolId: string, methodId: string, methodName: string, evaluation: AdmissionEvaluation): SchoolEvaluationSummary {
  const school = schoolRegistry[schoolId];
  return {
    schoolId,
    schoolName: school.name,
    shortName: school.shortName,
    methodId,
    methodName,
    evaluation,
  };
}

function evaluateHcmut(profile: ApplicantProfile, context: MultiSchoolEvaluationContext): SchoolEvaluationSummary {
  const method = hcmutAdmissionMethods[0];
  let evaluation: AdmissionEvaluation;
  if (!context.hcmut?.methodContext) {
    const label = 'Cần chọn tổ hợp, điểm cộng và điểm ưu tiên theo ngữ cảnh HCMUT.';
    evaluation = unavailableEvaluation({
      schoolId: 'hcmut',
      year: method.year,
      methodId: method.id,
      missingInputs: [label],
      missingRequirements: [{ kind: 'school-context', code: 'hcmut-context', label }],
    });
  } else {
    try {
      evaluation = evaluateHcmutAdmission(buildHcmutAdmissionInput(profile, context.hcmut.methodContext));
    } catch (error) {
      const label = error instanceof Error ? error.message : 'Không thể build input HCMUT từ hồ sơ.';
      evaluation = unavailableEvaluation({
        schoolId: 'hcmut',
        year: method.year,
        methodId: method.id,
        missingInputs: [label],
        missingRequirements: [classifyHcmutMissingInput(label)],
      });
    }
  }

  const summary = summarize('hcmut', method.id, method.name, evaluation);
  if (canCompareEvaluationToCutoff(evaluation) && !context.hcmut?.selectedProgramId) {
    const label = 'Chọn ngành HCMUT để so với đúng mốc điểm chuẩn.';
    summary.evaluation = {
      ...summary.evaluation,
      missingInputs: summary.evaluation.missingInputs,
      missingRules: summary.evaluation.missingRules,
      missingRequirements: [...(summary.evaluation.missingRequirements ?? []), { kind: 'school-context', code: 'program', label }],
    };
  }
  if (canCompareEvaluationToCutoff(evaluation) && evaluation.score && context.hcmut?.selectedProgramId) {
    const records = hcmutCutoffs
      .filter((cutoff) => cutoff.programId === context.hcmut?.selectedProgramId && cutoff.method === 'combined')
      .map((cutoff) => ({ ...cutoff, scoreScale: 100 }));
    summary.cutoffComparison = findCutoffComparison({
      records,
      targetYear: method.year,
      applicantScore: evaluation.score.value,
      applicantScale: evaluation.score.scale,
      selection: { programId: context.hcmut.selectedProgramId, methodId: 'combined' },
    });
  }
  return summary;
}

export function evaluateApplicantAcrossSchools(
  profile: ApplicantProfile,
  contexts: MultiSchoolEvaluationContext = {}
): SchoolEvaluationSummary[] {
  return [
    evaluateHcmut(profile, contexts),
    evaluateUeh(profile, contexts),
    evaluateIu(profile, contexts),
    evaluateUel(profile, contexts),
    summarize('hcmus', hcmusAdmissionMethods[0].id, hcmusAdmissionMethods[0].name, evaluateHcmusAdmission(profile, contexts.hcmus)),
    evaluateUssh(profile, contexts),
    summarize('uhs', uhsAdmissionMethods[0].id, uhsAdmissionMethods[0].name, evaluateUhsAdmission(profile, contexts.uhs)),
    summarize('uit', uitAdmissionMethods[0].id, uitAdmissionMethods[0].name, evaluateUitAdmission(profile, contexts.uit)),
    summarize('agu', aguAdmissionMethods[0].id, aguAdmissionMethods[0].name, evaluateAguAdmission(profile, contexts.agu)),
  ];
}

function evaluateUel(profile: ApplicantProfile, contexts: MultiSchoolEvaluationContext): SchoolEvaluationSummary {
  const method = uelAdmissionMethods[0];
  const evaluation = evaluateUelAdmission(profile, contexts.uel);
  const summary = summarize('uel', method.id, method.name, evaluation);
  if (canCompareEvaluationToCutoff(evaluation) && !contexts.uel?.selectedProgramId) {
    summary.evaluation = {
      ...summary.evaluation,
      missingRequirements: [
        ...(summary.evaluation.missingRequirements ?? []),
        { kind: 'school-context', code: 'program', label: 'Chon nganh UEL de so voi dung muc diem chuan.' },
      ],
    };
  }
  if (canCompareEvaluationToCutoff(evaluation) && evaluation.score && contexts.uel?.selectedProgramId) {
    const records = uelCutoffs.filter((cutoff) => cutoff.programId === contexts.uel?.selectedProgramId);
    summary.cutoffComparison = findCutoffComparison({
      records,
      targetYear: method.year,
      applicantScore: evaluation.score.value,
      applicantScale: evaluation.score.scale,
      selection: { programId: contexts.uel.selectedProgramId },
    });
  }
  return summary;
}

function getUsshApplicantType(evaluation: AdmissionEvaluation): 'DT1' | 'DT2' | 'DT3' | undefined {
  const finalLabel = evaluation.explanation.find((step) => step.id === 'ussh-final')?.label ?? '';
  const match = /\((DT[123])\)/.exec(finalLabel);
  return match?.[1] as 'DT1' | 'DT2' | 'DT3' | undefined;
}

function evaluateUssh(profile: ApplicantProfile, contexts: MultiSchoolEvaluationContext): SchoolEvaluationSummary {
  const method = usshAdmissionMethods[0];
  const evaluation = evaluateUsshAdmission(profile, contexts.ussh);
  const summary = summarize('ussh', method.id, method.name, evaluation);
  const applicantTypeId = getUsshApplicantType(evaluation);

  if (canCompareEvaluationToCutoff(evaluation) && !contexts.ussh?.selectedProgramId) {
    summary.evaluation = {
      ...summary.evaluation,
      missingRequirements: [
        ...(summary.evaluation.missingRequirements ?? []),
        { kind: 'school-context', code: 'program', label: 'Chon nganh USSH de so voi dung muc diem chuan.' },
      ],
    };
  }
  if (canCompareEvaluationToCutoff(evaluation) && evaluation.score && contexts.ussh?.selectedProgramId && applicantTypeId) {
    const records = usshCutoffs.filter((cutoff) => cutoff.programId === contexts.ussh?.selectedProgramId);
    summary.cutoffComparison = findCutoffComparison({
      records,
      targetYear: method.year,
      applicantScore: evaluation.score.value,
      applicantScale: evaluation.score.scale,
      selection: { programId: contexts.ussh.selectedProgramId, applicantTypeId },
    });
  }
  return summary;
}

function evaluateUeh(profile: ApplicantProfile, contexts: MultiSchoolEvaluationContext): SchoolEvaluationSummary {
  const method = uehAdmissionMethods[0];
  const selectedProgram = uehPrograms.find((program) => program.id === contexts.ueh?.selectedProgramId);
  const campus = contexts.ueh?.campus ?? selectedProgram?.campus ?? 'hcmc';
  const exactInput = buildUehExactEvaluationInput(profile, { campus });
  let evaluation = evaluateUehExactAdmission(exactInput);
  if (evaluation.score === undefined && profile.exams?.vact?.total !== undefined && exactInput.examScore30 === undefined) {
    evaluation = evaluateUehAdmission(buildUehEvaluationInput(profile, contexts.ueh));
  }
  const summary = summarize('ueh', method.id, method.name, evaluation);

  if (canCompareEvaluationToCutoff(evaluation) && !contexts.ueh?.selectedProgramId) {
    summary.evaluation = {
      ...summary.evaluation,
      missingRequirements: [
        ...(summary.evaluation.missingRequirements ?? []),
        { kind: 'school-context', code: 'program', label: 'Chọn ngành UEH để so với đúng mốc điểm chuẩn.' },
      ],
    };
  }
  if (canCompareEvaluationToCutoff(evaluation) && evaluation.score && contexts.ueh?.selectedProgramId) {
    const records = uehCutoffs.filter((cutoff) => cutoff.programId === contexts.ueh?.selectedProgramId);
    summary.cutoffComparison = findCutoffComparison({
      records,
      targetYear: method.year,
      applicantScore: evaluation.score.value,
      applicantScale: evaluation.score.scale,
      selection: { programId: contexts.ueh.selectedProgramId },
    });
  }
  return summary;
}

function evaluateIu(profile: ApplicantProfile, contexts: MultiSchoolEvaluationContext): SchoolEvaluationSummary {
  const method = iuAdmissionMethods[0];
  const evaluation = evaluateIuAdmission(profile, contexts.iu);
  const summary = summarize('iu', method.id, method.name, evaluation);

  if (canCompareEvaluationToCutoff(evaluation) && !contexts.iu?.programId) {
    summary.evaluation = {
      ...summary.evaluation,
      missingRequirements: [
        ...(summary.evaluation.missingRequirements ?? []),
        { kind: 'school-context', code: 'program', label: 'Chọn ngành IU để so với đúng mốc điểm chuẩn.' },
      ],
    };
  }
  if (canCompareEvaluationToCutoff(evaluation) && evaluation.score && contexts.iu?.programId) {
    const records = iuCutoffs2026.filter((cutoff) => cutoff.programId === contexts.iu?.programId);
    summary.cutoffComparison = findCutoffComparison({
      records,
      targetYear: method.year,
      applicantScore: evaluation.score.value,
      applicantScale: evaluation.score.scale,
      selection: { programId: contexts.iu.programId },
    });
  }
  return summary;
}
