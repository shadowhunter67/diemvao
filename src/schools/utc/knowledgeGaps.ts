import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const utcKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'utc-program-threshold-table-not-imported',
    label: 'Bảng ngưỡng UTC 2026 theo từng mã xét tuyển ở Hà Nội và Phân hiệu TP.HCM chưa được nhập đầy đủ.',
    status: 'official-but-unparsed',
    sourceId: 'utc-quality-threshold-2026',
    scoreAffecting: true,
    knownData: ['Hà Nội: nhiều ngành 18/30, Logistics 21/30', 'Phân hiệu TP.HCM: nhiều ngành 17/30, một số ngành 18-20/30'],
    impact: 'Compare chỉ loại chắc chắn hồ sơ dưới 17/30; chưa kết luận đạt cho ngành/cơ sở cụ thể.',
  },
  {
    id: 'utc-weighted-math-context-not-modeled',
    label: 'Công thức UTC có nhánh Toán x2 và nhánh riêng ngành Ngôn ngữ Anh, nhưng context ngành/tổ hợp chưa được model hóa.',
    status: 'official-but-unparsed',
    sourceId: 'utc-quality-threshold-2026',
    scoreAffecting: true,
  },
  {
    id: 'utc-hsa-tsa-vact-conversion-not-imported',
    label: 'Quy đổi HSA/TSA/ĐGNL ĐHQG-HCM về thang THPT 2026 chưa được nhập.',
    status: 'official-but-unparsed',
    sourceId: 'utc-quality-threshold-2026',
    scoreAffecting: true,
  },
];
