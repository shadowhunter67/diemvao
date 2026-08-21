import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmulawAdmissionMethods } from './methods';

/**
 * Metadata NHẸ — KHÔNG import `HcmulawPage` (xem `hcmut/meta.ts` cho rationale đầy đủ về tách
 * meta/Page phục vụ code splitting). `index.ts` compose `{ ...hcmulawMeta, Page: HcmulawPage }`.
 *
 * research 2026-08-20. 2/4 phương thức tính điểm `exactCalculator: true`: Phương thức 5 (thi TN
 * THPT) và Phương thức 4 (V-SAT, quy đổi riêng từng môn). Phương thức 2/3 (dựa học bạ) vẫn
 * `unavailable`.
 */
export const hcmulawMeta: Omit<SchoolModule, 'Page'> = {
  id: 'hcmulaw',
  name: 'Trường Đại học Luật Thành phố Hồ Chí Minh',
  shortName: 'HCMULAW',
  about: 'Đại học công lập thành lập năm 1996, một trong hai cơ sở đào tạo luật trọng điểm của Việt Nam.',
  year: 2026,
  status: 'supported',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Điểm xét tuyển Phương thức 5 (thi TN THPT, mã PT 100) và Phương thức 4 (V-SAT, mã PT 417) tính CHÍNH XÁC — PT5 là tổng thô 3 môn theo tổ hợp; PT4 quy đổi riêng từng môn qua bảng bách phân vị chính thức (7 môn có bảng: Toán/Văn/Anh/Lý/Hóa/Sử/Địa), cả 2 cộng thêm điểm ưu tiên chuẩn quốc gia, ngưỡng đầu vào 11 ngành verified từ Thông báo 9/7/2026 · Phương thức 2 (kết hợp học bạ + chứng chỉ/SAT) và Phương thức 3 (học bạ trường ưu tiên ĐHQG-HCM) vẫn CHƯA tính được — công thức đã công bố nhưng cần điểm học bạ theo 6 học kỳ, hồ sơ dùng chung chỉ lưu TB năm · Tổ hợp môn dùng ngoại ngữ Pháp/Nhật/Trung (thay Tiếng Anh) chưa hỗ trợ · Phân hiệu Quảng Trị chưa phân biệt riêng',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmulawAdmissionMethods),
  },
};
