import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { ouKnowledgeGaps } from './knowledgeGaps';

export const ouAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ou-thpt-exam-2026',
    schoolId: 'ou',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: ouKnowledgeGaps,
  },
];
