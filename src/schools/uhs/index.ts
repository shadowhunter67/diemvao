import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UhsPage } from './UhsPage';
import { uhsAdmissionMethods } from './methods';

/** Module UHS — research 2026-08-13. Ngưỡng Y khoa/Dược (≥20/30 hoặc môn ≥8.5/10) đọc được text;
 * bonus chỉ có eligibility checker (không có mức điểm); trọng số Phương thức 2 dạng khoảng nên
 * KHÔNG có scoreConversion/exactCalculator. */
export const uhsModule: SchoolModule = {
  id: 'uhs',
  name: 'Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM',
  shortName: 'UHS',
  year: 2026,
  status: 'researching',
  summary: 'Đã có 5 ngành, ngưỡng Y khoa/Dược (≥20/30) và điều kiện xét điểm cộng 2026 · Trọng số Phương thức 2 công bố dạng khoảng, chưa đủ tính điểm cuối',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(uhsAdmissionMethods),
  },
  Page: UhsPage,
};
