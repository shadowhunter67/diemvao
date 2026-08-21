import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { findNeuVactEquivalenceBand } from './equivalence';
import { evaluateNeuEquivalence } from './evaluate';

describe('NEU 2026 equivalence bands', () => {
  it('finds the official V-ACT to THPT band', () => {
    expect(findNeuVactEquivalenceBand(900)?.thpt).toEqual([26, 28]);
    expect(findNeuVactEquivalenceBand(700)?.thpt).toEqual([22, 24]);
    expect(findNeuVactEquivalenceBand(699)).toBeUndefined();
  });

  it('evaluates shared V-ACT profile as partial band lookup', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 1004, totalSource: 'user-total-input' } } };
    const result = evaluateNeuEquivalence(profile);
    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('eligible');
    expect(result.explanation[0].formula).toContain('THPT 28-30');
    expect(result.score).toBeUndefined();
  });
});

