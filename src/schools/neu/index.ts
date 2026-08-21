import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { neuAdmissionMethods } from './methods';

export const neuModule: SchoolModule = {
  id: 'neu',
  name: 'Trường Đại học Kinh tế Quốc dân',
  shortName: 'NEU',
  about: 'Đại học công lập trọng điểm tại Hà Nội, đào tạo kinh tế, kinh doanh, quản lý, tài chính, luật và các ngành hướng dữ liệu.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Thông báo chính thức số 1613/TB-ĐHKTQD (2026) công bố ngưỡng 22/30 và bảng quy đổi tương đương điểm trúng tuyển giữa các phương thức THPT/HSA/SAT/V-ACT/TSA theo từng khoảng điểm. UniscoreVN mới báo khoảng điểm chính thức; quy đổi chi tiết trong từng khoảng và điểm chuẩn chưa được model hoá.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(neuAdmissionMethods),
  },
};

