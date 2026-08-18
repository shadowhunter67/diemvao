import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateUfmThptAdmission, evaluateUfmDgnlAdmission, evaluateUfmVsatAdmission, evaluateUfmHocbaAdmission } from './evaluate';

const combo = { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const };

describe('evaluateUfmThptAdmission', () => {
  it('returns partial when no subject combination is chosen', () => {
    const result = evaluateUfmThptAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-subject-combination')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('reports missing THPT scores', () => {
    const result = evaluateUfmThptAdmission({}, { subjectContext: combo });
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-thpt-math')).toBe(true);
    expect(result.confidence).toBe('partial');
  });

  it('computes an exact-verified score for a complete profile with no bonus achievement', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } }, priority: { region: 'KV1' } };
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo });
    expect(result.confidence).toBe('exact-verified');
    const academicStep = result.explanation.find((s) => s.id === 'ufm-academic-score');
    expect(academicStep?.output).toBe(21);
    expect(result.score?.scale).toBe(30);
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 21 >= 16
  });

  it('reports ineligible below the standard 16/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 5, english: 5 } } }; // total 15
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // score itself is still exact/computable
  });

  it('applies law-economics sub-conditions using the raw math score read from the profile', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 8, english: 8 } } }; // total 21, math 5 < 6
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo, thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible'); // total passes but math floor fails
  });

  it('stays partial when the applicant has a bonus achievement (bonus table not found)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } };
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo, hasBonusAchievement: true });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-bonus-table-not-found')).toBe(true);
  });
});

describe('evaluateUfmDgnlAdmission', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateUfmDgnlAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-dgnl-total')).toBe(true);
  });

  it('computes an exact-verified score with no bonus achievement', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateUfmDgnlAdmission(profile);
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.scale).toBe(1200);
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 700 >= 657
  });

  it('applies the law-economics 720/1200 threshold', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateUfmDgnlAdmission(profile, { thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('stays partial when the applicant has a bonus achievement', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateUfmDgnlAdmission(profile, { hasBonusAchievement: true });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
  });
});

describe('evaluateUfmVsatAdmission — eligibility-only', () => {
  it('asks for V-SAT score when absent', () => {
    const result = evaluateUfmVsatAdmission();
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-vsat-score')).toBe(true);
  });

  it('reports eligible/ineligible but never returns a score', () => {
    const eligible = evaluateUfmVsatAdmission({ vsatScore: 245, thresholdGroup: 'standard' });
    expect(eligible.eligibility?.status).toBe('eligible');
    expect(eligible.score).toBeUndefined();
    expect(eligible.confidence).toBe('partial');

    const ineligible = evaluateUfmVsatAdmission({ vsatScore: 240, thresholdGroup: 'standard' });
    expect(ineligible.eligibility?.status).toBe('ineligible');
  });

  it('applies the law-economics 270 threshold', () => {
    const result = evaluateUfmVsatAdmission({ vsatScore: 260, thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible');
  });
});

describe('evaluateUfmHocbaAdmission — always unavailable (semester-granularity + formula ambiguity gap)', () => {
  it('never returns a score and reports the data-model gap', () => {
    const result = evaluateUfmHocbaAdmission();
    expect(result.confidence).toBe('unavailable');
    expect(result.score).toBeUndefined();
    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-hocba-semester-granularity-gap')).toBe(true);
  });
});
