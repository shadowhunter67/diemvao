import type { SourceType } from './admissionHistory';
import type { RuleEvidence } from './evidence';
import type { RuleLifecycle, SourceLifecycle } from './freshness';
import type { VerificationLevel } from './trust';

export interface AdmissionSource {
  id: string;
  schoolId?: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  lastReviewedAt?: string;
  sourceType?: SourceType;
  lifecycle?: SourceLifecycle;
  verification?: VerificationLevel;
}

export interface ResolvedRuleEvidenceSource {
  evidence: RuleEvidence;
  source?: AdmissionSource;
  missingSourceId?: string;
}

export function sourceRegistryById(sources: readonly AdmissionSource[]): Map<string, AdmissionSource> {
  return new Map(sources.map((source) => [source.id, source]));
}

export function resolveRuleEvidenceSources(
  evidence: readonly RuleEvidence[],
  sources: readonly AdmissionSource[]
): ResolvedRuleEvidenceSource[] {
  const byId = sourceRegistryById(sources);
  return evidence.map((item) => {
    const source = byId.get(item.sourceId);
    return source ? { evidence: item, source } : { evidence: item, missingSourceId: item.sourceId };
  });
}

export function enrichRuleEvidenceFromRegistry(evidence: RuleEvidence, source?: AdmissionSource): RuleEvidence {
  if (!source) return evidence;
  const lifecycle = sourceLifecycleAsRuleLifecycle(source.lifecycle);
  return {
    sourceUrl: source.url,
    sourceTitle: source.title,
    sourceType: source.sourceType,
    publishedAt: source.publishedAt,
    lastReviewedAt: source.lastReviewedAt,
    lifecycle,
    ...evidence,
  };
}

function sourceLifecycleAsRuleLifecycle(lifecycle?: SourceLifecycle): RuleLifecycle | undefined {
  if (lifecycle?.effectiveYear === undefined || !lifecycle.status) return undefined;
  return {
    effectiveYear: lifecycle.effectiveYear,
    publishedAt: lifecycle.publishedAt,
    lastReviewedAt: lifecycle.lastReviewedAt,
    status: lifecycle.status,
    supersededBy: lifecycle.supersededBy,
  };
}

export function isPrimaryAdmissionSource(source: AdmissionSource): boolean {
  return source.sourceType !== 'secondary';
}

export function isValidDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
