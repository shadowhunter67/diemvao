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
import { buildUehEvaluationInput } from '../schools/ueh/applicantProfileAdapter';
import { evaluateUehAdmission, type UehPartialInput } from '../schools/ueh/evaluate';
import { uehAdmissionMethods } from '../schools/ueh/methods';
import { evaluateUelAdmission, type UelEvaluationContext } from '../schools/uel/evaluate';
import { uelAdmissionMethods } from '../schools/uel/methods';
import { evaluateUitAdmission, type UitEvaluationContext } from '../schools/uit/evaluate';
import { uitAdmissionMethods } from '../schools/uit/methods';

export interface SchoolEvaluationSummary {
  schoolId: string;
  schoolName: string;
  shortName: string;
  methodId: string;
  methodName: string;
  evaluation: AdmissionEvaluation;
  cutoffComparison?: CutoffComparison;
}

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
  const uehInput = buildUehEvaluationInput(profile, contexts.ueh);
  const summaries = [
    evaluateHcmut(profile, contexts),
    summarize('ueh', uehAdmissionMethods[0].id, uehAdmissionMethods[0].name, evaluateUehAdmission(uehInput)),
    summarize('uel', uelAdmissionMethods[0].id, uelAdmissionMethods[0].name, evaluateUelAdmission(profile, contexts.uel)),
    summarize('uit', uitAdmissionMethods[0].id, uitAdmissionMethods[0].name, evaluateUitAdmission(profile, contexts.uit)),
  ];

  return summaries;
}
