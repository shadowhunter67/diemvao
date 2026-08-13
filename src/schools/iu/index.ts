import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { IuPage } from './IuPage';
import { iuAdmissionMethods } from './methods';

/** Module IU — research 2026-08-13 (đọc qua trình duyệt thật, trang chủ render bằng JS nên fetch
 * tĩnh trả rỗng). Điểm học lực (k1/k2/k3 verified đầy đủ) → partial calculator thật, không chỉ
 * quy đổi đơn lẻ — `partialCalculator: true`. */
export const iuModule: SchoolModule = {
  id: 'iu',
  name: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
  shortName: 'IU',
  year: 2026,
  status: 'researching',
  summary: 'Đã có công thức Điểm học lực đầy đủ (40%×THPT+50%×ĐGNL+10%×Học bạ) 2026 · Điểm thưởng/khuyến khích/ưu tiên còn trong PDF chưa đọc được — chỉ tính được ngưỡng dưới',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(iuAdmissionMethods),
    partialCalculator: true,
  },
  Page: IuPage,
};
