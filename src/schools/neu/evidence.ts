import type { SourcedRule } from '../../core/evidence';
import { NEU_EQUIVALENCE_BANDS, NEU_THPT_THRESHOLD_30 } from './equivalence';

export const neuThresholdEvidence = {
  value: NEU_THPT_THRESHOLD_30,
  evidence: [
    {
      sourceId: 'neu-threshold-equivalence-2026',
      location: 'Notice 1613 page 1, section 1: threshold 22.0/30 for A00, A01, D01, D07.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<number>;

export const neuEquivalenceBandEvidence = {
  value: NEU_EQUIVALENCE_BANDS,
  evidence: [
    {
      sourceId: 'neu-threshold-equivalence-2026',
      location: 'Notice 1613 page 2, section 3: equivalent admitted-score bands for THPT, HSA, SAT, V-ACT, and TSA.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<typeof NEU_EQUIVALENCE_BANDS>;

