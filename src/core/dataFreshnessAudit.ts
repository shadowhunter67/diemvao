import type { AdmissionMethodDescriptor } from './admissionMethod';
import type { CutoffPublicationStatus, CutoffStatus, NotPublishedCheck } from './admissionHistory';
import { getCutoffAvailability } from './admissionHistory';
import type { RuleEvidence } from './evidence';
import { assessCutoffFreshness, assessRuleEvidenceForCurrentUse, type FreshnessStatus } from './freshness';

export type FreshnessAuditSeverity = 'error' | 'warning';
export type FreshnessAuditIssueKind = 'cutoff' | 'method' | 'rule';

export interface FreshnessAuditIssue {
  severity: FreshnessAuditSeverity;
  kind: FreshnessAuditIssueKind;
  schoolId?: string;
  id: string;
  message: string;
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
  notPublishedChecks?: Pick<NotPublishedCheck, 'year'>[];
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
          schoolId: record.schoolId,
          id: `cutoff-source:${cutoffLabel(record)}`,
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
        schoolId: duplicates[0].schoolId,
        id: `cutoff-conflict:${key}`,
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
        schoolId: method.schoolId,
        id: `method-freshness:${method.id}`,
        message: `Method ${method.id} is ${freshness}, not current for ${currentAdmissionYear}.`,
      });
    }

    const currentKey = `${method.schoolId ?? ''}::${method.id}::${method.year}`;
    if (currentIds.has(currentKey)) {
      issues.push({
        severity: 'error',
        kind: 'method',
        schoolId: method.schoolId,
        id: `method-duplicate:${currentKey}`,
        message: `Duplicate current method descriptor: ${currentKey}`,
      });
    }
    currentIds.add(currentKey);
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
        id: `rule-freshness:${evidence.sourceId}`,
        message: assessment.reason ?? `Rule evidence ${evidence.sourceId} is ${assessment.freshness}.`,
      });
    }
    if (evidence.verification === 'incomplete' && evidence.criticality !== 'informational') {
      issues.push({
        severity: 'warning',
        kind: 'rule',
        id: `rule-verification:${evidence.sourceId}`,
        message: `Score-affecting rule evidence ${evidence.sourceId} is incomplete.`,
      });
    }
  }

  return issues;
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
    ...auditMethods(input.methods ?? [], input.currentAdmissionYear),
    ...auditCutoffRecords(input.cutoffs ?? [], input.currentAdmissionYear),
    ...auditRuleEvidence(input.ruleEvidence ?? [], input.currentAdmissionYear),
  ];
}
