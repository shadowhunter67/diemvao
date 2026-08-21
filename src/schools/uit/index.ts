import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UitInfoPage } from './UitInfoPage';
import { uitAdmissionMethods } from './methods';

/**
 * Module UIT — trọng số tổng đã xác minh (xem sources.ts), nhưng thiếu nguồn cho cách chuẩn
 * hóa chi tiết từng thành phần nên CHƯA có calculator thật. `Page` render trang thông tin +
 * dữ liệu điểm chuẩn thật (xem UitInfoPage.tsx), không phải calculator. `status` giữ
 * 'researching' — đúng semantic sẵn có (formula verified một phần, chưa implement calculator).
 * `eligibility`/`scoreConversion`/`exactCalculator` derive từ `uitAdmissionMethods` (batch 6).
 */
export const uitModule: SchoolModule = {
  id: 'uit',
  name: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
  shortName: 'UIT',
  about:
    'Thành lập năm 2006, trường đại học công lập thành viên ĐHQG-HCM, chuyên đào tạo và nghiên cứu công nghệ thông tin – truyền thông.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: true,
  summary: 'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn, ngưỡng, điểm cộng) · Calculator chính xác đang chờ bảng quy đổi bách phân vị',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uitAdmissionMethods),
  },
  Page: UitInfoPage,
};
