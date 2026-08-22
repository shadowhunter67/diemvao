import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { davKnowledgeGaps } from './knowledgeGaps';

export type DavMethodId = 'dav-priority-2026' | 'dav-transcript-certificate-2026' | 'dav-sat-act-certificate-2026' | 'dav-thpt-exam-2026';

export const davAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'dav-priority-2026',
    schoolId: 'dav',
    name: 'Direct and priority admission',
    year: 2026,
    applicantTypes: ['Candidates under MOET direct/priority admission categories'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: davKnowledgeGaps,
  },
  {
    id: 'dav-transcript-certificate-2026',
    schoolId: 'dav',
    name: 'Transcript plus international language certificate threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using academic record and international language certificate'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: davKnowledgeGaps,
  },
  {
    id: 'dav-sat-act-certificate-2026',
    schoolId: 'dav',
    name: 'SAT/ACT plus international language certificate threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using SAT/ACT and international language certificate'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: davKnowledgeGaps,
  },
  {
    id: 'dav-thpt-exam-2026',
    schoolId: 'dav',
    name: 'THPT exam threshold eligibility',
    year: 2026,
    applicantTypes: ['Candidates using 2026 high-school graduation exam scores'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: davKnowledgeGaps,
  },
];
