import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateFtuDomesticExamAdmission } from './evaluate';
import { ftuDomesticExamGoldenCases } from './__fixtures__/officialExamples2026';

describe('FTU domestic exam evaluation 2026', () => {
  it('converts V-ACT to FTU standard scale 30 and returns exact score', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 950, totalSource: 'user-total-input' } } };
    const result = evaluateFtuDomesticExamAdmission(profile, { exam: 'vact', programGroup: 'standard30' });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score).toEqual({ value: 27.86, scale: 30 });
    expect(result.eligibility?.status).toBe('eligible');
  });

  it('applies FTU priority reduction after bonus on scale 30', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 850, totalSource: 'user-total-input' } }, priority: { region: 'KV1', category: 'UT1' } };
    const result = evaluateFtuDomesticExamAdmission(profile, { exam: 'vact', programGroup: 'standard30', bonus30: 1 });
    expect(result.score?.value).toBe(28.73);
  });

  it('requires V-ACT when profile does not have shared V-ACT total', () => {
    const result = evaluateFtuDomesticExamAdmission({}, { exam: 'vact' });
    expect(result.confidence).toBe('unavailable');
    expect(result.missingRequirements?.[0]?.code).toBe('ftu-vact');
  });

  it.each(ftuDomesticExamGoldenCases)('matches golden case $id', (goldenCase) => {
    const result = evaluateFtuDomesticExamAdmission({}, goldenCase.input);
    expect(result.score).toEqual({ value: goldenCase.expected.score, scale: goldenCase.expected.scale });
  });
});

