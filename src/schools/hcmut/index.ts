import type { SchoolModule } from '../../core/schoolModule';

/**
 * Module trường đầu tiên của Uniscore. Bản thân module này chỉ export thông tin định danh
 * (SchoolModule) để đăng ký vào schoolRegistry — logic tính điểm/config/data thật nằm rải
 * trong các file con của thư mục này (calculator/, config/, data/, types/, validation.ts,
 * urlState.ts, programs.ts) và được các component import trực tiếp theo đường dẫn cụ thể,
 * không gom hết qua barrel này (tránh 1 file re-export khổng lồ khó theo dõi).
 */
export const hcmutModule: SchoolModule = {
  id: 'hcmut',
  name: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
  shortName: 'HCMUT',
  year: 2026,
  status: 'supported',
};
