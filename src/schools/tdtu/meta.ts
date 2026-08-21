import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { tdtuAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `TdtuPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...tdtuMeta, Page: TdtuPage }`.
 *
 * research 2026-08-18 (batch expansion). Trang "Phương thức tuyển sinh năm 2026"
 * (`sources.ts:tdtu-admission-plan-2026`) là HTML text đọc trực tiếp được, công bố đầy đủ công
 * thức PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL, thang 1200) — cả 2
 * đều `exactCalculator: true` trong phạm vi đã implement. Danh mục 119 ngành/chương trình đã import
 * đủ 119/119 nhưng tổ hợp/ngưỡng riêng từng ngành CHƯA import (xem `knowledgeGaps.ts`).
 */
export const tdtuMeta: Omit<SchoolModule, 'Page'> = {
  id: 'tdtu',
  name: 'Trường Đại học Tôn Đức Thắng',
  shortName: 'TDTU',
  about:
    'Thành lập năm 1997, trường đại học công lập trực thuộc Tổng Liên đoàn Lao động Việt Nam, đào tạo đa ngành kỹ thuật, kinh tế và khoa học ứng dụng.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL ĐHQG-HCM, thang 1200) đều tính CHÍNH XÁC từ công thức chính thức (Điểm năng lực/Điểm cộng/Điểm ưu tiên đầy đủ) · Danh mục 119 ngành/chương trình đã có (tên/mã ngành) · Tổ hợp và ngưỡng đầu vào riêng theo ngành, Đối tượng 1.2-1.5 chưa import',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(tdtuAdmissionMethods),
  },
};
