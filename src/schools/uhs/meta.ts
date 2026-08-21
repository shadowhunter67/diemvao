import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { uhsAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UhsPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...uhsMeta, Page: UhsPage }`.
 */
export const uhsMeta: Omit<SchoolModule, 'Page'> = {
  id: 'uhs',
  name: 'Trường Đại học Khoa học Sức khỏe - ĐHQG TP.HCM',
  shortName: 'UHS',
  about:
    'Tiền thân là Khoa Y (thành lập 2009), được nâng cấp thành trường đại học thành viên ĐHQG-HCM từ năm 2024, đào tạo khối ngành khoa học sức khỏe.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  summary:
    'Đã có 6 ngành, điều kiện đầu vào, thành phần THPT/ĐGNL/HB thang 100, quy đổi thành phần bị thiếu và điểm cộng; chưa exact vì w1/w2 công bố dạng khoảng.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    partialCalculator: true,
    ...aggregateSchoolCapabilities(uhsAdmissionMethods),
  },
};
