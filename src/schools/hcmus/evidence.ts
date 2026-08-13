import type { SourcedRule } from '../../core/evidence';
import { HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE, HCMUS_THPT_COMBINATION_THRESHOLD_30 } from './eligibility';

export const hcmusThresholdEvidence = {
  value: { thptThreshold30: HCMUS_THPT_COMBINATION_THRESHOLD_30, nuclearMinSubject: HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE },
  evidence: [
    {
      sourceId: 'hcmus-threshold-method2-2026',
      location: 'Ngưỡng THPT tổ hợp ≥15,00/30 + điều kiện riêng ngành Kỹ thuật hạt nhân (Toán, Lý ≥7.5)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ thptThreshold30: number; nuclearMinSubject: number }>;
