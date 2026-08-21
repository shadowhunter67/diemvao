import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import { assertGoldenCaseProvenance } from '../../../core/goldenAdmissionCase';
import type { FtuDomesticExamEvaluationContext } from '../evaluate';

export const ftuDomesticExamGoldenCases: GoldenAdmissionCase<
  FtuDomesticExamEvaluationContext,
  { score: number; scale: number }
>[] = [
  {
    id: 'ftu-vact-standard30-950-no-priority',
    schoolId: 'ftu',
    methodId: 'ftu-domestic-exam-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ftu-admissions-methods-2026',
    sourceNote: 'FTU publishes the V-ACT scale-30 formula as 27 + (raw - 850) * 3 / 350.',
    derivation: '27 + (950 - 850) * 3 / 350 = 27.857142..., round2 = 27.86; no bonus/priority, so final = 27.86/30.',
    input: { exam: 'vact', rawScore: 950, programGroup: 'standard30', bonus30: 0 },
    expected: { score: 27.86, scale: 30 },
  },
  {
    id: 'ftu-vact-integrated40-1200-cap',
    schoolId: 'ftu',
    methodId: 'ftu-domestic-exam-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ftu-admissions-methods-2026',
    sourceNote: 'FTU publishes the integrated CS/AI/Data Science route as base30 * 4/3 and caps by the admission scale.',
    derivation: 'V-ACT 1200 gives base30 = 27 + 350 * 3 / 350 = 30; scale40 = 30 * 4/3 = 40; final cap = 40.',
    input: { exam: 'vact', rawScore: 1200, programGroup: 'integrated40', bonus30: 0 },
    expected: { score: 40, scale: 40 },
  },
];

assertGoldenCaseProvenance(ftuDomesticExamGoldenCases);

