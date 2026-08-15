import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateUelAdmission } from './evaluate';
import type { UelApplicantType } from './calculator';

const officialExampleProfile: ApplicantProfile = {
  exams: { vact: { total: 890 } },
  thpt: { scores: { math: 8.3, physics: 8.2, english: 8.0 } },
  transcript: {
    grade10: { math: 9.0, physics: 9.3, english: 9.2 },
    grade11: { math: 9.0, physics: 9.3, english: 9.2 },
    grade12: { math: 9.0, physics: 9.3, english: 9.2 },
  },
  certificates: { ielts: 5.5 },
  priority: { region: 'KV2' },
};

const officialExampleFixture: Array<{ applicantType: UelApplicantType; officialFinalScore: number }> = [
  { applicantType: 'dt1', officialFinalScore: 82.64 },
  { applicantType: 'dt2', officialFinalScore: 86.63 },
  { applicantType: 'dt3', officialFinalScore: 80.1 },
];

describe('evaluateUelAdmission official example fixture', () => {
  it.each(officialExampleFixture)(
    'matches the official UEL worked example for $applicantType',
    ({ applicantType, officialFinalScore }) => {
      const evaluation = evaluateUelAdmission(officialExampleProfile, {
        applicantType,
        subjectContext: { combinationId: 'A01', subjects: ['math', 'physics', 'english'] },
      });

      expect(evaluation.confidence).toBe('exact-verified');
      expect(evaluation.score).toEqual({ value: officialFinalScore, scale: 100 });
      expect(evaluation.evidence).toContainEqual(expect.objectContaining({ sourceId: 'uel-formula-2026' }));
      expect(evaluation.evidence).toContainEqual(expect.objectContaining({ sourceId: 'uel-certificate-bonus-html-2026' }));
    }
  );

  it('keeps exact scoped to supported certificate fields in ApplicantProfile', () => {
    const evaluation = evaluateUelAdmission(
      { ...officialExampleProfile, certificates: {} },
      { applicantType: 'dt1', subjectContext: { combinationId: 'A01', subjects: ['math', 'physics', 'english'] } }
    );

    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score?.value).toBeLessThan(82.64);
    expect(evaluation.missingRequirements?.some((requirement) => requirement.kind === 'official-rule')).toBe(false);
  });
});
