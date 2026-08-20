import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { iuhAdmissionMethods } from './methods';

/**
 * Module IUH (Trường Đại học Công nghiệp Thành phố Hồ Chí Minh, trường thứ 16) — research
 * 2026-08-19/20. Phương thức "xét tuyển kết hợp" (duy nhất có công thức điểm) `exactCalculator:
 * true` trong phạm vi: Trụ sở chính TP.HCM, chương trình Chuẩn (ngoài Dược học/Pháp luật), thí sinh
 * KHÔNG có điểm ĐGNL ĐHQG-HCM trong hồ sơ (nhánh XT3 bị chặn — ĐTK 2026 chưa xác định từ nguồn IUH).
 * Chương trình Tăng cường tiếng Anh, Phân hiệu Quảng Ngãi, ngành Dược học/Pháp luật CHƯA implement.
 * Danh mục ngành/mã ngành/tổ hợp cố định và bảng điểm trúng tuyển 2026 (32 dòng, đã có nguồn) CHƯA
 * import — evaluator nhận tổ hợp 3 môn trực tiếp từ caller. Chưa có `Page` riêng.
 */
export const iuhModule: SchoolModule = {
  id: 'iuh',
  name: 'Trường Đại học Công nghiệp Thành phố Hồ Chí Minh',
  shortName: 'IUH',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển kết hợp (thang 30, Trụ sở chính TP.HCM, chương trình Chuẩn) tính CHÍNH XÁC khi thí sinh KHÔNG có điểm ĐGNL ĐHQG-HCM trong hồ sơ — công thức ĐXT=Max(XT1,XT2), XT1=0.7×ĐK+0.3×ĐHB+ưu tiên+cộng, XT2=ĐTN+ưu tiên+cộng · Có điểm ĐGNL → chỉ partial (ĐTK 2026 dùng quy đổi nhánh ĐGNL chưa xác định từ nguồn IUH, có thể khiến Max thật cao hơn) · Điểm xét thưởng chỉ phủ 4/7 hạng mục Phụ lục 1 (3 hạng mục còn lại cần tra danh mục trường động) · Chương trình Tăng cường tiếng Anh/Phân hiệu Quảng Ngãi/Dược học/Pháp luật chưa implement · Danh mục ngành và điểm trúng tuyển 2026 (32 dòng, đã có nguồn) chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(iuhAdmissionMethods),
  },
};
