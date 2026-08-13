import { describe, expect, it } from 'vitest';
import { evaluateUsshAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

describe('evaluateUsshAdmission', () => {
  it('unknown khi chưa có gì', () => {
    const evaluation = evaluateUsshAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('eligible khi ĐGNL đạt ngưỡng', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const evaluation = evaluateUsshAdmission(profile);
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('ineligible khi ĐGNL dưới ngưỡng', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 500 } } };
    const evaluation = evaluateUsshAdmission(profile);
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('missingRules liệt kê 2 gap α1/α2', () => {
    const evaluation = evaluateUsshAdmission({});
    expect(evaluation.missingRules).toHaveLength(2);
  });
});
