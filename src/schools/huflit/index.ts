import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { huflitAdmissionMethods } from './methods';

/**
 * Module HUFLIT (Trường Đại học Ngoại ngữ - Tin học TP.HCM, trường thứ 13) — research 2026-08-18.
 * Cả 3 phương thức tính điểm (PT1 thi THPT/PT2 học bạ/PT3 ĐGNL) đều `exactCalculator: true` trong
 * phạm vi thí sinh KHÔNG có thành tích cộng điểm (PT1/PT2) hoặc toàn bộ (PT3, không có thành phần
 * điểm cộng). Công thức cực đơn giản: tổng thô 3 môn (không nhân hệ số môn nào) — không có hệ số
 * học lực/điểm cộng phức tạp như HCMUT/HCMUTE/TDTU. Bảng điểm thưởng/khuyến khích cụ thể chưa tìm
 * được nguồn (`knowledgeGaps.ts`) — thí sinh CÓ thành tích vẫn `partial`. Chưa có `Page` riêng.
 */
export const huflitModule: SchoolModule = {
  id: 'huflit',
  name: 'Trường Đại học Ngoại ngữ - Tin học TP. Hồ Chí Minh',
  shortName: 'HUFLIT',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển PT1 (thi THPT, thang 30), PT2 (học bạ, thang 30), PT3 (ĐGNL ĐHQG-HCM, thang 1200) đều tính CHÍNH XÁC — công thức là tổng thô 3 môn, ngưỡng đầu vào (kể cả ngành Luật/Luật kinh tế riêng) verified từ Thông báo 09/7/2026 · Bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn partial; danh mục 23 ngành/tổ hợp chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(huflitAdmissionMethods),
  },
};
