import type { RuleEvidence } from './evidence';

export type FreshnessStatus = 'current' | 'needs-review' | 'stale' | 'superseded' | 'historical' | 'unknown';
export type LifecycleStatus = 'current' | 'superseded' | 'historical';
export type EvidenceCriticality = 'score-affecting' | 'informational';

export interface RuleLifecycle {
  effectiveYear: number;
  publishedAt?: string;
  lastReviewedAt?: string;
  status: LifecycleStatus;
  supersededBy?: string;
}

export interface SourceLifecycle {
  effectiveYear?: number;
  publishedAt?: string;
  lastReviewedAt?: string;
  status?: LifecycleStatus;
  supersededBy?: string;
}

export interface FreshnessAssessmentInput {
  effectiveYear?: number;
  currentAdmissionYear: number;
  status?: LifecycleStatus | 'final';
  supersededBy?: string;
}

export interface CurrentUseAssessment {
  usable: boolean;
  freshness: FreshnessStatus;
  reason?: string;
}

export function assessLifecycleFreshness(input: FreshnessAssessmentInput): FreshnessStatus {
  if (input.status === 'superseded' || input.supersededBy) return 'superseded';
  if (input.effectiveYear === undefined) return 'unknown';
  if (input.effectiveYear < input.currentAdmissionYear || input.status === 'historical') return 'historical';
  if (input.effectiveYear > input.currentAdmissionYear) return 'needs-review';
  if (input.status === undefined || input.status === 'current' || input.status === 'final') return 'current';
  return 'unknown';
}

export const assessRuleFreshness = assessLifecycleFreshness;
export const assessCutoffFreshness = assessLifecycleFreshness;

export function assessRuleEvidenceForCurrentUse(
  evidence: Pick<RuleEvidence, 'sourceId' | 'effectiveYear' | 'lifecycle' | 'criticality'>,
  currentAdmissionYear: number
): CurrentUseAssessment {
  const lifecycle = evidence.lifecycle;
  const freshness = assessRuleFreshness({
    effectiveYear: lifecycle?.effectiveYear ?? evidence.effectiveYear,
    currentAdmissionYear,
    status: lifecycle?.status,
    supersededBy: lifecycle?.supersededBy,
  });

  if (evidence.criticality === 'informational') return { usable: true, freshness };
  if (freshness === 'current') return { usable: true, freshness };
  if (freshness === 'superseded') {
    return {
      usable: false,
      freshness,
      reason: `Rule evidence "${evidence.sourceId}" is superseded and cannot power current-year exact evaluation.`,
    };
  }
  if (freshness === 'historical') {
    return {
      usable: false,
      freshness,
      reason: `Rule evidence "${evidence.sourceId}" is historical, not current-year evidence.`,
    };
  }
  return {
    usable: false,
    freshness,
    reason: `Rule evidence "${evidence.sourceId}" needs current-year freshness review before exact evaluation.`,
  };
}
