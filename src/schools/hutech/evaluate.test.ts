import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHutechThptAdmission, evaluateHutechDgnlAdmission, evaluateHutechVsatAdmission, evaluateHutechHocbaAdmission } from './evaluate';

const combo = { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const };

describe('evaluateHutechThptAdmission', () => {
  it('returns partial when no subject combination is chosen', () => {
    const result = evaluateHutechThptAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-subject-combination')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('reports missing THPT scores', () => {
    const result = evaluateHutechThptAdmission({}, { subjectContext: combo });
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-thpt-math')).toBe(true);
    expect(result.confidence).toBe('partial');
  });

  it('computes an exact-verified score for a complete profile with no bonus achievement', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } }, priority: { region: 'KV1' } };
    const result = evaluateHutechThptAdmission(profile, { subjectContext: combo });
    expect(result.confidence).toBe('exact-verified');
    const academicStep = result.explanation.find((s) => s.id === 'hutech-academic-score');
    expect(academicStep?.output).toBe(21);
    expect(result.score?.scale).toBe(30);
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 21 >= 15
  });

  it('reports ineligible below the medicine 22/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, english: 7 } } }; // total 21
    const result = evaluateHutechThptAdmission(profile, { subjectContext: combo, thresholdGroup: 'medicine' });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // score itself is still exact/computable
  });

  it('applies the nursing-lab 18/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 6, physics: 6, english: 5.9 } } }; // total 17.9
    const result = evaluateHutechThptAdmission(profile, { subjectContext: combo, thresholdGroup: 'nursing-lab' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('stays partial when the applicant has a bonus achievement (bonus table not found)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } };
    const result = evaluateHutechThptAdmission(profile, { subjectContext: combo, hasBonusAchievement: true });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-bonus-table-not-found')).toBe(true);
  });
});

describe('evaluateHutechDgnlAdmission', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateHutechDgnlAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-dgnl-total')).toBe(true);
  });

  it('computes an exact-verified score with no bonus achievement', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateHutechDgnlAdmission(profile);
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.scale).toBe(1200);
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 700 >= 550
  });

  it('applies the medicine 650/1200 threshold', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 600 } } };
    const result = evaluateHutechDgnlAdmission(profile, { thresholdGroup: 'medicine' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('stays partial when the applicant has a bonus achievement', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateHutechDgnlAdmission(profile, { hasBonusAchievement: true });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
  });
});

describe('evaluateHutechVsatAdmission — eligibility-only', () => {
  it('asks for V-SAT score when absent', () => {
    const result = evaluateHutechVsatAdmission();
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-vsat-score')).toBe(true);
  });

  it('reports eligible/ineligible but never returns a score', () => {
    const eligible = evaluateHutechVsatAdmission({ vsatScore: 230, thresholdGroup: 'standard' });
    expect(eligible.eligibility?.status).toBe('eligible');
    expect(eligible.score).toBeUndefined();
    expect(eligible.confidence).toBe('partial');

    const ineligible = evaluateHutechVsatAdmission({ vsatScore: 220, thresholdGroup: 'standard' });
    expect(ineligible.eligibility?.status).toBe('ineligible');
  });

  it('applies the medicine/pharmacy 250 threshold', () => {
    const result = evaluateHutechVsatAdmission({ vsatScore: 240, thresholdGroup: 'medicine' });
    expect(result.eligibility?.status).toBe('ineligible');
  });
});

describe('evaluateHutechHocbaAdmission — always unavailable (semester-granularity gap)', () => {
  it('never returns a score and reports the data-model gap', () => {
    const result = evaluateHutechHocbaAdmission();
    expect(result.confidence).toBe('unavailable');
    expect(result.score).toBeUndefined();
    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements?.some((r) => r.code === 'hutech-hocba-semester-granularity-gap')).toBe(true);
  });
});
