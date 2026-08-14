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

/** Evidence cho công thức ĐT3 (0.9×ĐGNL+0.1×Học bạ, thang 100) — thành phần DUY NHẤT trong 3 đối
 * tượng tính được chính xác (không chứa α1/α2, xem `calculator.ts`). */
export const usshDt3FormulaEvidence = {
  value: { dgnlWeight: 0.9, transcriptWeight: 0.1 },
  evidence: [
    {
      sourceId: 'ussh-scoring-principles-2026',
      location: 'ĐT3 = 0.90×[(ĐGNL)×100/1200] + 0.10×[(HB)×100/30] — không chứa α1/α2',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ dgnlWeight: number; transcriptWeight: number }>;
