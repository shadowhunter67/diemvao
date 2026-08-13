import type { SourcedRule } from '../../core/evidence';
import { USSH_DGNL_THRESHOLD_1200, USSH_THPT_COMBINATION_THRESHOLD_30, USSH_TRANSCRIPT_COMBINATION_THRESHOLD_30 } from './eligibility';

export const usshThresholdEvidence = {
  value: {
    thptThreshold30: USSH_THPT_COMBINATION_THRESHOLD_30,
    transcriptThreshold30: USSH_TRANSCRIPT_COMBINATION_THRESHOLD_30,
    dgnlThreshold1200: USSH_DGNL_THRESHOLD_1200,
  },
  evidence: [
    {
      sourceId: 'ussh-threshold-2026',
      location: 'Ngưỡng THPT/Học bạ ≥17, ĐGNL ≥620 — áp dụng mọi ngành/tổ hợp',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ thptThreshold30: number; transcriptThreshold30: number; dgnlThreshold1200: number }>;
