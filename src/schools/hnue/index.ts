import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hnueAdmissionMethods } from './methods';

export const hnueModule: SchoolModule = {
  id: 'hnue',
  name: 'Trường Đại học Sư phạm Hà Nội',
  shortName: 'HNUE',
  about: 'Trường đại học sư phạm công lập trọng điểm quốc gia tại Hà Nội, đào tạo giáo viên, khoa học giáo dục và nhiều ngành khoa học cơ bản, xã hội, nhân văn.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Đã xác minh ngưỡng đầu vào HNUE 2026 từ trang tuyển sinh chính thức · Bảng ngành dài và một số ngành năng khiếu có điều kiện phụ nên hiện chỉ kiểm tra được ngưỡng THPT tối thiểu.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hnueAdmissionMethods),
  },
};
