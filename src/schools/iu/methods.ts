import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { iuKnowledgeGaps } from './knowledgeGaps';

/** IU 2026 — Phương thức 2: Điểm học lực (k1/k2/k3 + công thức quy đổi) FULLY verified nên
 * scoreConversion=true, bonus=true (một phần — 2/nhiều tiêu chí điểm xét thưởng), priority=false
 * (bảng mức điểm chưa đọc được), exactCalculator=false (thiếu điểm thưởng/khuyến khích/ưu tiên
 * đầy đủ để ra đúng "Điểm xét tuyển" chính thức — chỉ ra được ngưỡng dưới). */
export const iuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'iu-method2-2026',
    schoolId: 'iu',
    name: 'Phương thức 2 — Xét tuyển tổng hợp',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: iuKnowledgeGaps,
  },
];
