import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHcmueAdmission } from './evaluate';

const profile: ApplicantProfile = {
  thpt: { scores: { math: 8.5, physics: 8, chemistry: 8 } },
};

describe('evaluateHcmueAdmission', () => {
  it('checks threshold eligibility without creating a final admission score', () => {
    const evaluation = evaluateHcmueAdmission(profile, {
      selectedProgramId: 'hcmue-7140209',
      subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.eligibility?.status).toBe('eligible');
    expect(evaluation.score).toBeUndefined();
    expect(evaluation.explanation).toContainEqual(expect.objectContaining({ id: 'hcmue-thpt-threshold', output: 24.5, scale: 30 }));
  });

  it('reports missing program, combination, and subject inputs', () => {
    const evaluation = evaluateHcmueAdmission({ thpt: { scores: { math: 8 } } });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'program' }));
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'hcmue-subject-combination' }));
  });

  it('does not mutate ApplicantProfile', () => {
    const frozen = structuredClone(profile);
    evaluateHcmueAdmission(profile, {
      selectedProgramId: 'hcmue-7140209',
      subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] },
    });
    expect(profile).toEqual(frozen);
  });
});
