import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const uhsKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uhs-method2-weights-range',
    label: 'Trọng số Phương thức 2 công bố dạng khoảng (THPT 30-35%, ĐGNL 45-50%, học bạ 20%), không phải số cố định — không đủ tính điểm chính xác',
    status: 'incomplete',
  },
  {
    id: 'uhs-threshold-other-programs',
    label: 'Ngưỡng đảm bảo chất lượng cho Răng Hàm Mặt/Y học cổ truyền/Điều dưỡng chưa có số cụ thể trong nguồn đã đọc (chỉ Y khoa/Dược có số)',
    status: 'incomplete',
  },
  {
    id: 'uhs-bonus-point-values',
    label: 'Bảng điểm cộng CHỈ nêu tiêu chí đủ điều kiện được xét, không công bố số điểm cụ thể cho từng tiêu chí',
    status: 'incomplete',
  },
  {
    id: 'uhs-cutoffs-2026',
    label: 'Điểm chuẩn 2026 chưa được UniscoreVN đọc/nhập (nguồn ĐHQG-HCM catalog cần xử lý riêng)',
    status: 'incomplete',
  },
];
