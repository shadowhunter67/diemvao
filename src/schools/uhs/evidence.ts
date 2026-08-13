import type { SourcedRule } from '../../core/evidence';
import { UHS_MEDICINE_PHARMACY_COMBINATION_THRESHOLD_30, UHS_MEDICINE_PHARMACY_SUBJECT_THRESHOLD_10 } from './eligibility';

export const uhsThresholdEvidence = {
  value: { combinationThreshold30: UHS_MEDICINE_PHARMACY_COMBINATION_THRESHOLD_30, subjectThreshold10: UHS_MEDICINE_PHARMACY_SUBJECT_THRESHOLD_10 },
  evidence: [
    {
      sourceId: 'uhs-info-2026',
      location: 'Ngưỡng Y khoa/Dược: tổng tổ hợp ≥20/30 hoặc có môn ≥8.5/10',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ combinationThreshold30: number; subjectThreshold10: number }>;
