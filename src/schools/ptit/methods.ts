import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { ptitKnowledgeGaps } from './knowledgeGaps';

export const ptitAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ptit-domestic-exam-2026',
    schoolId: 'ptit',
    name: 'Domestic aptitude/thinking exam admission route',
    year: 2026,
    applicantTypes: ['Candidates with TSA/HSA/V-ACT/SPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: ptitKnowledgeGaps,
  },
];

