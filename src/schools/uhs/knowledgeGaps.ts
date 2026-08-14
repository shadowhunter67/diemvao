import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const uhsKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uhs-method2-weights-range',
    label:
      'Trọng số Phương thức 2 công bố dạng khoảng (THPT 30-35%, ĐGNL 45-50%, học bạ 20%), chưa có giá trị w1/w2 cố định để tính điểm xét tuyển cuối.',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'uhs-cutoffs-2026',
    label: 'Điểm chuẩn 2026 chưa được UniscoreVN nhập vào mô hình lịch sử; không dùng dữ liệu 2024/2025 như cutoff 2026.',
    status: 'incomplete',
  },
];
