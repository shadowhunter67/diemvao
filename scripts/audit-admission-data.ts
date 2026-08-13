import { CURRENT_ADMISSION_YEAR } from '../src/core/admissionYear.ts';
import {
  auditAdmissionDataFreshness,
  type AuditableCutoffRecord,
  type FreshnessAuditIssue,
  type FreshnessAuditSeverity,
} from '../src/core/dataFreshnessAudit.ts';
import type { RuleEvidence } from '../src/core/evidence.ts';
import type { KnowledgeGap } from '../src/core/knowledgeStatus.ts';
import { hcmutCutoffs } from '../src/schools/hcmut/data/cutoffs.ts';
import { hcmutRuleEvidence } from '../src/schools/hcmut/evidence.ts';
import { hcmutAdmissionMethods } from '../src/schools/hcmut/methods.ts';
import { uehCutoffs } from '../src/schools/ueh/data/cutoffs.ts';
import { uehAdmissionMethods } from '../src/schools/ueh/methods.ts';
import { uelCutoffs } from '../src/schools/uel/data/cutoffs.ts';
import { uelAdmissionMethods } from '../src/schools/uel/methods.ts';
import { uitCutoffs } from '../src/schools/uit/data/cutoffs.ts';
import { uitAdmissionMethods } from '../src/schools/uit/methods.ts';

const SCHOOLS = ['hcmut', 'ueh', 'uel', 'uit'] as const;

function withSchoolId(schoolId: string, cutoffs: AuditableCutoffRecord[]): AuditableCutoffRecord[] {
  return cutoffs.map((cutoff) => ({ ...cutoff, schoolId }));
}

function methodGaps(methods: typeof hcmutAdmissionMethods): Array<KnowledgeGap & { schoolId?: string; methodId?: string }> {
  return methods.flatMap((method) => (method.knowledgeGaps ?? []).map((gap) => ({ ...gap, schoolId: method.schoolId, methodId: method.id })));
}

function hcmutEvidence(): RuleEvidence[] {
  return (Object.values(hcmutRuleEvidence) as Array<{ evidence: RuleEvidence[] }>).flatMap((rule) => rule.evidence);
}

function severityRank(severity: FreshnessAuditSeverity): number {
  if (severity === 'error') return 0;
  if (severity === 'warning') return 1;
  return 2;
}

function marker(severity: FreshnessAuditSeverity): string {
  if (severity === 'error') return 'x';
  if (severity === 'warning') return '!';
  return '-';
}

function printSchoolIssues(schoolId: string, issues: FreshnessAuditIssue[]): void {
  const scoped = issues
    .filter((issue) => issue.schoolId === schoolId)
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || a.code.localeCompare(b.code));

  const label = schoolId.toUpperCase();
  console.log(`\n${label}`);
  if (scoped.length === 0) {
    console.log('  ok no issues');
    return;
  }
  for (const issue of scoped) {
    const entity = issue.entityId ? ` ${issue.entityId}` : '';
    console.log(`  ${marker(issue.severity)} [${issue.severity.toUpperCase()}] ${issue.code}${entity}`);
    console.log(`    ${issue.message}`);
  }
}

const methods = [...hcmutAdmissionMethods, ...uehAdmissionMethods, ...uelAdmissionMethods, ...uitAdmissionMethods];
const issues = auditAdmissionDataFreshness({
  currentAdmissionYear: CURRENT_ADMISSION_YEAR,
  methods,
  cutoffs: [
    ...withSchoolId('hcmut', hcmutCutoffs),
    ...withSchoolId('ueh', uehCutoffs),
    ...withSchoolId('uel', uelCutoffs),
    ...withSchoolId('uit', uitCutoffs),
  ],
  ruleEvidence: hcmutEvidence(),
  knowledgeGaps: [...methodGaps(uehAdmissionMethods), ...methodGaps(uelAdmissionMethods), ...methodGaps(uitAdmissionMethods)],
});

const counts = {
  errors: issues.filter((issue) => issue.severity === 'error').length,
  warnings: issues.filter((issue) => issue.severity === 'warning').length,
  info: issues.filter((issue) => issue.severity === 'info').length,
};

console.log(`Admission data audit - ${CURRENT_ADMISSION_YEAR}`);
for (const schoolId of SCHOOLS) printSchoolIssues(schoolId, issues);
console.log('\nSummary');
console.log(`  errors: ${counts.errors}`);
console.log(`  warnings: ${counts.warnings}`);
console.log(`  info: ${counts.info}`);

if (counts.errors > 0) process.exitCode = 1;
