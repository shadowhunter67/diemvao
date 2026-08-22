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

  it('keeps profiles above the baseline unresolved until a program group is selected', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, chemistry: 6.5 } } };

    const result = evaluateVnuaThptExamAdmission(profile, a00Context);

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'vnua-program-group' }));
  });

  it('marks profiles below a selected numeric group threshold as ineligible', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 6.5, chemistry: 6 } } };

    const result = evaluateVnuaThptExamAdmission(profile, { ...a00Context, programGroupId: 'HVN18' });

    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.eligibility?.reasons.join(' ')).toContain('20/30');
  });

  it('marks profiles meeting a selected numeric group threshold as eligible', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 7, physics: 7, chemistry: 6 } } };

    const result = evaluateVnuaThptExamAdmission(profile, { ...a00Context, programGroupId: 'HVN18' });

    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('eligible');
    expect(result.score).toBeUndefined();
  });

  it('keeps ministry-governed groups unresolved', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, chemistry: 6.5 } } };

    const result = evaluateVnuaThptExamAdmission(profile, { ...a00Context, programGroupId: 'HVN13' });

    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'official-rule', code: 'vnua-ministry-governed-group-threshold' }));
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
    const context = { vnua: { ...a00Context, programGroupId: 'HVN18' as const } };

    expect(evaluateSchool(profile, 'vnua', { context: { ...a00Context, programGroupId: 'HVN18' } }).status).toBe('ineligible');
    expect(evaluateSchools(profile, ['vnua'], context)[0].status).toBe('ineligible');
  });
});

