import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmueAdmissionMethods } from './methods';
import { HcmuePage } from './HcmuePage';

export const hcmueModule: SchoolModule = {
  id: 'hcmue',
  name: 'Truong Dai hoc Su pham Thanh pho Ho Chi Minh (HCMUE, TPHCM)',
  shortName: 'HCMUE',
  year: 2026,
  status: 'researching',
  summary:
    'Da xac minh phuong thuc va nguong dau vao 47 nganh tai tru so chinh TP.HCM nam 2026. Runtime chi kiem tra eligibility/nguong, khong tinh diem trung tuyen.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmueAdmissionMethods),
  },
  Page: HcmuePage,
};
