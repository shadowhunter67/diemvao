import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ufmAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UfmPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách meta/Page
 * phục vụ code splitting). `index.ts` compose `{ ...ufmMeta, Page: UfmPage }`.
 *
 * research 2026-08-18, batch 2026-08-20 đóng dứt điểm gap quy đổi bách phân vị. CẢ 4/4 phương thức
 * tính điểm `exactCalculator: true` trong phạm vi chương trình Chuẩn.
 */
export const ufmMeta: Omit<SchoolModule, 'Page'> = {
  id: 'ufm',
  name: 'Trường Đại học Tài chính – Marketing',
  shortName: 'UFM',
  about: 'Đại học công lập trực thuộc Bộ Tài chính, tiền thân từ năm 1976, chuyên đào tạo tài chính và marketing.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển 4 phương thức (thi TN THPT/học bạ/ĐGNL/V-SAT, chương trình Chuẩn) đều tính CHÍNH XÁC — thi TN THPT dùng tổng thô 3 môn; học bạ/ĐGNL/V-SAT quy đổi qua bảng bách phân vị chính thức (mục 3, Thông báo 10/7/2026) sang thang 30, verified khớp ví dụ minh họa của văn bản · Ngưỡng đầu vào 2 nhóm ngành (chuẩn/Luật kinh tế) verified · Hệ số Toán×2 của chương trình Tiếng Anh toàn phần CHƯA implement (ngoài phạm vi chương trình Chuẩn) · Danh mục ngành/chương trình chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ufmAdmissionMethods),
  },
};
