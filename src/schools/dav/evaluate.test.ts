import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateSchool, evaluateSchools } from '../../evaluation/schoolEvaluation';
import { evaluateDavAdmission } from './evaluate';

const d01Context = {
  programCode: 'HQT01',
  subjectContext: { combinationId: 'D01', subjects: ['math', 'literature', 'english'] as const },
};

describe('DAV 2026 threshold eligibility evaluator', () => {
  it('requires a program before applying program-specific scope', () => {
    const result = evaluateDavAdmission({}, { methodId: 'dav-thpt-exam-2026', subjectContext: d01Context.subjectContext });

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'dav-program' }));
  });

  it('checks THPT threshold for a selected combination', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, literature: 7, english: 7.5 } } };
    const result = evaluateDavAdmission(profile, { methodId: 'dav-thpt-exam-2026', ...d01Context });

    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.score).toBeUndefined();
    expect(result.explanation[0]?.output).toBe(21.5);
  });

  it('uses IELTS conversion as an English-language substitute when requested', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, literature: 7, english: 6 } }, certificates: { ielts: 7.0 } };
    const result = evaluateDavAdmission(profile, { methodId: 'dav-thpt-exam-2026', ...d01Context, useEnglishCertificateForThpt: true });

    expect(result.eligibility?.status).toBe('eligible');
    expect(result.explanation[0]?.output).toBe(23);
    expect(result.score).toBeUndefined();
  });

  it('applies law-field Math/Literature constraints', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5.5, physics: 9, literature: 9, english: 9 } } };
    const result = evaluateDavAdmission(profile, {
      methodId: 'dav-thpt-exam-2026',
      programCode: 'HQT04',
      subjectContext: { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const },
    });

    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.eligibility?.reasons.join(' ')).toContain('Math');
  });

  it('checks method 3 converted SAT/ACT plus language certificate threshold', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 8, literature: 8, english: 8 } },
      certificates: { ielts: 7.0, sat: 1450 },
    };
    const result = evaluateDavAdmission(profile, {
      methodId: 'dav-sat-act-certificate-2026',
      programCode: 'HQT03',
      subjectContext: d01Context.subjectContext,
    });

    expect(result.eligibility?.status).toBe('eligible');
    expect(result.explanation[0]?.id).toBe('dav-method3-conversion');
    expect(result.explanation[0]?.output).toBe(28);
  });

  it('routes through generic evaluateSchool and evaluateSchools', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, literature: 8, english: 8 } } };
    const context = { methodId: 'dav-thpt-exam-2026' as const, ...d01Context };

    expect(evaluateSchool(profile, 'dav', { context }).status).toBe('partial');
    expect(evaluateSchools(profile, ['dav'], { dav: context })[0].status).toBe('partial');
  });
});
