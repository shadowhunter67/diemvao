import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ouAdmissionMethods } from './methods';

export const ouModule: SchoolModule = {
  id: 'ou',
  name: 'Trường Đại học Mở Thành phố Hồ Chí Minh',
  shortName: 'OU',
  about: 'Trường đại học công lập tại TP. Hồ Chí Minh, đào tạo đa ngành theo định hướng mở, linh hoạt và ứng dụng.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Đã xác minh thông báo ngưỡng đầu vào OU 2026 và thông báo quy đổi tương đương chính thức ngày 10/7/2026 · Compare hiện chỉ kiểm tra ngưỡng THPT tối thiểu, chưa nhập bảng điểm sàn từng mã xét tuyển và bảng quy đổi lớn.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ouAdmissionMethods),
  },
};
