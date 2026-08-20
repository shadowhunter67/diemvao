import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateIuhCombinedAdmission } from './evaluate';

const fullProfile: ApplicantProfile = {
  thpt: { scores: { math: 9, physics: 8, chemistry: 7 } },
  transcript: { grade12: { math: 6, physics: 6, chemistry: 6 } },
};

const subjectContext = { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] as const };

describe('evaluateIuhCombinedAdmission', () => {
  it('returns partial with a school-context requirement when no subject combination is chosen', () => {
    const result = evaluateIuhCombinedAdmission(fullProfile, {});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.[0]).toMatchObject({ kind: 'school-context', code: 'iuh-subject-combination' });
  });

  it('returns partial with profile-input requirements when THPT scores are missing', () => {
    const result = evaluateIuhCombinedAdmission({}, { subjectContext });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.every((r) => r.kind === 'profile-input')).toBe(true);
  });

  it('returns exact-verified with score when all inputs are present (no ĐGNL)', () => {
    const result = evaluateIuhCombinedAdmission(fullProfile, { subjectContext });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score).toEqual({ value: 24, scale: 30 });
    expect(result.eligibility?.status).toBe('eligible');
  });

  it('downgrades to partial (no score) when the profile has a ĐGNL/V-ACT score — XT3 blocked by unresolved ĐTK', () => {
    const profileWithVact: ApplicantProfile = { ...fullProfile, exams: { vact: { total: 950 } } };
    const result = evaluateIuhCombinedAdmission(profileWithVact, { subjectContext });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.missingRequirements?.some((r) => r.code === 'iuh-dgnl-top-score-unresolved')).toBe(true);
  });

  it('returns partial (xt1 not computable, score withheld) when grade-12 transcript scores are missing', () => {
    const profileNoTranscript: ApplicantProfile = { thpt: { scores: { math: 9, physics: 8, chemistry: 7 } } };
    const result = evaluateIuhCombinedAdmission(profileNoTranscript, { subjectContext });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
    expect(result.missingRequirements?.some((r) => r.code === 'iuh-transcript-math')).toBe(true);
  });

  it('still returns an exact score when ineligible (below the 18/30 threshold)', () => {
    const lowProfile: ApplicantProfile = {
      thpt: { scores: { math: 5, physics: 5, chemistry: 5 } },
      transcript: { grade12: { math: 5, physics: 5, chemistry: 5 } },
    };
    const result = evaluateIuhCombinedAdmission(lowProfile, { subjectContext });
    expect(result.confidence).toBe('exact-verified');
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.score).toEqual({ value: 15, scale: 30 });
  });

  it('applies bonus and priority into the final score', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 7, physics: 7, chemistry: 6 } },
      transcript: { grade12: { math: 7, physics: 7, chemistry: 6 } },
      priority: { region: 'KV2' },
    };
    const result = evaluateIuhCombinedAdmission(profile, {
      subjectContext,
      reward: { threeYearExcellent: true },
      englishEncouragement30: 0.5,
    });
    expect(result.confidence).toBe('exact-verified');
    // ĐTN=ĐHB=20 -> XT1=XT2=20 + priority(0.25) + bonus(1.25+0.5=1.75) = 21.75+0.25=22... compute precisely below
    expect(result.score?.value).toBeCloseTo(22, 5);
  });
});
