import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * HCMUS re-audit 2026-08-14: the official 39-row Phuong thuc 2 threshold
 * infographic is now parsed in `data/programThresholds.ts`. Remaining gaps are
 * score-affecting final-score blockers, so HCMUS stays partial, not exact.
 *
 * Re-audit 2026-08-15: `hcmus-bonus-table` gap RESOLVED — official bonus table image found on
 * tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/ (section "2. Điểm cộng"), fully parsed into
 * `data/bonus.ts` + `bonus.ts` (see `evidence.ts` `hcmusBonusEvidence`). Priority table remains
 * the sole score-affecting blocker.
 */
export const hcmusKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmus-priority-formula',
    label: 'Công thức/bảng "Điểm ưu tiên" khu vực/đối tượng cho Phương thức 2 chưa có evidence đủ để tính chính xác.',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hcmus-semiconductor-percentile',
    label:
      'Điều kiện ngành Thiết kế vi mạch/Công nghệ bán dẫn cần ngưỡng Toán top 20% và tổ hợp top 25% toàn quốc theo dữ liệu Bộ GD&ĐT; UniscoreVN chưa có bảng bách phân vị quốc gia để tra.',
    status: 'incomplete',
  },
];
