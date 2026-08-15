import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { IuPage } from './IuPage';
import { iuAdmissionMethods } from './methods';

/** Module IU — research 2026-08-13/14 (đọc qua trình duyệt thật, trang chủ + trang thông tin
 * tuyển sinh render bằng JS/accordion nên fetch tĩnh trả rỗng). Điểm học lực + Điểm cộng (3
 * thành phần) + Điểm ưu tiên (bảng KV/UT + công thức giảm) đều verified đầy đủ cho đối tượng
 * "Thí sinh tốt nghiệp THPT 2026" — exact calculator thật, có cutoffs 2026 (38 chương trình) để
 * so sánh trực tiếp. */
export const iuModule: SchoolModule = {
  id: 'iu',
  name: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
  shortName: 'IU',
  year: 2026,
  status: 'supported',
  summary: 'Điểm xét tuyển đầy đủ 2026 (Điểm học lực + Điểm cộng + Điểm ưu tiên) cho thí sinh tốt nghiệp THPT 2026 · So sánh trực tiếp với điểm trúng tuyển 38 ngành',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(iuAdmissionMethods),
    partialCalculator: true,
  },
  Page: IuPage,
};
