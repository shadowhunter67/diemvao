import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmutAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `HcmutCalculatorPage` (component nặng, kéo theo toàn bộ
 * calculator/data/components của trường). Tách riêng để `schools/index.ts` có thể build
 * `schoolMetadataRegistry` (landing page/search/filter cần đọc đồng bộ mọi trường) mà không phải
 * tải Page của cả 30 trường vào initial bundle — xem `docs/architecture.md` mục code splitting.
 * `index.ts` compose lại `{ ...hcmutMeta, Page: HcmutCalculatorPage }` cho code nào cần `SchoolModule`
 * đầy đủ (school-local test, comparison adapter registry không cần Page nên KHÔNG import qua đây).
 */
export const hcmutMeta: Omit<SchoolModule, 'Page'> = {
  id: 'hcmut',
  name: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
  shortName: 'HCMUT',
  about:
    'Trường đại học kỹ thuật công lập, tiền thân từ năm 1957, chính thức mang tên Đại học Bách khoa từ 1976 và là thành viên ĐHQG-HCM từ 1996.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(hcmutAdmissionMethods),
  },
};
