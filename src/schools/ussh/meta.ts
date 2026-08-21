import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { usshAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `UsshPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...usshMeta, Page: UsshPage }`.
 *
 * re-audit 2026-08-15 với PDF chính thức "Thông tin tuyển sinh năm 2026" (36 trang, text layer),
 * xác nhận độc lập lần 2 bởi thông báo "Một số lưu ý...". ĐHL1/ĐHL2/ĐHL3 đều tính được đầy đủ
 * (không cần α — xem `calculator.ts`). `status: 'supported'` cho phạm vi thí sinh KHÔNG có thành
 * tích được cộng điểm (ĐC=0) — thí sinh có thành tích cộng điểm vẫn partial vì mức cộng cụ thể
 * theo tiêu chí chưa công bố (`bonus.ts`).
 */
export const usshMeta: Omit<SchoolModule, 'Page'> = {
  id: 'ussh',
  name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
  shortName: 'USSH',
  about:
    'Thành lập năm 1957, trường đại học công lập thành viên ĐHQG-HCM từ 1996, đào tạo các ngành khoa học xã hội và nhân văn.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  summary:
    'Tính được điểm xét tuyển cuối (ĐHL1/ĐHL2/ĐHL3 + Điểm ưu tiên) cho thí sinh KHÔNG có thành tích được cộng điểm — thí sinh có thành tích cộng điểm vẫn partial vì mức cộng cụ thể theo tiêu chí chưa công bố.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(usshAdmissionMethods),
    partialCalculator: true,
  },
};
