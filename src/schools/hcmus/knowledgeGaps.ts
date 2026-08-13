import type { KnowledgeGap } from '../../core/knowledgeStatus';

/** Chặn eligibility/exactCalculator đầy đủ cho HCMUS — 2 gap, cả 2 official-but-unparsed (ảnh/
 * bảng, không phải PDF quét chữ, đọc được nhưng không phải dạng text) hoặc thiếu công thức trọng
 * số công khai. */
export const hcmusKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmus-dgnl-threshold-image',
    label: 'Ngưỡng điểm ĐGNL 2026 công bố dưới dạng ảnh/bảng ("Mức điểm THPT 2026 và ĐGNL 2026"), chưa đọc được dạng text',
    status: 'official-but-unparsed',
  },
  {
    id: 'hcmus-semiconductor-percentile',
    label:
      'Điều kiện ngành Thiết kế vi mạch (Toán top 20% quốc gia, tổng điểm top 25% quốc gia) cần bảng bách phân vị quốc gia UniscoreVN không có nguồn để tra',
    status: 'incomplete',
  },
  {
    id: 'hcmus-method2-weights',
    label: 'Công thức/trọng số kết hợp điểm thi và học bạ cho điểm xét tuyển cuối chưa được công bố dạng text',
    status: 'incomplete',
  },
];
