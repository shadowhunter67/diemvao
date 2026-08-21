import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

export const ftuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ftu-domestic-exam-2026',
    schoolId: 'ftu',
    name: 'Domestic aptitude/thinking exam admission route',
    year: 2026,
    applicantTypes: ['Candidates using HSA/V-ACT/TSA 2026 without an international language certificate combination branch'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
];

