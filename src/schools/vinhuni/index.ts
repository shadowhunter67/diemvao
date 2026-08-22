import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { vinhuniAdmissionMethods } from './methods';

export const vinhuniModule: SchoolModule = {
  id: 'vinhuni',
  name: 'Trường Đại học Vinh',
  shortName: 'VinhUni',
  about: 'Trường đại học công lập đa ngành tại Nghệ An, đào tạo giáo viên, kinh tế, kỹ thuật, nông nghiệp, sức khỏe, luật và nhiều lĩnh vực ứng dụng.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'other',
  vnuhcm: false,
  summary:
    'Đã xác minh thông báo ngưỡng đầu vào và quy tắc quy đổi tương đương 2026 của Trường Đại học Vinh · Hiện chỉ kiểm tra ngưỡng THPT tối thiểu 15/30; bảng ngành, học bạ, quy đổi và năng khiếu cần nhập tiếp.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(vinhuniAdmissionMethods),
  },
};
