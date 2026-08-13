import type { AdmissionMethodDescriptor } from './admissionMethod';
import type { CutoffPublicationStatus, CutoffStatus, NotPublishedCheck } from './admissionHistory';
import { getCutoffAvailability } from './admissionHistory';
import type { RuleEvidence } from './evidence';
import { assessCutoffFreshness, assessRuleEvidenceForCurrentUse, type FreshnessStatus } from './freshness';
import type { KnowledgeGap } from './knowledgeStatus';
import {
  isPrimaryAdmissionSource,
  isValidDateOnly,
  resolveRuleEvidenceSources,
  type AdmissionSource,
} from './sourceRegistry';

export type FreshnessAuditSeverity = 'error' | 'warning' | 'info';
export type FreshnessAuditIssueKind = 'cutoff' | 'method' | 'rule' | 'source' | 'knowledge-gap';
export type FreshnessAuditCode =
  | 'CURRENT_CUTOFF_MISSING_SOURCE'
  | 'DUPLICATE_CURRENT_CUTOFF'
  | 'METHOD_YEAR_MISMATCH'
  | 'DUPLICATE_METHOD_DESCRIPTOR'
  | 'EXACT_METHOD_HAS_UNRESOLVED_GAPS'
  | 'SOURCE_ID_DUPLICATE'
  | 'SOURCE_DATE_INVALID'
  | 'SOURCE_LIFECYCLE_INVALID'
  | 'SOURCE_SUPERSESSION_REPLACEMENT_MISSING'
  | 'SOURCE_SUPERSESSION_CYCLE'
  | 'MISSING_SOURCE_REFERENCE'
  | 'SUPERSEDED_SOURCE_REFERENCE'
  | 'CRITICAL_RULE_WITHOUT_PRIMARY_SOURCE'
  | 'SUPERSEDED_SOURCE_IN_CURRENT_RULE'
  | 'RULE_EVIDENCE_NOT_CURRENT'
  | 'SCORE_AFFECTING_RULE_INCOMPLETE'
  | 'UNPARSED_OFFICIAL_RULE'
  | 'INCOMPLETE_OFFICIAL_RULE';

export interface FreshnessAuditIssue {
  severity: FreshnessAuditSeverity;
  kind: FreshnessAuditIssueKind;
  code: FreshnessAuditCode;
  schoolId?: string;
  id: string;
  message: string;
  entityId?: string;
}

export interface AuditableCutoffRecord {
  schoolId?: string;
  year: number;
  programId?: string;
  method?: string;
  methodId?: string;
  campusId?: string;
  applicantTypeId?: string;
  combinationId?: string;
  score: number;
  scoreScale?: number;
  status?: CutoffStatus;
  sourceLabel?: string;
  sourceUrl?: string;
  publishedAt?: string;
  accessedAt?: string;
  lastReviewedAt?: string;
  comparableToPrevious?: boolean;
}

export interface AdmissionFreshnessAuditInput {
  currentAdmissionYear: number;
  methods?: AdmissionMethodDescriptor[];
  cutoffs?: AuditableCutoffRecord[];
  ruleEvidence?: RuleEvidence[];
  sourceRegistry?: AdmissionSource[];
  knowledgeGaps?: Array<KnowledgeGap & { schoolId?: string; methodId?: string }>;
  notPublishedChecks?: Pick<NotPublishedCheck, 'year'>[];
}

function invalidDateIssue(source: AdmissionSource, field: 'publishedAt' | 'lastReviewedAt', value: string): FreshnessAuditIssue {
  return {
    severity: 'error',
    kind: 'source',
    code: 'SOURCE_DATE_INVALID',
    schoolId: source.schoolId,
    id: `source-date:${source.id}:${field}`,
    entityId: source.id,
    message: `Source ${source.id} has invalid ${field}: ${value}`,
  };
}

export function auditSourceRegistry(sources: readonly AdmissionSource[]): FreshnessAuditIssue[] {
  const issues: FreshnessAuditIssue[] = [];
  const byId = new Map<string, AdmissionSource>();
  const duplicateIds = new Set<string>();

  for (const source of sources) {
    if (byId.has(source.id)) duplicateIds.add(source.id);
    byId.set(source.id, source);

    if (source.publishedAt && !isValidDateOnly(source.publishedAt)) {
      issues.push(invalidDateIssue(source, 'publishedAt', source.publishedAt));
    }
    if (source.lastReviewedAt && !isValidDateOnly(source.lastReviewedAt)) {
      issues.push(invalidDateIssue(source, 'lastReviewedAt', source.lastReviewedAt));
    }

    if (source.lifecycle?.status === 'current' && source.lifecycle.supersededBy) {
      issues.push({
        severity: 'error',
        kind: 'source',
        code: 'SOURCE_LIFECYCLE_INVALID',
        schoolId: source.schoolId,
        id: `source-lifecycle:${source.id}`,
        entityId: source.id,
        message: `Source ${source.id} is current but also points to supersededBy=${source.lifecycle.supersededBy}.`,
      });
    }
    if (source.lifecycle?.status === 'superseded' && !source.lifecycle.supersededBy) {
      issues.push({
        severity: 'warning',
        kind: 'source',
        code: 'SOURCE_LIFECYCLE_INVALID',
        schoolId: source.schoolId,
        id: `source-lifecycle:${source.id}`,
        entityId: source.id,
        message: `Source ${source.id} is superseded but does not identify a replacement source.`,
      });
    }
  }

  for (const id of duplicateIds) {
    issues.push({
      severity: 'error',
      kind: 'source',
      code: 'SOURCE_ID_DUPLICATE',
      id: `source-duplicate:${id}`,
      entityId: id,
      message: `Duplicate source id in registry: ${id}`,
    });
  }

  for (const source of sources) {
    const replacementId = source.lifecycle?.supersededBy;
    if (!replacementId) continue;
    const replacement = byId.get(replacementId);
    if (!replacement) {
      issues.push({
        severity: 'error',
        kind: 'source',
        code: 'SOURCE_SUPERSESSION_REPLACEMENT_MISSING',
        schoolId: source.schoolId,
        id: `source-supersededBy:${source.id}`,
        entityId: source.id,
        message: `Source ${source.id} supersededBy points to missing source ${replacementId}.`,
      });
    } else if (replacement.lifecycle?.supersededBy === source.id) {
      issues.push({
        severity: 'error',
        kind: 'source',
        code: 'SOURCE_SUPERSESSION_CYCLE',
        schoolId: source.schoolId,
        id: `source-supersededBy-cycle:${source.id}`,
        entityId: source.id,
        message: `Source supersession cycle detected: ${source.id} <-> ${replacement.id}.`,
      });
    }
  }

  return issues;
}

function cutoffContextKey(record: AuditableCutoffRecord): string {
  return [
    record.schoolId ?? '',
    record.year,
    record.programId ?? '',
    record.methodId ?? record.method ?? '',
    record.campusId ?? '',
    record.applicantTypeId ?? '',
    record.combinationId ?? '',
    record.scoreScale ?? '',
  ].join('::');
}

function cutoffLabel(record: AuditableCutoffRecord): string {
  return [record.schoolId, record.year, record.programId, record.methodId ?? record.method, record.campusId, record.applicantTypeId, record.combinationId]
    .filter(Boolean)
    .join('/');
}

export function getCutoffPublicationStatus(
  records: AuditableCutoffRecord[],
  year: number,
  notPublishedChecks: Pick<NotPublishedCheck, 'year'>[] = []
): CutoffPublicationStatus {
  return getCutoffAvailability(records, year, notPublishedChecks);
}

export function auditCutoffRecords(records: AuditableCutoffRecord[], currentAdmissionYear: number): FreshnessAuditIssue[] {
  const issues: FreshnessAuditIssue[] = [];
  const finalCurrentByContext = new Map<string, AuditableCutoffRecord[]>();

  for (const record of records) {
    const freshness = assessCutoffFreshness({
      effectiveYear: record.year,
      currentAdmissionYear,
      status: record.status ?? 'final',
    });

    if (freshness === 'current' && (record.status ?? 'final') === 'final') {
      if (!record.sourceLabel || !record.sourceUrl) {
        issues.push({
          severity: 'error',
          kind: 'cutoff',
          code: 'CURRENT_CUTOFF_MISSING_SOURCE',
          schoolId: record.schoolId,
          id: `cutoff-source:${cutoffLabel(record)}`,
          entityId: cutoffLabel(record),
          message: `Current final cutoff is missing source metadata: ${cutoffLabel(record)}`,
        });
      }
      const key = cutoffContextKey(record);
      finalCurrentByContext.set(key, [...(finalCurrentByContext.get(key) ?? []), record]);
    }
  }

  for (const [key, duplicates] of finalCurrentByContext) {
    const scores = new Set(duplicates.map((record) => record.score));
    if (scores.size > 1) {
      issues.push({
        severity: 'error',
        kind: 'cutoff',
        code: 'DUPLICATE_CURRENT_CUTOFF',
        schoolId: duplicates[0].schoolId,
        id: `cutoff-conflict:${key}`,
        entityId: key,
        message: `Conflicting current final cutoffs for same context: ${key}`,
      });
    }
  }

  return issues;
}

export function auditMethods(methods: AdmissionMethodDescriptor[], currentAdmissionYear: number): FreshnessAuditIssue[] {
  const issues: FreshnessAuditIssue[] = [];
  const currentIds = new Set<string>();

  for (const method of methods) {
    const freshness = assessCutoffFreshness({
      effectiveYear: method.lifecycle?.effectiveYear ?? method.year,
      currentAdmissionYear,
      status: method.lifecycle?.status ?? 'current',
      supersededBy: method.lifecycle?.supersededBy,
    });

    if (freshness !== 'current') {
      issues.push({
        severity: freshness === 'superseded' ? 'error' : 'warning',
        kind: 'method',
        code: 'METHOD_YEAR_MISMATCH',
        schoolId: method.schoolId,
        id: `method-freshness:${method.id}`,
        entityId: method.id,
        message: `Method ${method.id} is ${freshness}, not current for ${currentAdmissionYear}.`,
      });
    }

    const currentKey = `${method.schoolId ?? ''}::${method.id}::${method.year}`;
    if (currentIds.has(currentKey)) {
      issues.push({
        severity: 'error',
        kind: 'method',
        code: 'DUPLICATE_METHOD_DESCRIPTOR',
        schoolId: method.schoolId,
        id: `method-duplicate:${currentKey}`,
        entityId: currentKey,
        message: `Duplicate current method descriptor: ${currentKey}`,
      });
    }
    currentIds.add(currentKey);

    if (method.capabilities.exactCalculator && (method.knowledgeGaps?.length ?? 0) > 0) {
      issues.push({
        severity: 'error',
        kind: 'method',
        code: 'EXACT_METHOD_HAS_UNRESOLVED_GAPS',
        schoolId: method.schoolId,
        id: `method-gaps:${method.id}`,
        entityId: method.id,
        message: `Method ${method.id} claims exactCalculator while unresolved knowledge gaps remain.`,
      });
    }
  }

  return issues;
}

export function auditRuleEvidence(ruleEvidence: RuleEvidence[], currentAdmissionYear: number): FreshnessAuditIssue[] {
  const issues: FreshnessAuditIssue[] = [];

  for (const evidence of ruleEvidence) {
    const assessment = assessRuleEvidenceForCurrentUse(evidence, currentAdmissionYear);
    if (!assessment.usable) {
      issues.push({
        severity: assessment.freshness === 'superseded' ? 'error' : 'warning',
        kind: 'rule',
        code: assessment.freshness === 'superseded' ? 'SUPERSEDED_SOURCE_IN_CURRENT_RULE' : 'RULE_EVIDENCE_NOT_CURRENT',
        id: `rule-freshness:${evidence.sourceId}`,
        entityId: evidence.sourceId,
        message: assessment.reason ?? `Rule evidence ${evidence.sourceId} is ${assessment.freshness}.`,
      });
    }
    if (evidence.verification === 'incomplete' && evidence.criticality !== 'informational') {
      issues.push({
        severity: 'warning',
        kind: 'rule',
        code: 'SCORE_AFFECTING_RULE_INCOMPLETE',
        id: `rule-verification:${evidence.sourceId}`,
        entityId: evidence.sourceId,
        message: `Score-affecting rule evidence ${evidence.sourceId} is incomplete.`,
      });
    }
  }

  return issues;
}

export function auditRuleEvidenceSourceReferences(
  ruleEvidence: readonly RuleEvidence[],
  sources: readonly AdmissionSource[]
): FreshnessAuditIssue[] {
  const issues: FreshnessAuditIssue[] = [];

  for (const resolved of resolveRuleEvidenceSources(ruleEvidence, sources)) {
    const evidence = resolved.evidence;
    const critical = evidence.criticality !== 'informational';
    if (!resolved.source) {
      issues.push({
        severity: critical ? 'error' : 'warning',
        kind: 'rule',
        code: 'MISSING_SOURCE_REFERENCE',
        id: `rule-source-missing:${evidence.sourceId}`,
        entityId: evidence.sourceId,
        message: `Rule evidence references missing source id: ${evidence.sourceId}`,
      });
      continue;
    }

    if (resolved.source.lifecycle?.status === 'superseded') {
      issues.push({
        severity: critical ? 'error' : 'warning',
        kind: 'rule',
        code: 'SUPERSEDED_SOURCE_REFERENCE',
        schoolId: resolved.source.schoolId,
        id: `rule-source-superseded:${evidence.sourceId}`,
        entityId: evidence.sourceId,
        message: `Rule evidence ${evidence.sourceId} references a superseded source.`,
      });
    }

    if (critical && !isPrimaryAdmissionSource(resolved.source)) {
      issues.push({
        severity: 'error',
        kind: 'rule',
        code: 'CRITICAL_RULE_WITHOUT_PRIMARY_SOURCE',
        schoolId: resolved.source.schoolId,
        id: `rule-source-secondary:${evidence.sourceId}`,
        entityId: evidence.sourceId,
        message: `Score-affecting rule evidence ${evidence.sourceId} resolves only to a secondary source.`,
      });
    }
  }

  return issues;
}

export function auditKnownKnowledgeGaps(
  gaps: Array<KnowledgeGap & { schoolId?: string; methodId?: string }>
): FreshnessAuditIssue[] {
  return gaps.map((gap) => ({
    severity: gap.status === 'official-but-unparsed' ? 'warning' : 'info',
    kind: 'knowledge-gap',
    code: gap.status === 'official-but-unparsed' ? 'UNPARSED_OFFICIAL_RULE' : 'INCOMPLETE_OFFICIAL_RULE',
    schoolId: gap.schoolId,
    id: `knowledge-gap:${gap.schoolId ?? 'unknown'}:${gap.id}`,
    entityId: [gap.methodId, gap.id, gap.sourceId ? `source=${gap.sourceId}` : undefined].filter(Boolean).join(':'),
    message: gap.label,
  }));
}

export function summarizeFreshness(issues: FreshnessAuditIssue[]): Record<FreshnessStatus | 'ok', number> {
  const summary = { ok: 0, current: 0, 'needs-review': 0, stale: 0, superseded: 0, historical: 0, unknown: 0 };
  for (const issue of issues) {
    if (issue.message.includes('superseded')) summary.superseded += 1;
    else if (issue.message.includes('historical')) summary.historical += 1;
    else if (issue.message.includes('needs')) summary['needs-review'] += 1;
    else if (issue.message.includes('unknown')) summary.unknown += 1;
    else summary.stale += 1;
  }
  if (issues.length === 0) summary.ok = 1;
  return summary;
}

export function auditAdmissionDataFreshness(input: AdmissionFreshnessAuditInput): FreshnessAuditIssue[] {
  return [
    ...auditSourceRegistry(input.sourceRegistry ?? []),
    ...auditMethods(input.methods ?? [], input.currentAdmissionYear),
    ...auditCutoffRecords(input.cutoffs ?? [], input.currentAdmissionYear),
    ...auditRuleEvidence(input.ruleEvidence ?? [], input.currentAdmissionYear),
    ...(input.sourceRegistry ? auditRuleEvidenceSourceReferences(input.ruleEvidence ?? [], input.sourceRegistry) : []),
    ...auditKnownKnowledgeGaps(input.knowledgeGaps ?? []),
  ];
}
