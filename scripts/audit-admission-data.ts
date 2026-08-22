import { CURRENT_ADMISSION_YEAR } from '../src/core/admissionYear.ts';
import { auditAdmissionDataFreshness, type AuditableCutoffRecord, type FreshnessAuditIssue, type FreshnessAuditSeverity } from '../src/core/dataFreshnessAudit.ts';
import { hcmutEvidence, verifiedRuntimeEvidence, allAdmissionMethods, allMethodKnowledgeGaps } from '../src/core/admissionAuditInputs.ts';
import { hcmutCutoffs } from '../src/schools/hcmut/data/cutoffs.ts';
import { uehCutoffs } from '../src/schools/ueh/data/cutoffs.ts';
import { uelCutoffs } from '../src/schools/uel/data/cutoffs.ts';
import { uitCutoffs } from '../src/schools/uit/data/cutoffs.ts';
import { iuCutoffs2026 } from '../src/schools/iu/data/cutoffs.ts';
import { allAdmissionSources } from '../src/schools/sourceRegistry.ts';
import { institutionCoverage } from '../src/data/institutionCoverage.ts';

const SCHOOLS = [
  'hcmut',
  'ueh',
  'uel',
  'uit',
  'hcmus',
  'ussh',
  'uhs',
  'iu',
  'agu',
  'hcmute',
  'tdtu',
  'huflit',
  'hutech',
  'ufm',
  'hcmulaw',
  'iuh',
  'vlu',
  'ump',
  'ftu',
  'ptit',
  'neu',
  'hub',
  'huit',
  'nttu',
  'hsu',
  'uef',
  'ctu',
  'tdmu',
  'hiu',
  'ou',
  'sgu',
  'hnue',
  'vinhuni',
  'utc',
] as const;
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const schoolFilter = args.find((arg) => arg.startsWith('--school='))?.slice('--school='.length) ?? args.find((arg) => SCHOOLS.includes(arg as (typeof SCHOOLS)[number]));
const selectedSchools = schoolFilter ? SCHOOLS.filter((schoolId) => schoolId === schoolFilter) : SCHOOLS;

function withSchoolId(schoolId: string, cutoffs: AuditableCutoffRecord[]): AuditableCutoffRecord[] {
  return cutoffs.map((cutoff) => ({ ...cutoff, schoolId }));
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

const issues = auditAdmissionDataFreshness({
  currentAdmissionYear: CURRENT_ADMISSION_YEAR,
  methods: allAdmissionMethods,
  cutoffs: [
    ...withSchoolId('hcmut', hcmutCutoffs),
    ...withSchoolId('ueh', uehCutoffs),
    ...withSchoolId('uel', uelCutoffs),
    ...withSchoolId('uit', uitCutoffs),
    ...withSchoolId('iu', iuCutoffs2026),
  ],
  ruleEvidence: verifiedRuntimeEvidence(),
  sourceRegistry: allAdmissionSources,
  knowledgeGaps: allMethodKnowledgeGaps,
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
console.log(`  catalog entries: ${institutionCoverage.totalCatalogEntries}`);
console.log(`  independent education institutions: ${institutionCoverage.independentEducationInstitutions}`);
console.log(`  university / university-level entries: ${institutionCoverage.universityInstitutions}`);
console.log(`  academies: ${institutionCoverage.academies}`);
console.log(`  pedagogical colleges: ${institutionCoverage.pedagogicalColleges}`);
console.log(`  vocational colleges: ${institutionCoverage.vocationalColleges}`);
console.log(`  internal/non-KPI entries: ${institutionCoverage.internalUnitEntries}`);
console.log(`  verified calculators: ${institutionCoverage.fullyVerified}`);
console.log(`  partial calculators: ${institutionCoverage.partialCalculator}`);
console.log(`  eligibility only: ${institutionCoverage.eligibilitySupported}`);
console.log(`  catalog only: ${institutionCoverage.catalogOnly}`);
if (!schoolFilter || schoolFilter === 'hcmut') {
  console.log(`  HCMUT exact rule references: ${hcmutEvidence().length}/${hcmutEvidence().length}`);
}

if (counts.errors > 0) process.exitCode = 1;

