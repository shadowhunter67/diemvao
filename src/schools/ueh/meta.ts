import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { uehAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UehExplorerPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...uehMeta, Page: UehExplorerPage }`.
 *
 * re-audit 2026-08-13 (xem docs/CHANGELOG.md): exact calculator cho Đối tượng 1 (thí sinh tốt
 * nghiệp THPT Việt Nam) — worked example + bảng điểm cộng/ưu tiên đầy đủ từ nguồn
 * `ueh-ksa-ksv-info-2026` không còn gap nào block công thức.
 */
export const uehMeta: Omit<SchoolModule, 'Page'> = {
  id: 'ueh',
  name: 'Trường Đại học Kinh tế TP.HCM',
  shortName: 'UEH',
  about:
    'Đại học công lập đa ngành thành lập năm 1976, chuyên khối kinh tế, kinh doanh và quản lý, trực thuộc Bộ GD&ĐT (không thuộc ĐHQG-HCM).',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Tính điểm chính xác Phương thức xét tuyển tích hợp (Đối tượng 1 — THPT Việt Nam): điểm thi/ĐGNL, học bạ, điểm cộng, ưu tiên · Điểm chuẩn 97 chương trình 2026',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uehAdmissionMethods),
  },
};
