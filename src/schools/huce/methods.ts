import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { huceKnowledgeGaps } from './knowledgeGaps';

export const huceAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'huce-thpt-exam-2026',
    schoolId: 'huce',
    name: 'THPT exam threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using 2026 high-school graduation exam scores'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: huceKnowledgeGaps,
  },
  {
    id: 'huce-transcript-2026',
    schoolId: 'huce',
    name: 'Academic transcript threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using high-school academic records'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: huceKnowledgeGaps,
  },
  {
    id: 'huce-tsa-2026',
    schoolId: 'huce',
    name: 'TSA threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using HUST thinking assessment scores'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: huceKnowledgeGaps,
  },
  {
    id: 'huce-spt-2026',
    schoolId: 'huce',
    name: 'SPT threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using pedagogical assessment scores'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: huceKnowledgeGaps,
  },
  {
    id: 'huce-vsat-2026',
    schoolId: 'huce',
    name: 'V-SAT threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using V-SAT scores'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: huceKnowledgeGaps,
  },
];
