import type { SourcedRule } from '../../core/evidence';
import { FTU_DOMESTIC_EXAM_MIN_SCORE, type FtuDomesticExam } from './calculator';

export const ftuDomesticExamFormulaEvidence = {
  value: {
    hsa: '27 + (raw - 100) * 3 / 50',
    vact: '27 + (raw - 850) * 3 / 350',
    tsa: '27 + (raw - 70) * 3 / 30',
    integratedScale: 'base30 * 4 / 3',
  },
  evidence: [
    {
      sourceId: 'ftu-admissions-methods-2026',
      location:
        'Section 4.2.1 publishes HSA/V-ACT/TSA conversion to scale 30 and the integrated CS/AI/Data Science group scale 40 conversion by multiplying 4/3.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<string, string>>;

export const ftuDomesticExamThresholdEvidence = {
  value: FTU_DOMESTIC_EXAM_MIN_SCORE,
  evidence: [
    {
      sourceId: 'ftu-admissions-methods-2026',
      location: 'Domestic exam eligibility thresholds: HSA >= 100, V-ACT >= 850, TSA >= 70.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<FtuDomesticExam, number>>;

export const ftuPriorityAndBonusEvidence = {
  value: {
    bonusCap30: 3,
    priorityScale30: '{[30 - (score + bonus)] / 7.5} * priority',
    priorityScale40: '{[40 - (score40 + bonus40)] / 10} * priority * 4/3',
  },
  evidence: [
    {
      sourceId: 'ftu-admissions-methods-2026',
      location:
        'Section III.2/III.3 publishes scale-30 bonus table/cap and priority reduction after adding bonus for scale 30 and scale 40 programs.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<string, string | number>>;

