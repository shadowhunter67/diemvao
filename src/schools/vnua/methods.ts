import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { vnuaKnowledgeGaps } from './knowledgeGaps';

export const vnuaAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'vnua-thpt-exam-2026',
    schoolId: 'vnua',
    name: 'THPT exam admission baseline',
    year: 2026,
    applicantTypes: ['Candidates using 2026 high-school graduation exam scores'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vnuaKnowledgeGaps,
  },
];

