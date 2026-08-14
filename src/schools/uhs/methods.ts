import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uhsKnowledgeGaps } from './knowledgeGaps';

export const uhsAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'uhs-method2-2026',
    schoolId: 'uhs',
    name: 'Phuong thuc 2 - Tong hop',
    year: 2026,
    applicantTypes: ['Y khoa', 'Y khoa dat hang', 'Duoc hoc', 'Rang - Ham - Mat', 'Dieu duong', 'Y hoc co truyen'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: false,
    },
    knowledgeGaps: uhsKnowledgeGaps,
  },
];
