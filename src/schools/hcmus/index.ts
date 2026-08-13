import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { HcmusPage } from './HcmusPage';
import { hcmusAdmissionMethods } from './methods';

/**
 * Module HCMUS — research 2026-08-13 (xem docs/CHANGELOG.md). Ngưỡng THPT tổ hợp (≥15/30) đọc
 * được text nên eligibility=true; ĐGNL threshold + trọng số Phương thức 2 nằm trong ảnh/chưa công
 * bố nên KHÔNG có scoreConversion/exactCalculator — Level 2 (eligibility checker), không phải chỉ
 * trang thông tin.
 */
export const hcmusModule: SchoolModule = {
  id: 'hcmus',
  name: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
  shortName: 'HCMUS',
  year: 2026,
  status: 'researching',
  summary: 'Đã có ngưỡng THPT tổ hợp (≥15/30) và điều kiện ngành Kỹ thuật hạt nhân 2026 · Ngưỡng ĐGNL và trọng số Phương thức 2 chưa đọc được dạng text',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmusAdmissionMethods),
  },
  Page: HcmusPage,
};
