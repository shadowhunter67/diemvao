import type { SchoolModule } from '../../core/schoolModule';
import { HcmutCalculatorPage } from './HcmutCalculatorPage';

/**
 * Module trường đầu tiên của Uniscore. Bản thân module này chỉ export thông tin định danh
 * (SchoolModule, kèm `Page` — component trang trọn vẹn của trường) để đăng ký vào
 * schoolRegistry — logic tính điểm/config/data thật nằm rải trong các file con của thư mục
 * này (calculator/, config/, data/, types/, validation.ts, urlState.ts, programs.ts) và được
 * `HcmutCalculatorPage` import trực tiếp theo đường dẫn cụ thể, không gom hết qua barrel này
 * (tránh 1 file re-export khổng lồ khó theo dõi). App shell chỉ biết `Page`, không import gì
 * khác từ thư mục này.
 */
export const hcmutModule: SchoolModule = {
  id: 'hcmut',
  name: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
  shortName: 'HCMUT',
  year: 2026,
  status: 'supported',
  capabilities: {
    admissionInfo: true,
    programs: true,
    eligibility: true,
    cutoffs: true,
    scoreConversion: true,
    exactCalculator: true,
  },
  Page: HcmutCalculatorPage,
};
