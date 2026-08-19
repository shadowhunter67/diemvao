import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmueAdmissionMethods } from './methods';
import { HcmuePage } from './HcmuePage';

export const hcmueModule: SchoolModule = {
  id: 'hcmue',
  name: 'Trường Đại học Sư phạm Thành phố Hồ Chí Minh (HCMUE, TPHCM)',
  shortName: 'HCMUE',
  year: 2026,
  status: 'researching',
  summary:
    'Đã xác minh phương thức và ngưỡng đầu vào 47 ngành tại trụ sở chính TP.HCM năm 2026. Runtime chỉ kiểm tra eligibility/ngưỡng, không tính điểm trúng tuyển.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmueAdmissionMethods),
  },
  Page: HcmuePage,
};
