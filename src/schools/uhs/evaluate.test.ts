import { describe, expect, it } from 'vitest';
import { evaluateUhsAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

const b00 = { combinationId: 'B00', subjects: ['math', 'chemistry', 'biology'] as const };

describe('evaluateUhsAdmission', () => {
  it('stays unknown without selected program and combination', () => {
    const evaluation = evaluateUhsAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.map((item) => item.code)).toContain('program');
    expect(evaluation.missingRequirements?.map((item) => item.code)).toContain('uhs-subject-combination');
  });

  it('calculates verified UHS components without producing an exact score', () => {
    const profile: ApplicantProfile = {
      graduationYear: 2026,
      thpt: { scores: { math: 8, chemistry: 8, biology: 8 } },
      exams: { vact: { total: 960 } },
      transcript: {
        grade10: { math: 8, chemistry: 8, biology: 8 },
        grade11: { math: 8, chemistry: 8, biology: 8 },
        grade12: { math: 8, chemistry: 8, biology: 8 },
      },
    };

    const evaluation = evaluateUhsAdmission(profile, {
      selectedProgramId: 'uhs-7720101',
      subjectContext: b00,
      grade12Performance: 'tot',
    });

    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
    expect(evaluation.eligibility?.status).toBe('eligible');
    expect(evaluation.explanation.find((step) => step.id === 'uhs-thpt-component')?.output).toBe(80);
    expect(evaluation.explanation.find((step) => step.id === 'uhs-dgnl-component')?.output).toBe(80);
    expect(evaluation.explanation.find((step) => step.id === 'uhs-transcript-component')?.output).toBe(80);
  });

  it('uses the nursing entry threshold separately from medicine-like programs', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5.5, chemistry: 5.5, biology: 5.5 } } };
    const evaluation = evaluateUhsAdmission(profile, {
      selectedProgramId: 'uhs-7720301',
      subjectContext: b00,
      grade12Performance: 'kha',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('infers missing DGNL for 2026 candidates and applies bonus cap', () => {
    const profile: ApplicantProfile = {
      graduationYear: 2026,
      thpt: { scores: { math: 8, chemistry: 8, biology: 8 } },
    };
    const evaluation = evaluateUhsAdmission(profile, {
      selectedProgramId: 'uhs-7720201',
      subjectContext: b00,
      grade12Performance: 'tot',
      bonus: {
        foreignCertificate: { type: 'ielts', score: 9, issuedWithinTwoYears: true },
        satScore: 1600,
        satIssuedWithinTwoYears: true,
      },
    });

    expect(evaluation.explanation.find((step) => step.id === 'uhs-dgnl-component')?.output).toBe(69.6);
    expect(evaluation.explanation.find((step) => step.id === 'uhs-bonus')?.output).toBe(5);
  });

  it('does not mutate ApplicantProfile with derived UHS values', () => {
    const profile: ApplicantProfile = {
      graduationYear: 2026,
      thpt: { scores: { math: 8, chemistry: 8, biology: 8 } },
    };
    const before = structuredClone(profile);
    evaluateUhsAdmission(profile, {
      selectedProgramId: 'uhs-7720101',
      subjectContext: b00,
      grade12Performance: 'tot',
    });
    expect(profile).toEqual(before);
  });
});
