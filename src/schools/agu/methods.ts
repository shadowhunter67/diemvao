import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { aguKnowledgeGaps } from './knowledgeGaps';

/** AGU 2026 — Phương thức Xét tuyển Tổng hợp: có eligibility (ngưỡng THPT/ĐGNL theo 43 ngành +
 * điều kiện riêng ngành Luật) và hệ số β1/β2/β3 chính thức, nhưng CHƯA có scoreConversion (thiếu
 * công thức quy đổi từng thành phần về thang 100) / bonus / priority / exactCalculator — xem
 * `knowledgeGaps.ts`. */
export const aguAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'agu-comprehensive-2026',
    schoolId: 'agu',
    name: 'Xét tuyển Tổng hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: aguKnowledgeGaps,
  },
];
