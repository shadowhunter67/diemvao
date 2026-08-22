import type { ApplicantProfile } from '../core/applicantProfile';
import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import { deriveInstitutionSupportStatus, type InstitutionSupportStatus } from '../data/institutionCoverage';
import { schoolRegistry } from '../schools';
import { schoolComparisonAdapterRegistry } from '../compare/comparisonRegistry';
import type { SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

export type SchoolEvaluationStatus =
  | 'calculated'
  | 'partial'
  | 'eligible'
  | 'ineligible'
  | 'missing-input'
  | 'unsupported';

export interface GenericSchoolEvaluationResult {
  schoolId: string;
  status: SchoolEvaluationStatus;
  evaluation?: AdmissionEvaluation;
  score?: number;
  scoreScale?: number;
  missingInputs: string[];
  notes: string[];
  methodId?: string;
  programId?: string;
  comparison?: SchoolComparisonResult;
}

export interface EvaluateSchoolOptions<TContext = unknown> {
  context?: TContext;
  programId?: string;
}

function missingInputsFor(evaluation: AdmissionEvaluation): string[] {
  const requirementLabels =
    evaluation.missingRequirements
      ?.filter((requirement) => requirement.kind === 'profile-input' || requirement.kind === 'school-context')
      .map((requirement) => requirement.label) ?? [];
  return [...new Set([...evaluation.missingInputs, ...requirementLabels])];
}

function isUnsupported(evaluation: AdmissionEvaluation): boolean {
  return evaluation.missingRequirements?.some((requirement) => requirement.kind === 'unsupported') ?? false;
}

function classifyEvaluation(evaluation: AdmissionEvaluation, supportStatus: InstitutionSupportStatus): SchoolEvaluationStatus {
  if (isUnsupported(evaluation)) return 'unsupported';
  if (evaluation.score && (evaluation.confidence === 'exact-verified' || evaluation.confidence === 'exact-cross-checked')) return 'calculated';
  if (
    evaluation.confidence === 'partial' &&
    evaluation.score === undefined &&
    (supportStatus === 'partial-calculator' || supportStatus === 'verified-calculator')
  ) {
    return 'partial';
  }

  const eligibilityStatus = evaluation.eligibility?.status;
  if (eligibilityStatus === 'eligible') return 'eligible';
  if (eligibilityStatus === 'ineligible') return 'ineligible';

  if (missingInputsFor(evaluation).length > 0 || evaluation.confidence === 'unavailable') return 'missing-input';
  if (evaluation.confidence === 'partial') return 'partial';
  return 'unsupported';
}

function unsupportedResult(schoolId: string, notes: string[]): GenericSchoolEvaluationResult {
  return { schoolId, status: 'unsupported', missingInputs: [], notes };
}

export function evaluateSchool<TContext = unknown>(
  profile: ApplicantProfile,
  schoolId: string,
  options: EvaluateSchoolOptions<TContext> = {}
): GenericSchoolEvaluationResult {
  const school = schoolRegistry[schoolId];
  if (!school) return unsupportedResult(schoolId, ['School is not registered in the public catalog.']);

  const adapter = schoolComparisonAdapterRegistry[schoolId];
  if (!adapter) return unsupportedResult(schoolId, ['No evaluator adapter is registered for this school.']);

  const comparison = adapter.evaluate(profile, options.context ?? {});
  const { evaluation } = comparison;
  const supportStatus = deriveInstitutionSupportStatus(school);
  const statusFromEvaluation = classifyEvaluation(evaluation, supportStatus);
  const status = supportStatus === 'catalog-only' ? 'unsupported' : statusFromEvaluation;

  return {
    schoolId,
    status,
    evaluation,
    score: evaluation.score?.value,
    scoreScale: evaluation.score?.scale,
    missingInputs: missingInputsFor(evaluation),
    notes: [...(evaluation.eligibility?.reasons ?? []), ...evaluation.missingRules],
    methodId: evaluation.methodId,
    programId: options.programId,
    comparison,
  };
}

export function evaluateSchools<TContextMap extends Record<string, unknown> = Record<string, unknown>>(
  profile: ApplicantProfile,
  schoolIds: readonly string[],
  contexts: TContextMap = {} as TContextMap
): GenericSchoolEvaluationResult[] {
  return schoolIds.map((schoolId) => evaluateSchool(profile, schoolId, { context: contexts[schoolId] }));
}
