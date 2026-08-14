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

/**
 * Evidence cho Điểm học lực (route1 THPT / route2 ĐGNL, MAX) + bảng quy đổi phân vị ĐGNL↔THPT —
 * nguồn ảnh infographic official user cung cấp 2026-08-13 (xem `sources.ts`
 * `hcmus-academic-score-formula-2026`/`hcmus-vact-conversion-table-2026`). KHÔNG phải evidence cho
 * điểm xét tuyển cuối cùng (còn thiếu Điểm cộng/Điểm ưu tiên — xem `knowledgeGaps.ts`).
 */
export const hcmusAcademicScoreEvidence = {
  value: { thptWeight: 0.8, transcriptWeight: 0.2 },
  evidence: [
    {
      sourceId: 'hcmus-academic-score-formula-2026',
      location: 'ĐIỂM XÉT TUYỂN = ĐIỂM HỌC LỰC + ĐIỂM CỘNG + ĐIỂM ƯU TIÊN; ĐIỂM HỌC LỰC = MAX(0.8×THPT+0.2×Học bạ, 0.8×ĐGNL+0.2×Học bạ)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
    {
      sourceId: 'hcmus-vact-conversion-table-2026',
      location: 'Khung quy đổi tương đương điểm thi ĐGNL với điểm thi tốt nghiệp THPT năm 2026 — 101 dòng phân vị',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ thptWeight: number; transcriptWeight: number }>;
