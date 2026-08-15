import { describe, expect, it } from 'vitest';
import { evaluateHcmusAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

const a00 = { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] as const };

function completeProfile(total = 24): ApplicantProfile {
  const each = total / 3;
  return {
    thpt: { scores: { math: each, physics: each, chemistry: each } },
    transcript: {
      grade10: { math: each, physics: each, chemistry: each },
      grade11: { math: each, physics: each, chemistry: each },
      grade12: { math: each, physics: each, chemistry: each },
    },
  };
}

describe('evaluateHcmusAdmission', () => {
  it('eligibility unknown khi chua chon to hop', () => {
    const evaluation = evaluateHcmusAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.confidence).toBe('partial');
  });

  it('missing input khi thieu mon trong to hop', () => {
    const evaluation = evaluateHcmusAdmission({ thpt: { scores: { math: 8 } } }, { subjectContext: a00 });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
  });

  it('eligible khi du 3 mon va tong >=15', () => {
    const evaluation = evaluateHcmusAdmission({ thpt: { scores: { math: 6, physics: 5, chemistry: 5 } } }, { subjectContext: a00 });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('ineligible khi du 3 mon nhung tong <15', () => {
    const evaluation = evaluateHcmusAdmission({ thpt: { scores: { math: 4, physics: 4, chemistry: 4 } } }, { subjectContext: a00 });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('keeps only the non-score semiconductor percentile eligibility warning', () => {
    const evaluation = evaluateHcmusAdmission({});
    expect(evaluation.missingRules).toHaveLength(1);
    expect((evaluation.missingRequirements ?? []).map((requirement) => requirement.code)).toContain('hcmus-semiconductor-percentile');
    expect((evaluation.missingRequirements ?? []).map((requirement) => requirement.code)).not.toContain('hcmus-bonus-table');
    expect((evaluation.missingRequirements ?? []).map((requirement) => requirement.code)).not.toContain('hcmus-priority-formula');
  });

  it('sets exact final score when academic score, bonus and priority can be computed', () => {
    const evaluation = evaluateHcmusAdmission(completeProfile(23), { subjectContext: a00 });
    expect(evaluation.explanation.find((s) => s.id === 'hcmus-academic-score')?.output).toBeCloseTo(23, 5);
    expect(evaluation.explanation.find((s) => s.id === 'hcmus-bonus')?.output).toBe(0);
    expect(evaluation.explanation.find((s) => s.id === 'hcmus-priority')?.output).toBe(0);
    expect(evaluation.score).toEqual({ value: 23, scale: 30 });
    expect(evaluation.confidence).toBe('exact-verified');
  });

  it('adds selected program registration threshold while keeping exact final score', () => {
    const evaluation = evaluateHcmusAdmission(completeProfile(24), {
      subjectContext: a00,
      selectedProgramId: 'hcmus-7480107',
    });
    const step = evaluation.explanation.find((s) => s.id === 'hcmus-program-threshold');
    expect(step?.output).toBe(24);
    expect(step?.formula).toContain('80/100');
    expect(evaluation.score).toEqual({ value: 24, scale: 30 });
    expect(evaluation.confidence).toBe('exact-verified');
  });

  it('adds one selected bonus and priority before the final cap', () => {
    const evaluation = evaluateHcmusAdmission(
      { ...completeProfile(22), priority: { region: 'KV2', category: 'UT2' } },
      {
        subjectContext: a00,
        bonusCategoryId: 'provincial-olympiad-third',
      }
    );

    expect(evaluation.explanation.find((s) => s.id === 'hcmus-bonus')?.output).toBe(0.5);
    expect(evaluation.explanation.find((s) => s.id === 'hcmus-priority')?.output).toBe(1.25);
    expect(evaluation.score).toEqual({ value: 23.75, scale: 30 });
  });

  it('applies final cap at 30 without downgrading exact confidence', () => {
    const evaluation = evaluateHcmusAdmission(
      { ...completeProfile(30), priority: { region: 'KV1', category: 'UT1' } },
      {
        subjectContext: a00,
        bonusCategoryId: 'national-international-olympiad-first-second-third',
      }
    );

    expect(evaluation.score).toEqual({ value: 30, scale: 30 });
    expect(evaluation.confidence).toBe('exact-verified');
  });
});
