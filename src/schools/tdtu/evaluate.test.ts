import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateTdtuPt1Admission, evaluateTdtuPt2Admission } from './evaluate';

const combo = { combinationId: 'A01', mainSubjectId: 'math' as const, subjects: ['math', 'physics', 'english'] as const };

describe('evaluateTdtuPt1Admission', () => {
  it('returns partial + unknown eligibility when no subject combination is chosen', () => {
    const result = evaluateTdtuPt1Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements?.some((req) => req.code === 'tdtu-subject-combination')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('reports missing profile-input requirements when THPT/transcript scores are absent', () => {
    const result = evaluateTdtuPt1Admission({}, { subjectContext: combo });
    expect(result.missingRequirements?.some((req) => req.code === 'tdtu-thpt-math')).toBe(true);
    expect(result.missingRequirements?.some((req) => req.code === 'tdtu-transcript-math')).toBe(true);
    expect(result.confidence).toBe('partial');
    expect(result.score).toBeUndefined();
  });

  it('computes an exact-verified score for a complete Đối tượng 1.1 profile', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 8, physics: 7, english: 7 } },
      transcript: { grade10: { math: 9, physics: 8, english: 8 }, grade11: { math: 9, physics: 8, english: 8 }, grade12: { math: 9, physics: 8, english: 8 } },
      priority: { region: 'KV1' },
    };
    const result = evaluateTdtuPt1Admission(profile, { subjectContext: combo, thuong: [{ category: 'khkt-quocgia-quocte', rank: 'ba' }] });
    expect(result.confidence).toBe('exact-verified');
    const competencyStep = result.explanation.find((step) => step.id === 'tdtu-competency');
    expect(competencyStep?.output).toBe(77.5); // THPT (7+7+16)*2.5=75, transcript (8+8+18)*2.5=85 => 75*0.75+85*0.25=77.5
    const bonusStep = result.explanation.find((step) => step.id === 'tdtu-bonus');
    expect(bonusStep?.output).toBe(6);
    expect(result.score?.scale).toBe(100);
    expect(result.score?.value).toBeGreaterThan(0);
    expect(result.eligibility?.status).toBe('unknown'); // đạt ngưỡng chung nhưng chưa biết ngưỡng riêng ngành
  });

  it('reports ineligible below the general 15/30 threshold while still computing the score', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 2, physics: 2, english: 2 } },
      transcript: { grade10: { math: 5, physics: 5, english: 5 }, grade11: { math: 5, physics: 5, english: 5 }, grade12: { math: 5, physics: 5, english: 5 } },
    };
    const result = evaluateTdtuPt1Admission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified');
    expect(result.score).toBeDefined();
  });
});

describe('evaluateTdtuPt2Admission', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateTdtuPt2Admission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((req) => req.code === 'tdtu-dgnl-total')).toBe(true);
  });

  it('computes an exact-verified score from profile.exams.vact.total', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 1000 } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateTdtuPt2Admission(profile);
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.scale).toBe(1200);
    // priority not reduced (1000 < ... wait 1000 >= 900, so reduced): KV1+UT1 = 2.75*40=110; factor=(1200-1000)/300=0.6667; ĐUT=73.33
    const priorityStep = result.explanation.find((step) => step.id === 'tdtu-pt2-priority');
    expect(priorityStep?.output).toBeCloseTo(73.33, 1);
    expect(result.score?.value).toBeCloseTo(1000 + (priorityStep?.output ?? 0), 1);
  });
});
