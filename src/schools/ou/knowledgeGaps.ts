import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const ouKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ou-program-threshold-table-not-imported',
    label: 'Bảng điểm sàn theo từng mã xét tuyển OU 2026 đã có trên trang chính thức nhưng chưa nhập thành dataset runtime.',
    status: 'official-but-unparsed',
    sourceId: 'ou-quality-threshold-2026',
    scoreAffecting: true,
    missingData: ['Ngưỡng từng mã xét tuyển', 'stable programId', 'nhóm pháp luật và các chương trình đặc thù'],
    impact: 'Compare chỉ loại chắc chắn hồ sơ dưới ngưỡng tối thiểu 15/30; chưa kết luận đạt cho từng ngành.',
  },
  {
    id: 'ou-conversion-table-not-imported',
    label: 'Bảng quy đổi V-SAT/ĐGNL/Học bạ/SAT 2026 của OU chưa được nhập vào calculator.',
    status: 'official-but-unparsed',
    sourceId: 'ou-equivalent-conversion-2026',
    scoreAffecting: true,
    impact: 'Chưa bật scoreConversion/exactCalculator cho các phương thức ngoài thi TN THPT.',
  },
  {
    id: 'ou-bonus-priority-rules-not-modeled',
    label: 'Điểm cộng/ưu tiên và quy tắc giảm ưu tiên OU 2026 chưa được model hóa.',
    status: 'incomplete',
    scoreAffecting: true,
  },
];
