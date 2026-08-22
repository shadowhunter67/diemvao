import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const hnueKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hnue-program-threshold-table-not-imported',
    label: 'Bảng ngưỡng đầu vào theo từng ngành/chương trình HNUE 2026 chưa được nhập thành dataset runtime.',
    status: 'official-but-unparsed',
    sourceId: 'hnue-quality-threshold-2026',
    scoreAffecting: true,
    knownData: ['Ngưỡng nhiều ngành nằm trong khoảng 18-22/30', 'Một số ngành năng khiếu có điều kiện phụ theo 1 hoặc 2 môn văn hóa'],
    impact: 'Compare chỉ loại chắc chắn hồ sơ dưới 18/30; chưa kết luận đạt cho từng ngành hoặc ngành năng khiếu.',
  },
  {
    id: 'hnue-special-subject-thresholds-not-modeled',
    label: 'Điều kiện phụ cho Giáo dục Mầm non/GD Thể chất/SP Âm nhạc/SP Mỹ thuật/Huấn luyện thể thao chưa model hóa.',
    status: 'official-but-unparsed',
    sourceId: 'hnue-quality-threshold-2026',
    scoreAffecting: true,
  },
  {
    id: 'hnue-spt-conversion-not-imported',
    label: 'Quy đổi điểm PT2/SPT2026 chưa được nhập.',
    status: 'official-but-unparsed',
    sourceId: 'hnue-spt-conversion-2026',
    scoreAffecting: true,
  },
];
