import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * HCMUS re-audit 2026-08-14: the official 39-row Phuong thuc 2 threshold
 * infographic is now parsed in `data/programThresholds.ts`. Remaining gaps are
 * score-affecting final-score blockers, so HCMUS stays partial, not exact.
 */
export const hcmusKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmus-bonus-table',
    label: 'Bảng "Điểm cộng" (thành phần thứ 2 trong công thức Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên) chưa có evidence đủ để tính chính xác.',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
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
