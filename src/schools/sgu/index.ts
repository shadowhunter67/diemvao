import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { sguAdmissionMethods } from './methods';

export const sguModule: SchoolModule = {
  id: 'sgu',
  name: 'Trường Đại học Sài Gòn',
  shortName: 'SGU',
  about: 'Trường đại học công lập trực thuộc UBND TP. Hồ Chí Minh, đào tạo đa ngành, nổi bật ở nhóm sư phạm, kinh tế, xã hội, công nghệ và nghệ thuật.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Đã xác minh thông báo ngưỡng đầu vào SGU 2026 trên trang tuyển sinh chính thức · Ngưỡng THPT thay đổi theo ngành/chương trình khoảng 16-23/30 · Chưa nhập bảng 47 ngành, phụ lục quy đổi và bảng điểm cộng.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(sguAdmissionMethods),
  },
};
