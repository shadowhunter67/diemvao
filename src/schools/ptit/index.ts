import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ptitAdmissionMethods } from './methods';

export const ptitModule: SchoolModule = {
  id: 'ptit',
  name: 'Học viện Công nghệ Bưu chính Viễn thông',
  shortName: 'PTIT',
  about: 'Học viện công lập đào tạo viễn thông, công nghệ thông tin, kinh tế số, truyền thông và quản trị.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Phương thức xét tuyển bằng kết quả ĐGNL/ĐGTD trong nước có ngưỡng đầu vào chính thức (V-ACT ≥600, HSA ≥75, TSA ≥50, SPT ≥15) và biết dạng công thức thô. Điểm xét tuyển chính xác cuối cùng còn bị chặn bởi quy đổi tương đương giữa phương thức và ngữ cảnh ngành/tổ hợp.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ptitAdmissionMethods),
  },
};

