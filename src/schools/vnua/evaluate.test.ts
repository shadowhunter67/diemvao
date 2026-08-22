import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateSchool, evaluateSchools } from '../../evaluation/schoolEvaluation';
import { evaluateVnuaThptExamAdmission } from './evaluate';

const a00Context = { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] as const } };

describe('VNUA THPT baseline eligibility 2026', () => {
  it('marks profiles below the common 15/30 condition as ineligible', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 4.75, chemistry: 5 } } };

    const result = evaluateVnuaThptExamAdmission(profile, a00Context);

    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.evidence).toContainEqual(expect.objectContaining({ sourceId: 'vnua-threshold-notice-2026' }));
  });

  it('keeps profiles above the baseline unresolved until group thresholds are imported', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, chemistry: 6.5 } } };

    const result = evaluateVnuaThptExamAdmission(profile, a00Context);

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRules).toContain('VNUA group-specific 2026 threshold table is image-rendered and has not been reviewed into structured program/group data.');
  });

  it('requires a selected subject combination', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, chemistry: 6.5 } } };

    const result = evaluateVnuaThptExamAdmission(profile);

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'vnua-subject-combination' }));
  });

  it('reports missing THPT subject scores', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7 } } };

    const result = evaluateVnuaThptExamAdmission(profile, a00Context);

    expect(result.missingInputs).toHaveLength(1);
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'vnua-thpt-chemistry' }));
  });

  it('routes through generic evaluateSchool and evaluateSchools adapters', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 4.75, chemistry: 5 } } };
    const context = { vnua: a00Context };

    expect(evaluateSchool(profile, 'vnua', { context: a00Context }).status).toBe('ineligible');
    expect(evaluateSchools(profile, ['vnua'], context)[0].status).toBe('ineligible');
  });
});

