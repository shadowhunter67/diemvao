import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hutechAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `HutechPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...hutechMeta, Page: HutechPage }`.
 *
 * research 2026-08-18. 2/4 phương thức tính điểm (xét THPT/xét ĐGNL) `exactCalculator: true` trong
 * phạm vi thí sinh KHÔNG có thành tích cộng điểm. Phương thức học bạ dừng ở `unavailable`, V-SAT ở
 * eligibility-only.
 */
export const hutechMeta: Omit<SchoolModule, 'Page'> = {
  id: 'hutech',
  name: 'Trường Đại học Công nghệ TP. Hồ Chí Minh',
  shortName: 'HUTECH',
  about:
    'Trường đại học tư thục thành lập năm 1995, đào tạo đa ngành: kỹ thuật - công nghệ, công nghệ thông tin, kinh tế, kiến trúc và ngoại ngữ.',
  year: 2026,
  status: 'supported',
  ownership: 'private',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển xét THPT (thang 30) và xét ĐGNL ĐHQG-HCM (thang 1200) tính CHÍNH XÁC — công thức là tổng thô 3 môn (THPT) / điểm ĐGNL trực tiếp, ngưỡng đầu vào 4 nhóm ngành (Y khoa/Dược+Luật/Điều dưỡng+KTXNYH/còn lại) verified từ Thông báo 04/7/2026 · Xét học bạ chưa tính được (cần dữ liệu theo 6 học kỳ, hồ sơ dùng chung chỉ lưu TB năm) · Xét V-SAT chỉ kiểm tra được ngưỡng đầu vào (thang điểm/công thức quy đổi chưa rõ) · Bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn partial; danh mục 63 ngành/tổ hợp chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hutechAdmissionMethods),
  },
};
