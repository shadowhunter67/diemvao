import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { vinhuniKnowledgeGaps } from './knowledgeGaps';

export const vinhuniAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'vinhuni-thpt-exam-2026',
    schoolId: 'vinhuni',
    name: 'Xét tuyển theo kết quả thi tốt nghiệp THPT năm 2026 (Phương thức 100)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vinhuniKnowledgeGaps,
  },
];
