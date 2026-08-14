import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmusKnowledgeGaps } from './knowledgeGaps';

/**
 * HCMUS 2026 - Phuong thuc 2 (THPT or V-ACT plus 3-year transcript).
 * Academic score and the 39-program minimum composite thresholds are verified.
 * Final exact calculation remains unavailable until bonus and priority rules are
 * fully evidenced.
 */
export const hcmusAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmus-method2-2026',
    schoolId: 'hcmus',
    name: 'Phương thức 2 - THPT/ĐGNL kết hợp học bạ',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: hcmusKnowledgeGaps,
  },
];
