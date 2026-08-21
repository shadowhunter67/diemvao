import type { SourcedRule } from '../../core/evidence';
import { PTIT_DOMESTIC_EXAM_THRESHOLDS, type PtitDomesticExam } from './eligibility';

export const ptitDomesticExamThresholdEvidence = {
  value: PTIT_DOMESTIC_EXAM_THRESHOLDS,
  evidence: [
    {
      sourceId: 'ptit-admission-methods-2026',
      location: 'Section B.III lists domestic DGNL/DGTD thresholds: TSA >= 50, HSA >= 75, V-ACT >= 600, SPT >= 15.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<PtitDomesticExam, number>>;

export const ptitRawFormulaEvidence = {
  value: 'DXT = DGNL/DGTD score + bonus + priority',
  evidence: [
    {
      sourceId: 'ptit-admission-methods-2026',
      location: 'Section C.3 states DXT = DGNL/DGTD score + bonus + priority; section D publishes bonus tables on scale 30 and cap by each method scale.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<string>;

