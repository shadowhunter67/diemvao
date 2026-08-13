import { describe, expect, it } from 'vitest';
import { hcmutCutoffs } from '../schools/hcmut/data/cutoffs';
import { hcmutRuleEvidence } from '../schools/hcmut/evidence';
import { hcmutAdmissionMethods } from '../schools/hcmut/methods';
import { uehCutoffs } from '../schools/ueh/data/cutoffs';
import { uehAdmissionMethods } from '../schools/ueh/methods';
import { uelCutoffs } from '../schools/uel/data/cutoffs';
import { uelAdmissionMethods } from '../schools/uel/methods';
import { uitCutoffs } from '../schools/uit/data/cutoffs';
import { uitAdmissionMethods } from '../schools/uit/methods';
import { CURRENT_ADMISSION_YEAR } from './admissionYear';
import { auditAdmissionDataFreshness, type AuditableCutoffRecord } from './dataFreshnessAudit';
import type { RuleEvidence } from './evidence';

function withSchoolId(schoolId: string, cutoffs: AuditableCutoffRecord[]): AuditableCutoffRecord[] {
  return cutoffs.map((cutoff) => ({ ...cutoff, schoolId }));
}

function hcmutEvidence(): RuleEvidence[] {
  return (Object.values(hcmutRuleEvidence) as Array<{ evidence: RuleEvidence[] }>).flatMap((rule) => rule.evidence);
}

describe('runtime admission data freshness audit', () => {
  it('runtime method descriptors match the configured current admission year', () => {
    const methods = [...hcmutAdmissionMethods, ...uehAdmissionMethods, ...uelAdmissionMethods, ...uitAdmissionMethods];
    expect(methods.map((method) => method.year)).toEqual(methods.map(() => CURRENT_ADMISSION_YEAR));
  });

  it('current final cutoffs used by runtime school modules have source metadata and no conflicting duplicates', () => {
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      cutoffs: [
        ...withSchoolId('hcmut', hcmutCutoffs),
        ...withSchoolId('ueh', uehCutoffs),
        ...withSchoolId('uel', uelCutoffs),
        ...withSchoolId('uit', uitCutoffs),
      ],
    });

    expect(issues).toEqual([]);
  });

  it('HCMUT exact score-affecting evidence is current-year, verified enough, and not superseded', () => {
    const evidence = hcmutEvidence();
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every((item) => item.effectiveYear === CURRENT_ADMISSION_YEAR)).toBe(true);
    expect(evidence.every((item) => item.verification !== 'incomplete')).toBe(true);
    expect(evidence.every((item) => item.lifecycle?.status !== 'superseded')).toBe(true);
  });
});
