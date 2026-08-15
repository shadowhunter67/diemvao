import type { SourcedRule } from '../../core/evidence';
import { HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE, HCMUS_THPT_COMBINATION_THRESHOLD_30 } from './eligibility';
import { HCMUS_BONUS_CATEGORIES_2026, HCMUS_BONUS_REDUCTION_THRESHOLD_30, HCMUS_MAX_SCORE_30 } from './data/bonus';

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

export const hcmusProgramThresholdEvidence = {
  value: { programCount: 39 },
  evidence: [
    {
      sourceId: 'hcmus-threshold-method2-2026',
      location:
        'Mục 3 - infographic "NGƯỠNG ĐẢM BẢO CHẤT LƯỢNG PHƯƠNG THỨC XÉT TUYỂN TỔNG HỢP NĂM 2026 (PHƯƠNG THỨC 2)", 39 dòng ngành/nhóm ngành.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ programCount: number }>;

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

/**
 * Evidence cho bảng "Điểm cộng" Phương thức 2 (2026) — re-audit 2026-08-15, ảnh chính thức mở qua
 * chrome-devtools trực tiếp từ trang tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/. Đóng gap
 * `hcmus-bonus-table` (xem `knowledgeGaps.ts`). Điểm ưu tiên khu vực/đối tượng VẪN là gap riêng.
 */
export const hcmusBonusEvidence = {
  value: {
    categoryCount: HCMUS_BONUS_CATEGORIES_2026.length,
    reductionThreshold30: HCMUS_BONUS_REDUCTION_THRESHOLD_30,
    maxScore30: HCMUS_MAX_SCORE_30,
  },
  evidence: [
    {
      sourceId: 'hcmus-bonus-table-2026',
      location:
        'Ảnh "BẢNG ĐIỂM CỘNG PHƯƠNG THỨC 2..." + mục "2. Điểm cộng" trang tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/ — 15 dòng thang điểm cơ sở, chỉ cộng 01 loại cao nhất, công thức giảm khi tổng điểm ≥28,5/30, điểm xét không vượt 30/30.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ categoryCount: number; reductionThreshold30: number; maxScore30: number }>;
