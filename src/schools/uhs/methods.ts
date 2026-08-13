import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uhsKnowledgeGaps } from './knowledgeGaps';

/** UHS 2026 — Phương thức 2 (Tổng hợp): eligibility=true CHỈ cho Y khoa/Dược (số cụ thể); bonus
 * chỉ có eligibility checker (không có mức điểm) nên vẫn tính `bonus: true` ở nghĩa "hỗ trợ kiểm
 * tra điều kiện bonus", KHÔNG có scoreConversion/priority/exactCalculator (trọng số dạng khoảng). */
export const uhsAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'uhs-method2-2026',
    schoolId: 'uhs',
    name: 'Phương thức 2 — Tổng hợp',
    year: 2026,
    applicantTypes: ['Y khoa', 'Dược học'],
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: true,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: uhsKnowledgeGaps,
  },
];
