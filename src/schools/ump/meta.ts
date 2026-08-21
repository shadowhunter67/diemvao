import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { umpAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UmpPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách meta/Page
 * phục vụ code splitting). `index.ts` compose `{ ...umpMeta, Page: UmpPage }`.
 *
 * research 2026-08-19/20. Domain chính thức: `ump.edu.vn` (KHÔNG nhầm với `ump.vnu.edu.vn`).
 * Phương thức duy nhất có công thức điểm (xét kết quả thi TN THPT 2026) `exactCalculator: true`
 * KHÔNG điều kiện.
 */
export const umpMeta: Omit<SchoolModule, 'Page'> = {
  id: 'ump',
  name: 'Trường Đại học Y Dược Thành phố Hồ Chí Minh',
  shortName: 'UMP',
  about:
    'Đại học công lập chuyên ngành y dược, tiền thân là Đại học Y khoa Sài Gòn (1947), tổ chức lại thành trường hiện nay từ năm 1976.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển Phương thức xét kết quả thi TN THPT 2026 tính CHÍNH XÁC — công thức là tổng thô 3 môn theo tổ hợp (thang 30) + điểm ưu tiên chuẩn quốc gia + điểm khuyến khích (chứng chỉ ngoại ngữ/SAT, verified từ nguồn UMP tự công bố), ngưỡng đầu vào 18 ngành verified từ Thông báo 2983/TB-ĐHYD · Điều kiện giới tính riêng ngành Hộ sinh chưa kiểm tra được (hồ sơ dùng chung không lưu giới tính) · Điểm trúng tuyển 2026 đã có nguồn nhưng chưa nhập',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(umpAdmissionMethods),
  },
};
