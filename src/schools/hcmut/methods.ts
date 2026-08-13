import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { SUPPORTED_APPLICANT_TYPES } from './types/applicantType';

/**
 * HCMUT 2026 hiện chỉ có 1 phương thức triển khai trong Uniscore: Xét tuyển Tổng hợp — nhưng
 * capability thật khác nhau theo applicantType (chỉ 'dgnl'/'no-dgnl' có exact calculator, 3
 * nhóm còn lại chưa). Descriptor này mô tả method ở mức capability CAO NHẤT có thể đạt được
 * (khi applicantType thuộc SUPPORTED_APPLICANT_TYPES) — không thay thế logic gating theo
 * applicantType đã có ở `App.tsx`/`HcmutCalculatorPage.tsx`, chỉ phục vụ mô tả/audit capability
 * ở mức method, khớp với `hcmutModule.capabilities` (xem test `methods.test.ts`).
 */
export const hcmutAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmut-comprehensive-2026',
    name: 'Xét tuyển Tổng hợp',
    year: 2026,
    applicantTypes: [...SUPPORTED_APPLICANT_TYPES],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    },
  },
];
