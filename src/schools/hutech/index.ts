import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hutechAdmissionMethods } from './methods';

/**
 * Module HUTECH (Trường Đại học Công nghệ TP.HCM, trường thứ 14) — research 2026-08-18.
 * 2/4 phương thức tính điểm (xét THPT/xét ĐGNL) `exactCalculator: true` trong phạm vi thí sinh
 * KHÔNG có thành tích cộng điểm. Phương thức học bạ dừng ở `unavailable` (khoảng cách độ chi tiết
 * dữ liệu: công thức cần 6 học kỳ, hồ sơ dùng chung chỉ lưu TB năm). Phương thức V-SAT dừng ở
 * eligibility-only (thang điểm/công thức quy đổi chưa xác định rõ ràng từ nguồn). Ngưỡng đầu vào cả
 * 4 phương thức × 4 nhóm ngành (Y khoa/Dược+Luật/Điều dưỡng+KTXNYH/còn lại) verified từ Thông báo
 * 04/7/2026. Chưa có `Page` riêng.
 */
export const hutechModule: SchoolModule = {
  id: 'hutech',
  name: 'Trường Đại học Công nghệ TP. Hồ Chí Minh',
  shortName: 'HUTECH',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển xét THPT (thang 30) và xét ĐGNL ĐHQG-HCM (thang 1200) tính CHÍNH XÁC — công thức là tổng thô 3 môn (THPT) / điểm ĐGNL trực tiếp, ngưỡng đầu vào 4 nhóm ngành (Y khoa/Dược+Luật/Điều dưỡng+KTXNYH/còn lại) verified từ Thông báo 04/7/2026 · Xét học bạ chưa tính được (cần dữ liệu theo 6 học kỳ, hồ sơ dùng chung chỉ lưu TB năm) · Xét V-SAT chỉ kiểm tra được ngưỡng đầu vào (thang điểm/công thức quy đổi chưa rõ) · Bảng điểm thưởng/khuyến khích cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn partial; danh mục 63 ngành/tổ hợp chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hutechAdmissionMethods),
  },
};
