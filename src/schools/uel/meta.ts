import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { uelAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UelExplorerPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...uelMeta, Page: UelExplorerPage }`.
 *
 * research 2026-08-11 (xem docs/admission-research-2026.md). Công thức 3 thành phần (ĐGNL/THPT/
 * học bạ) đã biết đầy đủ cách quy đổi, `capabilities.exactCalculator` derive `true` từ
 * `uelAdmissionMethods`, `status: 'supported'` khớp.
 */
export const uelMeta: Omit<SchoolModule, 'Page'> = {
  id: 'uel',
  name: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
  shortName: 'UEL',
  about:
    'Trường đại học công lập thành viên ĐHQG-HCM, thành lập năm 2010 (tiền thân là Khoa Kinh tế từ năm 2000), đào tạo kinh tế, kinh doanh và luật.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  summary:
    'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn 38 ngành, ngưỡng đầu vào, điều kiện điểm cộng) · Calculator chính xác đủ cả 3 đối tượng (DT1/DT2/DT3), gồm bảng điểm cộng chứng chỉ ngoại ngữ đã verified',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uelAdmissionMethods),
  },
};
