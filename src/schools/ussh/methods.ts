import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { usshKnowledgeGaps } from './knowledgeGaps';

/** USSH 2026 — chỉ eligibility (3 ngưỡng riêng biệt: THPT, học bạ, ĐGNL, đều đọc được text) —
 * KHÔNG có scoreConversion/exactCalculator vì thiếu hệ số α1/α2 kết hợp thành điểm tổng hợp. */
export const usshAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ussh-integrated-2026',
    schoolId: 'ussh',
    name: 'Xét tuyển kết hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: usshKnowledgeGaps,
  },
];
