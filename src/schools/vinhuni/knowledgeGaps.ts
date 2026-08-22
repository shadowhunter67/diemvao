import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const vinhuniKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'vinhuni-per-program-threshold-table-not-imported',
    label: 'Bảng điểm sàn theo từng ngành/chương trình Trường Đại học Vinh 2026 chưa được nhập.',
    status: 'official-but-unparsed',
    sourceId: 'vinhuni-quality-threshold-conversion-2026',
    scoreAffecting: true,
    impact: 'Compare chỉ kiểm tra ngưỡng tối thiểu phổ thông 15/30; chưa kết luận cho từng ngành/chương trình.',
  },
  {
    id: 'vinhuni-transcript-and-conversion-rules-not-modeled',
    label: 'Ngưỡng học bạ, quy đổi tương đương và các tiêu chí riêng nhóm ngôn ngữ/sức khỏe/pháp luật chưa model hóa đầy đủ.',
    status: 'official-but-unparsed',
    sourceId: 'vinhuni-admission-adjustment-2026',
    scoreAffecting: true,
  },
  {
    id: 'vinhuni-aptitude-method-not-modeled',
    label: 'Phương thức kết hợp thi năng khiếu cho Giáo dục Thể chất, Giáo dục Mầm non, Kiến trúc chưa được đưa vào evaluator.',
    status: 'official-but-unparsed',
    sourceId: 'vinhuni-quality-threshold-conversion-2026',
    scoreAffecting: true,
  },
];
