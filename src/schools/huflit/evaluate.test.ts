import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHuflitPt1Admission, evaluateHuflitPt2Admission, evaluateHuflitPt3Admission } from './evaluate';

const combo = { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const };

describe('evaluateHuflitPt1Admission', () => {
  it('returns partial when no subject combination is chosen', () => {
    const result = evaluateHuflitPt1Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'huflit-subject-combination')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('reports missing THPT scores', () => {
    const result = evaluateHuflitPt1Admission({}, { subjectContext: combo });
    expect(result.missingRequirements?.some((r) => r.code === 'huflit-thpt-math')).toBe(true);
    expect(result.confidence).toBe('partial');
  });

  it('computes an exact-verified score for a complete profile with no bonus achievement', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } }, priority: { region: 'KV1' } };
    const result = evaluateHuflitPt1Admission(profile, { subjectContext: combo });
    expect(result.confidence).toBe('exact-verified');
    const academicStep = result.explanation.find((s) => s.id === 'huflit-academic-score');
    expect(academicStep?.output).toBe(21); // 8+7+6
    expect(result.score?.scale).toBe(30);
    expect(result.eligibility?.status).toBe('eligible'); // 21 >= 15
  });

  it('reports ineligible below the general 15/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 2, physics: 2, english: 2 } } };
    const result = evaluateHuflitPt1Admission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // score itself is still exact/computable
  });

  it('applies the 20/30 threshold for programId "luat"', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 6, english: 6.9 } } }; // total 19.9
    const result = evaluateHuflitPt1Admission(profile, { subjectContext: combo, programId: 'luat' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('stays partial when the applicant has a bonus achievement (bonus table not found)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } };
    const result = evaluateHuflitPt1Admission(profile, { subjectContext: combo, hasBonusAchievement: true });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.missingRequirements?.some((r) => r.code === 'huflit-bonus-table-not-found')).toBe(true);
  });
});

describe('evaluateHuflitPt2Admission', () => {
  const profile: ApplicantProfile = {
    thpt: { scores: { math: 8, physics: 7, english: 6 } },
    transcript: { grade10: { math: 8, physics: 7, english: 7 }, grade11: { math: 8, physics: 7, english: 7 }, grade12: { math: 8, physics: 7, english: 7 } },
  };

  it('requires both the THPT prerequisite and the 3-year transcript average', () => {
    const result = evaluateHuflitPt2Admission(profile, { subjectContext: combo });
    expect(result.confidence).toBe('exact-verified');
    const academicStep = result.explanation.find((s) => s.id === 'huflit-academic-score');
    expect(academicStep?.output).toBe(22); // 7+7+8
    expect(result.eligibility?.status).toBe('eligible'); // thpt total 21>=15, transcript 22>=18
  });

  it('reports ineligible when transcript average is below 18/30 despite meeting the THPT prerequisite', () => {
    const lowProfile: ApplicantProfile = {
      thpt: { scores: { math: 8, physics: 7, english: 6 } },
      transcript: { grade10: { math: 5, physics: 5, english: 5 }, grade11: { math: 5, physics: 5, english: 5 }, grade12: { math: 5, physics: 5, english: 5 } },
    };
    const result = evaluateHuflitPt2Admission(lowProfile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
  });
});

describe('evaluateHuflitPt3Admission', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateHuflitPt3Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'huflit-dgnl-total')).toBe(true);
  });

  it('computes an exact-verified score with no bonus component, always exact', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 1000 } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateHuflitPt3Admission(profile);
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.scale).toBe(1200);
    expect(result.eligibility?.status).toBe('eligible'); // 1000 >= 550
  });

  it('applies the 720/1200 threshold for programId "luat-kinh-te"', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateHuflitPt3Admission(profile, { programId: 'luat-kinh-te' });
    expect(result.eligibility?.status).toBe('ineligible');
  });
});
