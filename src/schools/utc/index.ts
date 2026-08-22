import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { utcAdmissionMethods } from './methods';

export const utcModule: SchoolModule = {
  id: 'utc',
  name: 'Trường Đại học Giao thông vận tải',
  shortName: 'UTC',
  about: 'Trường đại học công lập tại Hà Nội, có phân hiệu TP. Hồ Chí Minh, đào tạo các lĩnh vực giao thông vận tải, logistics, kỹ thuật, kinh tế, công nghệ và quản lý.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Đã xác minh thông báo ngưỡng đầu vào UTC 2026 chính thức · Nguồn có bảng ngưỡng theo Hà Nội/Phân hiệu TP.HCM và nhánh HSA/TSA/ĐGNL, nhưng module hiện chỉ kiểm tra ngưỡng THPT tối thiểu.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(utcAdmissionMethods),
  },
};
