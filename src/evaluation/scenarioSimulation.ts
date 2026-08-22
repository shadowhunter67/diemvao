import type { ApplicantProfile } from '../core/applicantProfile';
import type { SubjectId } from '../core/subjects';
import { evaluateSchool, type GenericSchoolEvaluationResult } from './schoolEvaluation';

export interface ApplicantProfilePatch {
  graduationYear?: number;
  thpt?: {
    scores?: Partial<Record<SubjectId, number>>;
  } & Partial<Record<SubjectId, number>>;
  transcript?: ApplicantProfile['transcript'];
  exams?: ApplicantProfile['exams'];
  vactTotal?: number;
  certificates?: ApplicantProfile['certificates'];
  priority?: ApplicantProfile['priority'];
  preferredCombinationId?: string;
}

export interface ScenarioSchoolResult {
  schoolId: string;
  before: GenericSchoolEvaluationResult;
  after: GenericSchoolEvaluationResult;
  delta?: number;
  statusChanged: boolean;
  missingInputs: string[];
}

export interface EvaluateScenarioOptions<TContextMap extends Record<string, unknown> = Record<string, unknown>> {
  schools: readonly string[];
  contexts?: TContextMap;
}

function cloneProfile(profile: ApplicantProfile): ApplicantProfile {
  return structuredClone(profile);
}

export function applyScenarioPatch(baseProfile: ApplicantProfile, patch: ApplicantProfilePatch): ApplicantProfile {
  const next = cloneProfile(baseProfile);

  if (patch.graduationYear !== undefined) next.graduationYear = patch.graduationYear;
  if (patch.preferredCombinationId !== undefined) next.preferredCombinationId = patch.preferredCombinationId;
  if (patch.priority) next.priority = { ...next.priority, ...patch.priority };
  if (patch.certificates) next.certificates = { ...next.certificates, ...patch.certificates };
  if (patch.transcript) {
    next.transcript = {
      ...next.transcript,
      grade10: { ...next.transcript?.grade10, ...patch.transcript.grade10 },
      grade11: { ...next.transcript?.grade11, ...patch.transcript.grade11 },
      grade12: { ...next.transcript?.grade12, ...patch.transcript.grade12 },
    };
  }
  if (patch.exams) next.exams = { ...next.exams, ...patch.exams };
  if (patch.vactTotal !== undefined) {
    next.exams = { ...next.exams, vact: { ...next.exams?.vact, total: patch.vactTotal } };
  }
  if (patch.thpt) {
    const { scores, ...directSubjects } = patch.thpt;
    next.thpt = {
      ...next.thpt,
      scores: { ...next.thpt?.scores, ...directSubjects, ...scores },
    };
  }

  return next;
}

function scoreDelta(before: GenericSchoolEvaluationResult, after: GenericSchoolEvaluationResult): number | undefined {
  if (before.score === undefined || after.score === undefined) return undefined;
  return after.score - before.score;
}

export function evaluateScenario<TContextMap extends Record<string, unknown> = Record<string, unknown>>(
  baseProfile: ApplicantProfile,
  patch: ApplicantProfilePatch,
  options: EvaluateScenarioOptions<TContextMap>
): ScenarioSchoolResult[] {
  const afterProfile = applyScenarioPatch(baseProfile, patch);
  const contexts = options.contexts ?? ({} as TContextMap);

  return options.schools.map((schoolId) => {
    const context = contexts[schoolId];
    const before = evaluateSchool(baseProfile, schoolId, { context });
    const after = evaluateSchool(afterProfile, schoolId, { context });
    return {
      schoolId,
      before,
      after,
      delta: scoreDelta(before, after),
      statusChanged: before.status !== after.status,
      missingInputs: after.missingInputs,
    };
  });
}
