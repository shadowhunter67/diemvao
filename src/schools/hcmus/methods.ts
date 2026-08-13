import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmusKnowledgeGaps } from './knowledgeGaps';

/** HCMUS 2026 — Phương thức 2 (THPT hoặc ĐGNL kết hợp học bạ 3 năm): CHỈ eligibility (ngưỡng
 * THPT tổ hợp ≥15/30, đọc được text) — ĐGNL threshold nằm trong ảnh (unparsed), công thức trọng
 * số chưa công bố nên KHÔNG có scoreConversion/bonus/priority/exactCalculator. */
export const hcmusAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmus-method2-2026',
    schoolId: 'hcmus',
    name: 'Phương thức 2 — THPT/ĐGNL kết hợp học bạ',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: hcmusKnowledgeGaps,
  },
];
