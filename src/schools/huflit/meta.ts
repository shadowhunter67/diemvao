import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { huflitAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `HuflitPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...huflitMeta, Page: HuflitPage }`.
 *
 * research 2026-08-18. Cả 3 phương thức (PT1 thi THPT/PT2 học bạ/PT3 ĐGNL) đều `exactCalculator:
 * true` trong phạm vi thí sinh KHÔNG có thành tích cộng điểm (PT1/PT2) hoặc toàn bộ (PT3).
 */
export const huflitMeta: Omit<SchoolModule, 'Page'> = {
  id: 'huflit',
  name: 'Trường Đại học Ngoại ngữ - Tin học TP. Hồ Chí Minh',
  shortName: 'HUFLIT',
  about:
    'Thành lập năm 1994, chuyển sang loại hình tư thục từ 2015; đào tạo ngoại ngữ, công nghệ thông tin, kinh tế - quản lý và du lịch.',
  year: 2026,
  status: 'supported',
  ownership: 'private',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển PT1 (thi THPT, thang 30), PT2 (học bạ, thang 30), PT3 (ĐGNL ĐHQG-HCM, thang 1200) đều tính CHÍNH XÁC — công thức là tổng thô 3 môn, ngưỡng đầu vào (kể cả ngành Luật/Luật kinh tế riêng) verified từ Thông báo 09/7/2026 · Bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn partial; danh mục 23 ngành/tổ hợp chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(huflitAdmissionMethods),
  },
};
