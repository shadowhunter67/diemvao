import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmuteKnowledgeGaps } from './knowledgeGaps';

/** HCMUTE 2026 — Phương thức tuyển sinh kết hợp (mã 500): eligibility (ngưỡng chung 15/30), điểm
 * học lực HLy.1/HLy.2/HLy.3/HLy.max (hệ số tương quan a=b=0,8 verified 2026-08-18, xem
 * `knowledgeGaps.ts`), điểm cộng ĐXTCN (giải cấp tỉnh/khuyến khích QG), điểm ưu tiên + công thức
 * giảm — đều verified từ văn bản chính thức đã ký. VẪN CHƯA có exactCalculator: 3 lý do còn lại —
 * (1) ĐXTT (Bảng 3) chặn HLy.2 cho thí sinh khai học bạ, (2) ngưỡng riêng SP tiếng Anh/SP công
 * nghệ/Luật chưa wire theo ngành, (3) ĐXTCN mục 1/4-7 chưa implement — xem `knowledgeGaps.ts`. */
export const hcmuteAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmute-combined-2026',
    schoolId: 'hcmute',
    name: 'Phương thức tuyển sinh kết hợp',
    year: 2026,
    applicantTypes: ['Thí sinh xét theo điểm thi TN THPT 2026 độc lập (chưa dùng học bạ/ĐGNL)'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: false,
    },
    knowledgeGaps: hcmuteKnowledgeGaps,
  },
];
