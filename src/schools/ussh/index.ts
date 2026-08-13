import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UsshPage } from './UsshPage';
import { usshAdmissionMethods } from './methods';

/** Module USSH — research 2026-08-13. 3 ngưỡng riêng biệt (THPT/học bạ/ĐGNL) đọc được text nên
 * eligibility=true — hệ số α1/α2 kết hợp chưa công bố nên không có scoreConversion/exactCalculator. */
export const usshModule: SchoolModule = {
  id: 'ussh',
  name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
  shortName: 'USSH',
  year: 2026,
  status: 'researching',
  summary: 'Đã có ngưỡng THPT/Học bạ ≥17 và ĐGNL ≥620 năm 2026 · Hệ số kết hợp α1/α2 chưa công bố giá trị cụ thể',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(usshAdmissionMethods),
  },
  Page: UsshPage,
};
