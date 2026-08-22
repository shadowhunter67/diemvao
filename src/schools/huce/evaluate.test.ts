import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateSchool, evaluateSchools } from '../../evaluation/schoolEvaluation';
import { evaluateHuceAdmission } from './evaluate';

const a00Context = { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] as const } };

describe('HUCE 2026 threshold eligibility', () => {
  it('requires a program/campus before applying thresholds', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, chemistry: 7 } } };

    const result = evaluateHuceAdmission(profile, { methodId: 'huce-thpt-exam-2026', ...a00Context });

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'huce-program' }));
  });

  it('marks THPT profiles below a selected program threshold as ineligible', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, chemistry: 7 } } };

    const result = evaluateHuceAdmission(profile, { methodId: 'huce-thpt-exam-2026', programId: 'hanoi-XDA23', ...a00Context });

    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.eligibility?.reasons.join(' ')).toContain('22/30');
  });

  it('marks THPT profiles meeting a selected program threshold as eligible threshold-only', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, chemistry: 7 } } };

    const result = evaluateHuceAdmission(profile, { methodId: 'huce-thpt-exam-2026', programId: 'hanoi-XDA23', ...a00Context });

    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('eligible');
    expect(result.score).toBeUndefined();
    expect(result.eligibility?.reasons.join(' ')).toContain('threshold eligibility');
  });

  it('evaluates transcript thresholds from grade 10/11/12 yearly averages', () => {
    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: 8, physics: 8, chemistry: 8 },
        grade11: { math: 8, physics: 8, chemistry: 8 },
        grade12: { math: 8, physics: 8, chemistry: 8 },
      },
    };

    const result = evaluateHuceAdmission(profile, { methodId: 'huce-transcript-2026', programId: 'hanoi-XDA23', ...a00Context });

    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.eligibility?.reasons.join(' ')).toContain('24.9/30');
  });

  it('keeps methods not open for a program unresolved', () => {
    const result = evaluateHuceAdmission({}, { methodId: 'huce-transcript-2026', programId: 'hanoi-XDA01', ...a00Context });

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'unsupported', code: 'huce-method-not-open-for-program' }));
  });

  it('routes through generic evaluateSchool and evaluateSchools adapters', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, chemistry: 7 } } };
    const context = { methodId: 'huce-thpt-exam-2026' as const, programId: 'hanoi-XDA23', ...a00Context };

    expect(evaluateSchool(profile, 'huce', { context }).status).toBe('ineligible');
    expect(evaluateSchools(profile, ['huce'], { huce: context })[0].status).toBe('ineligible');
  });
});
