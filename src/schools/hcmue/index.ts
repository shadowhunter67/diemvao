import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmueAdmissionMethods } from './methods';
import { HcmuePage } from './HcmuePage';

export const hcmueModule: SchoolModule = {
  id: 'hcmue',
  name: 'Trường Đại học Sư phạm Thành phố Hồ Chí Minh (HCMUE, TPHCM)',
  shortName: 'HCMUE',
  about:
    'Đại học công lập thành lập năm 1976, một trong hai trường sư phạm trọng điểm của cả nước, đào tạo giáo viên và khoa học giáo dục.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Đã xác minh phương thức và ngưỡng đầu vào 47 ngành tại trụ sở chính TP.HCM năm 2026, cộng điểm trúng tuyển tham khảo cho 47 ngành trụ sở chính + 15 ngành 2 phân hiệu Long An/Gia Lai. Runtime chỉ kiểm tra eligibility/ngưỡng, không tính điểm trúng tuyển.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmueAdmissionMethods),
  },
  Page: HcmuePage,
};
