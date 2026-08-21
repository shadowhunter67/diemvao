import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { checkPtitDomesticExamThreshold } from './eligibility';
import { evaluatePtitDomesticExamAdmission } from './evaluate';

describe('PTIT domestic exam eligibility 2026', () => {
  it('checks V-ACT threshold from shared profile', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 620, totalSource: 'user-total-input' } } };
    const result = evaluatePtitDomesticExamAdmission(profile);
    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('eligible');
    expect(result.score).toBeUndefined();
  });

  it('marks V-ACT below 600 as ineligible for the domestic exam route', () => {
    const result = evaluatePtitDomesticExamAdmission({}, { exam: 'vact', rawScore: 599 });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('locks every official domestic threshold', () => {
    expect(checkPtitDomesticExamThreshold('tsa', 50).pass).toBe(true);
    expect(checkPtitDomesticExamThreshold('hsa', 75).pass).toBe(true);
    expect(checkPtitDomesticExamThreshold('vact', 600).pass).toBe(true);
    expect(checkPtitDomesticExamThreshold('spt', 15).pass).toBe(true);
  });
});

