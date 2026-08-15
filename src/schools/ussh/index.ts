import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UsshPage } from './UsshPage';
import { usshAdmissionMethods } from './methods';

/**
 * Module USSH — re-audit 2026-08-15 với PDF chính thức "Thông tin tuyển sinh năm 2026" (36 trang,
 * text layer), xác nhận độc lập lần 2 bởi thông báo "Một số lưu ý...". ĐHL1/ĐHL2/ĐHL3 đều tính
 * được đầy đủ (không cần α — xem `calculator.ts`). `status: 'supported'` cho phạm vi thí sinh
 * KHÔNG có thành tích được cộng điểm (ĐC=0) — thí sinh có thành tích cộng điểm vẫn partial vì mức
 * cộng cụ thể theo tiêu chí chưa công bố (`bonus.ts`).
 */
export const usshModule: SchoolModule = {
  id: 'ussh',
  name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
  shortName: 'USSH',
  year: 2026,
  status: 'supported',
  summary:
    'Tính được điểm xét tuyển cuối (ĐHL1/ĐHL2/ĐHL3 + Điểm ưu tiên) cho thí sinh KHÔNG có thành tích được cộng điểm — thí sinh có thành tích cộng điểm vẫn partial vì mức cộng cụ thể theo tiêu chí chưa công bố.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(usshAdmissionMethods),
    partialCalculator: true,
  },
  Page: UsshPage,
};
