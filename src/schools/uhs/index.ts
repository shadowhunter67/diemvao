import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UhsPage } from './UhsPage';
import { uhsAdmissionMethods } from './methods';

export const uhsModule: SchoolModule = {
  id: 'uhs',
  name: 'Trường Đại học Khoa học Sức khỏe - ĐHQG TP.HCM',
  shortName: 'UHS',
  year: 2026,
  status: 'researching',
  summary:
    'Đã có 6 ngành, điều kiện đầu vào, thành phần THPT/ĐGNL/HB thang 100, quy đổi thành phần bị thiếu và điểm cộng; chưa exact vì w1/w2 công bố dạng khoảng.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    partialCalculator: true,
    ...aggregateSchoolCapabilities(uhsAdmissionMethods),
  },
  Page: UhsPage,
};
