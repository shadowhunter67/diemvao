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

/** Evidence cho công thức ĐHL1/ĐHL2 (mục 2.2.2 PDF chính thức) — 2 nguồn độc lập (PDF + thông báo
 * text) đồng nhất, không chứa α trong công thức ĐHL của thí sinh. Supersedes hạn chế cũ về α1/α2. */
export const usshDhl1Dhl2FormulaEvidence = {
  value: { dt1: { thptWeight: 0.45, dgnlWeight: 0.45, transcriptWeight: 0.1 }, dt2: { thptWeight: 0.9, transcriptWeight: 0.1 } },
  evidence: [
    {
      sourceId: 'ussh-info-pdf-2026',
      location: 'Mục 2.2.2: ĐHL1 = Max[w1THPT+w2ĐGNL+w3HB] (w1=w2=45%,w3=10%); ĐHL2 = Max[w1THPT+w3HB] (w1=90%,w3=10%)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
    {
      sourceId: 'ussh-scoring-clarification-2026',
      location: 'Công thức ĐHL1/ĐHL2 nhắc lại nguyên văn, xác nhận độc lập lần 2',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ dt1: { thptWeight: number; dgnlWeight: number; transcriptWeight: number }; dt2: { thptWeight: number; transcriptWeight: number } }>;

/** Evidence cho bảng ưu tiên chuẩn — bảng gốc quốc gia (thang 30) quy đổi ×100/30 theo đúng quy
 * tắc quy đổi mà chính PDF USSH công bố cho mọi thành phần khác. Mức 'cross-checked' vì bảng số cụ
 * thể trên thang 100 không được USSH tự in lại. */
export const usshPriorityTableEvidence = {
  value: { regionKV1_100: 2.5, category_UT1_100: 20 / 3 },
  evidence: [
    {
      sourceId: 'ussh-info-pdf-2026',
      location: 'Mục 5c: "theo quy chế tuyển sinh hiện hành" + quy tắc quy đổi ×100/30 (mục 3b) áp dụng lại cho bảng ưu tiên quốc gia',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ regionKV1_100: number; category_UT1_100: number }>;

/**
 * Evidence cho công thức giảm điểm ưu tiên (`priorityReduction.ts`, ngưỡng 75, chia 25) — batch
 * provenance-hygiene (2026-08-17) phát hiện file đó chỉ có comment prose trích nguyên văn nguồn,
 * KHÔNG có `SourcedRule`/`RuleEvidence` machine-readable, và KHÔNG được đưa vào `evidence` trả về
 * user ở `evaluate.ts` (khác `iuPriorityReductionEvidence` — cùng dạng công thức, IU đã wire đủ).
 * Nguồn `ussh-scoring-principles-2026` đã có sẵn trong `sources.ts`, trích nguyên văn: "Điểm ưu
 * tiên đối với thí sinh có tổng điểm (bao gồm cả điểm cộng) đạt được từ 75 điểm... = [(100 – Tổng
 * điểm đạt được đã bao gồm điểm cộng)/25] × Mức điểm ưu tiên khu vực, đối tượng".
 */
export const usshPriorityReductionEvidence = {
  value: { threshold: 75, divisor: 25, scale: 100 },
  evidence: [
    {
      sourceId: 'ussh-scoring-principles-2026',
      location:
        'Nguyên tắc tính điểm xét tuyển: "Điểm ưu tiên... đạt được từ 75 điểm... = [(100 – Tổng điểm đạt được đã bao gồm điểm cộng)/25] × Mức điểm ưu tiên khu vực, đối tượng"',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ threshold: number; divisor: number; scale: number }>;
