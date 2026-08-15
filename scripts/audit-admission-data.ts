import { CURRENT_ADMISSION_YEAR } from '../src/core/admissionYear.ts';
import {
  auditAdmissionDataFreshness,
  type AuditableCutoffRecord,
  type FreshnessAuditIssue,
  type FreshnessAuditSeverity,
} from '../src/core/dataFreshnessAudit.ts';
import type { AdmissionMethodDescriptor } from '../src/core/admissionMethod.ts';
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
import { hcmusAdmissionMethods } from '../src/schools/hcmus/methods.ts';
import { hcmusAcademicScoreEvidence, hcmusBonusEvidence, hcmusProgramThresholdEvidence, hcmusThresholdEvidence } from '../src/schools/hcmus/evidence.ts';
import { usshAdmissionMethods } from '../src/schools/ussh/methods.ts';
import { usshDt3FormulaEvidence, usshThresholdEvidence } from '../src/schools/ussh/evidence.ts';
import { uhsAdmissionMethods } from '../src/schools/uhs/methods.ts';
import { uhsBonusEvidence, uhsIntegratedFormulaEvidence, uhsThresholdEvidence } from '../src/schools/uhs/evidence.ts';
import { iuAdmissionMethods } from '../src/schools/iu/methods.ts';
import { iuAcademicWeightsEvidence, iuBonusEvidence, iuPriorityEvidence, iuPriorityReductionEvidence } from '../src/schools/iu/evidence.ts';
import { iuCutoffs2026 } from '../src/schools/iu/data/cutoffs.ts';
import { aguAdmissionMethods } from '../src/schools/agu/methods.ts';
import { aguBetaWeightsEvidence, aguLawExtraConditionEvidence, aguProgramThresholdEvidence } from '../src/schools/agu/evidence.ts';
import { allAdmissionSources } from '../src/schools/sourceRegistry.ts';

const SCHOOLS = ['hcmut', 'ueh', 'uel', 'uit', 'hcmus', 'ussh', 'uhs', 'iu', 'agu'] as const;
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const schoolFilter = args.find((arg) => arg.startsWith('--school='))?.slice('--school='.length) ?? args.find((arg) => SCHOOLS.includes(arg as (typeof SCHOOLS)[number]));
const selectedSchools = schoolFilter ? SCHOOLS.filter((schoolId) => schoolId === schoolFilter) : SCHOOLS;

function withSchoolId(schoolId: string, cutoffs: AuditableCutoffRecord[]): AuditableCutoffRecord[] {
  return cutoffs.map((cutoff) => ({ ...cutoff, schoolId }));
}

function methodGaps(methods: AdmissionMethodDescriptor[]): Array<KnowledgeGap & { schoolId?: string; methodId?: string }> {
  return methods.flatMap((method) => (method.knowledgeGaps ?? []).map((gap) => ({ ...gap, schoolId: method.schoolId, methodId: method.id })));
}

function hcmutEvidence(): RuleEvidence[] {
  return (Object.values(hcmutRuleEvidence) as Array<{ evidence: RuleEvidence[] }>).flatMap((rule) => rule.evidence);
}

function verifiedRuntimeEvidence(): RuleEvidence[] {
  return [
    ...hcmutEvidence(),
    ...hcmusThresholdEvidence.evidence,
    ...hcmusAcademicScoreEvidence.evidence,
    ...hcmusProgramThresholdEvidence.evidence,
    ...hcmusBonusEvidence.evidence,
    ...usshThresholdEvidence.evidence,
    ...usshDt3FormulaEvidence.evidence,
    ...uhsThresholdEvidence.evidence,
    ...uhsIntegratedFormulaEvidence.evidence,
    ...uhsBonusEvidence.evidence,
    ...iuAcademicWeightsEvidence.evidence,
    ...iuBonusEvidence.evidence,
    ...iuPriorityEvidence.evidence,
    ...iuPriorityReductionEvidence.evidence,
    ...aguProgramThresholdEvidence.evidence,
    ...aguBetaWeightsEvidence.evidence,
    ...aguLawExtraConditionEvidence.evidence,
  ];
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
    .filter((issue) => issue.schoolId === schoolId || !issue.schoolId)
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
    if (verbose) console.log(`    ${issue.message}`);
  }
}

const methods = [
  ...hcmutAdmissionMethods,
  ...uehAdmissionMethods,
  ...uelAdmissionMethods,
  ...uitAdmissionMethods,
  ...hcmusAdmissionMethods,
  ...usshAdmissionMethods,
  ...uhsAdmissionMethods,
  ...iuAdmissionMethods,
  ...aguAdmissionMethods,
];
const issues = auditAdmissionDataFreshness({
  currentAdmissionYear: CURRENT_ADMISSION_YEAR,
  methods,
  cutoffs: [
    ...withSchoolId('hcmut', hcmutCutoffs),
    ...withSchoolId('ueh', uehCutoffs),
    ...withSchoolId('uel', uelCutoffs),
    ...withSchoolId('uit', uitCutoffs),
    ...withSchoolId('iu', iuCutoffs2026),
  ],
  ruleEvidence: verifiedRuntimeEvidence(),
  sourceRegistry: allAdmissionSources,
  knowledgeGaps: [
    ...methodGaps(uehAdmissionMethods),
    ...methodGaps(uelAdmissionMethods),
    ...methodGaps(uitAdmissionMethods),
    ...methodGaps(hcmusAdmissionMethods),
    ...methodGaps(usshAdmissionMethods),
    ...methodGaps(uhsAdmissionMethods),
    ...methodGaps(iuAdmissionMethods),
    ...methodGaps(aguAdmissionMethods),
  ],
});

const scopedIssues = schoolFilter ? issues.filter((issue) => issue.schoolId === schoolFilter || !issue.schoolId) : issues;

const counts = {
  errors: scopedIssues.filter((issue) => issue.severity === 'error').length,
  warnings: scopedIssues.filter((issue) => issue.severity === 'warning').length,
  info: scopedIssues.filter((issue) => issue.severity === 'info').length,
};

console.log(`Admission data audit - ${CURRENT_ADMISSION_YEAR}${schoolFilter ? ` (${schoolFilter})` : ''}`);
for (const schoolId of selectedSchools) printSchoolIssues(schoolId, scopedIssues);
console.log('\nSummary');
console.log(`  errors: ${counts.errors}`);
console.log(`  warnings: ${counts.warnings}`);
console.log(`  info: ${counts.info}`);
if (!schoolFilter || schoolFilter === 'hcmut') {
  console.log(`  HCMUT exact rule references: ${hcmutEvidence().length}/${hcmutEvidence().length}`);
}

if (counts.errors > 0) process.exitCode = 1;
