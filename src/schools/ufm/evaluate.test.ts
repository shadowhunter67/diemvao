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

  it('adds the bonus (b1/b2/b3) to the final score and stays exact-verified', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // raw30 = 21
    const result = evaluateUfmThptAdmission(profile, {
      subjectContext: combo,
      bonus: { nationalAchievementLevel: 'third', giftedSchoolStudent: true, englishCertificateTier: 0.5 }, // 1.5 + 0.75 + 0.5 = 2.75
    });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.value).toBe(23.75); // 21 + 0 (priority) + 2.75 (bonus)
    const bonusStep = result.explanation.find((s) => s.id === 'ufm-bonus');
    expect(bonusStep?.output).toBe(2.75);
  });

  it('caps the bonus at 3,0 (10% of thang 30) even when b1+b2+b3 would exceed it', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // raw30 = 21
    const result = evaluateUfmThptAdmission(profile, {
      subjectContext: combo,
      bonus: { nationalAchievementLevel: 'first', nationalEncouragementAward: true, englishCertificateTier: 1.5 },
    });
    expect(result.score?.value).toBe(24); // 21 + 0 (priority) + 3 (bonus capped)
  });

  it('clamps the final score at 30 even when raw + priority + bonus would exceed it', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 10, physics: 10, english: 9 } }, priority: { region: 'KV1', category: 'UT1' } }; // raw30 = 29
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo, bonus: { nationalAchievementLevel: 'first' } });
    expect(result.score?.value).toBe(30);
  });
});

describe('evaluateUfmDgnlAdmission — eligibility-only (final-score conversion table unparsed)', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateUfmDgnlAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-dgnl-total')).toBe(true);
  });

  it('checks the threshold but never returns a score (needs the percentile conversion table)', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateUfmDgnlAdmission(profile);
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 700 >= 657
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-final-score-conversion-unparsed')).toBe(true);
  });

  it('applies the law-economics 720/1200 threshold', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateUfmDgnlAdmission(profile, { thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible');
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

describe('evaluateUfmHocbaAdmission — always unavailable (percentile conversion table unparsed)', () => {
  it('never returns a score and reports the conversion-table gap', () => {
    const result = evaluateUfmHocbaAdmission();
    expect(result.confidence).toBe('unavailable');
    expect(result.score).toBeUndefined();
    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-final-score-conversion-unparsed')).toBe(true);
  });
});
