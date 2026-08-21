import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { iuhAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `IuhPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách meta/Page
 * phục vụ code splitting). `index.ts` compose `{ ...iuhMeta, Page: IuhPage }`.
 *
 * research 2026-08-19/20, batch 2026-08-20 đóng gap ĐTK. Phương thức "xét tuyển kết hợp"
 * `exactCalculator: true` trong phạm vi: Trụ sở chính TP.HCM, chương trình Chuẩn.
 */
export const iuhMeta: Omit<SchoolModule, 'Page'> = {
  id: 'iuh',
  name: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh',
  shortName: 'IUH',
  about:
    'Đại học công lập trực thuộc Bộ Công Thương, tiền thân là Trường Huấn nghiệp Gò Vấp thành lập năm 1956, đào tạo đa ngành kỹ thuật - công nghệ.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển kết hợp (thang 30, Trụ sở chính TP.HCM, chương trình Chuẩn) tính CHÍNH XÁC — công thức ĐXT=Max(XT1,XT2,XT3), cả nhánh ĐGNL (XT3) đều tính được (ĐTK 2026=1139, verified qua ĐHQG-HCM + cross-check UFM) · Điểm xét thưởng chỉ phủ 4/7 hạng mục Phụ lục 1 (3 hạng mục còn lại cần tra danh mục trường động) · Chương trình Tăng cường tiếng Anh/Phân hiệu Quảng Ngãi/Dược học/Pháp luật chưa implement · Danh mục ngành và điểm trúng tuyển 2026 (32 dòng, đã có nguồn) chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(iuhAdmissionMethods),
  },
};
