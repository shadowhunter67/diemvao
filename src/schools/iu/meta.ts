import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { iuAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `IuPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách meta/Page
 * phục vụ code splitting). `index.ts` compose `{ ...iuMeta, Page: IuPage }`.
 *
 * research 2026-08-13/14 (đọc qua trình duyệt thật, trang chủ + trang thông tin tuyển sinh render
 * bằng JS/accordion nên fetch tĩnh trả rỗng). Điểm học lực + Điểm cộng (3 thành phần) + Điểm ưu
 * tiên (bảng KV/UT + công thức giảm) đều verified đầy đủ cho đối tượng "Thí sinh tốt nghiệp THPT
 * 2026" — exact calculator thật, có cutoffs 2026 (38 chương trình) để so sánh trực tiếp.
 */
export const iuMeta: Omit<SchoolModule, 'Page'> = {
  id: 'iu',
  name: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
  shortName: 'IU',
  about: 'Thành lập năm 2003, trường đại học công lập thành viên ĐHQG-HCM, giảng dạy hoàn toàn bằng tiếng Anh.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  summary: 'Điểm xét tuyển đầy đủ 2026 (Điểm học lực + Điểm cộng + Điểm ưu tiên) cho thí sinh tốt nghiệp THPT 2026 · So sánh trực tiếp với điểm trúng tuyển 38 ngành',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(iuAdmissionMethods),
    partialCalculator: true,
  },
};
