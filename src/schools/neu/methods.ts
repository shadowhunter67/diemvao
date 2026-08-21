import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { neuKnowledgeGaps } from './knowledgeGaps';

export const neuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'neu-equivalence-2026',
    schoolId: 'neu',
    name: 'Admission threshold and equivalent-score band checker',
    year: 2026,
    applicantTypes: ['Candidates comparing THPT/HSA/SAT/V-ACT/TSA against NEU 2026 equivalence bands'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: neuKnowledgeGaps,
  },
];

