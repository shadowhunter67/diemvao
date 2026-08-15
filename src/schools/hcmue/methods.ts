import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmueKnowledgeGaps } from './knowledgeGaps';

export const hcmueAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmue-thpt-threshold-2026',
    schoolId: 'hcmue',
    name: 'Kiem tra nguong dau vao THPT 2026',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: hcmueKnowledgeGaps,
  },
];
