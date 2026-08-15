import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateIuAdmission } from './evaluate';

const A00 = { id: 'A00', subjects: ['math', 'physics', 'chemistry'] as const };

function buildProfile(overrides: Partial<ApplicantProfile> = {}): ApplicantProfile {
  return {
    thpt: { scores: { math: 8, physics: 8, chemistry: 8 } }, // total 24
    transcript: {
      grade10: { math: 8, physics: 8, chemistry: 8 },
      grade11: { math: 8, physics: 8, chemistry: 8 },
      grade12: { math: 8, physics: 8, chemistry: 8 },
    }, // avg per subject = 8, total 24
    ...overrides,
  };
}

describe('evaluateIuAdmission', () => {
  it('returns partial confidence with no score when subject combination not chosen', () => {
    const result = evaluateIuAdmission(buildProfile());
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
  });

  it('returns partial confidence with no score when THPT/transcript incomplete', () => {
    const profile = buildProfile({ thpt: { scores: { math: 8 } } });
    const result = evaluateIuAdmission(profile, { subjectContext: A00 });
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
  });

  it('returns exact-verified with a real score once inputs are complete', () => {
    const result = evaluateIuAdmission(buildProfile(), { subjectContext: A00 });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score).toBeDefined();
    // thpt=80, dgnl substitute=0.83*80=66.4, transcript=80
    // academic = 0.4*80 + 0.5*66.4 + 0.1*80 = 32 + 33.2 + 8 = 73.2
    expect(result.score?.value).toBeCloseTo(73.2, 1);
    expect(result.score?.scale).toBe(100);
  });

  it('adds bonus and priority into the final score', () => {
    const profile = buildProfile({ priority: { region: 'KV1', category: 'UT1' } });
    const withoutBonus = evaluateIuAdmission(profile, { subjectContext: A00 });
    const withBonus = evaluateIuAdmission(profile, {
      subjectContext: A00,
      hasPrioritySchool: true,
      specialAchievementCount: 1,
    });
    expect(withBonus.score!.value).toBeGreaterThan(withoutBonus.score!.value);
  });

  it('never mutates the input ApplicantProfile', () => {
    const profile = buildProfile();
    const snapshot = JSON.parse(JSON.stringify(profile));
    evaluateIuAdmission(profile, { subjectContext: A00, hasPrioritySchool: true, specialAchievementCount: 2 });
    expect(profile).toEqual(snapshot);
  });

  it('compares against the selected program cutoff when provided', () => {
    // academic ~73.2, no bonus/priority -> below 7220201's cutoff of 73 is a near-boundary check;
    // use a low cutoff program (7580201/7580302 = 50) to assert a clear "eligible" case instead.
    const result = evaluateIuAdmission(buildProfile(), { subjectContext: A00, programId: 'iu-7580201' });
    expect(result.eligibility?.status).toBe('eligible');
    expect(result.eligibility?.reasons.some((r) => r.includes('điểm trúng tuyển'))).toBe(true);
  });

  it('reports ineligible against a high cutoff program when score falls short', () => {
    const lowProfile = buildProfile({
      thpt: { scores: { math: 3, physics: 3, chemistry: 3 } },
      transcript: {
        grade10: { math: 3, physics: 3, chemistry: 3 },
        grade11: { math: 3, physics: 3, chemistry: 3 },
        grade12: { math: 3, physics: 3, chemistry: 3 },
      },
    });
    const result = evaluateIuAdmission(lowProfile, { subjectContext: A00, programId: 'iu-7220201' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('does not report any missingRules for the exact-verified path (object-1 scope only)', () => {
    const result = evaluateIuAdmission(buildProfile(), { subjectContext: A00 });
    expect(result.missingRules).toEqual([]);
  });
});
