import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import {
  evaluateHcmulawThpt5Admission,
  evaluateHcmulawCombined2Admission,
  evaluateHcmulawPriorityHighschool3Admission,
  evaluateHcmulawVsat4Admission,
} from './evaluate';

describe('evaluateHcmulawThpt5Admission', () => {
  it('returns partial when no program is chosen', () => {
    const result = evaluateHcmulawThpt5Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-program')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('returns partial for an unknown program id', () => {
    const result = evaluateHcmulawThpt5Admission({}, { programId: 'not-a-real-program' as never });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-program')).toBe(true);
  });

  it('returns partial when no combination is chosen', () => {
    const result = evaluateHcmulawThpt5Admission({}, { programId: '7380101' });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-combination')).toBe(true);
  });

  it('returns partial for a combination not offered by the chosen program', () => {
    // X26 (Toán/tiếng Anh/Tin học) is not one of Luật's combinations.
    const result = evaluateHcmulawThpt5Admission({}, { programId: '7380101', combinationCode: 'X26' });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-combination')).toBe(true);
  });

  it('reports missing THPT scores', () => {
    const result = evaluateHcmulawThpt5Admission({}, { programId: '7380101', combinationCode: 'A01' });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-thpt-math')).toBe(true);
  });

  it('computes an exact-verified score for a complete profile with no priority', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // A01 => 21
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7380101', combinationCode: 'A01' });
    expect(result.confidence).toBe('exact-verified');
    const groupStep = result.explanation.find((s) => s.id === 'hcmulaw-subject-group');
    expect(groupStep?.output).toBe(21);
    expect(result.score).toEqual({ value: 21, scale: 30 });
    expect(result.eligibility?.status).toBe('eligible'); // Luật threshold is 20/30, 21 >= 20
  });

  it('reports eligible at/above the program threshold (Luật, 20/30)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // 21 >= 20
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7380101', combinationCode: 'A01' });
    expect(result.eligibility?.status).toBe('eligible');
  });

  it('reports ineligible below the program threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 5, english: 5 } } }; // 15 < 20
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7380101', combinationCode: 'A01' });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // score itself is still exact/computable
  });

  it('applies national priority (no reduction below 22.5)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 6, physics: 6, english: 6 } }, priority: { region: 'KV1', category: 'UT2' } }; // raw 18, priority 0.75+1=1.75
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7340101', combinationCode: 'A01' });
    expect(result.score?.value).toBe(19.75);
  });

  it('reduces priority once the raw subject-group score reaches 22.5', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 9, physics: 9, english: 9 } }, priority: { region: 'KV1' } }; // raw 27, priority reduces to [(30-27)/7.5]*0.75=0.3
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7340101', combinationCode: 'A01' });
    expect(result.score?.value).toBe(27.3);
  });

  it('clamps the final score at 30', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 10, physics: 10, english: 10 } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7340101', combinationCode: 'A01' });
    expect(result.score?.value).toBe(30);
  });

  it('accepts an A00 (no foreign language) combination for Quản trị - Luật', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, chemistry: 7 } } };
    const result = evaluateHcmulawThpt5Admission(profile, { programId: '7340102', combinationCode: 'A00' });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.value).toBe(21);
  });
});

describe('evaluateHcmulawCombined2Admission / evaluateHcmulawPriorityHighschool3Admission — always unavailable (6-semester granularity gap)', () => {
  it('never returns a score and reports the hocba-granularity gap', () => {
    for (const evaluate of [evaluateHcmulawCombined2Admission, evaluateHcmulawPriorityHighschool3Admission]) {
      const result = evaluate();
      expect(result.confidence).toBe('unavailable');
      expect(result.score).toBeUndefined();
      expect(result.eligibility?.status).toBe('unknown');
      expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-hocba-semester-granularity-gap')).toBe(true);
    }
  });
});

describe('evaluateHcmulawVsat4Admission — quy đổi riêng từng môn (mục 2.2)', () => {
  it('returns partial when no program is chosen', () => {
    const result = evaluateHcmulawVsat4Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-program')).toBe(true);
  });

  it('reports missing V-SAT subject scores', () => {
    const result = evaluateHcmulawVsat4Admission({}, { programId: '7340101', combinationCode: 'A00' });
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-vsat-math')).toBe(true);
  });

  it('computes an exact score converting each subject independently, using boundary values so y=d exactly', () => {
    // A00 = math/physics/chemistry, all 3 have published V-SAT tables.
    // math x=129.5 (band max) -> y=9; physics x=92 (band max) -> y=6.25; chemistry x=136.5 (band max) -> y=9.25
    const result = evaluateHcmulawVsat4Admission(
      {},
      { programId: '7340101', combinationCode: 'A00', vsatScoresBySubject: { math: 129.5, physics: 92, chemistry: 136.5 } }
    );
    expect(result.confidence).toBe('exact-verified');
    const groupStep = result.explanation.find((s) => s.id === 'hcmulaw-vsat-subject-group');
    expect(groupStep?.output).toBe(24.5); // 9 + 6.25 + 9.25
    expect(result.score).toEqual({ value: 24.5, scale: 30 });
    expect(result.eligibility?.status).toBe('eligible'); // threshold 17/30 for Quản trị kinh doanh
  });

  it('flags a combination with a subject that has no published V-SAT table (informatics, X26)', () => {
    const result = evaluateHcmulawVsat4Admission({}, { programId: '7340101', combinationCode: 'X26' });
    expect(result.missingRequirements?.some((r) => r.code === 'hcmulaw-vsat-subject-table-missing')).toBe(true);
  });
});
