import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ufmAdmissionMethods } from './methods';

/**
 * Module UFM (Trường Đại học Tài chính – Marketing, trường thứ 15) — research 2026-08-18.
 * 2/4 phương thức tính điểm (xét THPT/xét ĐGNL) `exactCalculator: true` trong phạm vi chương trình
 * Chuẩn (KHÔNG phải Tiếng Anh toàn phần — hệ số Toán×2 chưa xác nhận rõ) và thí sinh KHÔNG có thành
 * tích cộng điểm. Phương thức học bạ dừng ở `unavailable` (công thức cần dữ liệu theo học kỳ, hồ sơ
 * dùng chung chỉ lưu TB năm). Phương thức V-SAT dừng ở eligibility-only (thang điểm/công thức quy
 * đổi chưa xác định). Ngưỡng đầu vào 4 phương thức × 2 nhóm ngành (chuẩn/Luật kinh tế) verified từ
 * Thông báo 10/7/2026. Chưa có `Page` riêng.
 */
export const ufmModule: SchoolModule = {
  id: 'ufm',
  name: 'Trường Đại học Tài chính – Marketing',
  shortName: 'UFM',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển xét THPT (thang 30, chương trình Chuẩn) và xét ĐGNL ĐHQG-HCM (thang 1200) tính CHÍNH XÁC — công thức là tổng thô 3 môn (THPT) / điểm ĐGNL trực tiếp, ngưỡng đầu vào 2 nhóm ngành (chuẩn/Luật kinh tế) verified từ Thông báo 10/7/2026 · Xét học bạ chưa tính được (cần dữ liệu theo học kỳ, hồ sơ dùng chung chỉ lưu TB năm) · Xét V-SAT chỉ kiểm tra được ngưỡng đầu vào · Hệ số Toán×2 của chương trình Tiếng Anh toàn phần CHƯA implement (nguồn mâu thuẫn về phạm vi áp dụng) · Bảng điểm cộng/xét thưởng cụ thể chưa tìm được nguồn nên thí sinh có thành tích cộng điểm vẫn partial; danh mục ngành/chương trình chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ufmAdmissionMethods),
  },
};
