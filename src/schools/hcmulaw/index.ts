import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmulawAdmissionMethods } from './methods';

/**
 * Module HCMULAW (Trường Đại học Luật Thành phố Hồ Chí Minh, trường thứ 17) — research 2026-08-20,
 * batch cùng ngày đóng gap V-SAT. 2/4 phương thức tính điểm `exactCalculator: true`:
 * - Phương thức 5 (thi TN THPT, mã 100): tổng thô 3 môn theo tổ hợp (thang 30) + ưu tiên, không cộng.
 * - Phương thức 4 (V-SAT, mã 417): quy đổi RIÊNG TỪNG MÔN qua bảng bách phân vị (7 môn Toán/Văn/Anh/
 *   Lý/Hóa/Sử/Địa, `conversionTable.ts`) + ưu tiên, verified khớp ví dụ minh họa chính thức.
 * Phương thức 2/3 (410/200, dựa học bạ) vẫn `unavailable` — công thức y=x-k đã công bố nhưng cần TB
 * học bạ theo 6 HỌC KỲ, hồ sơ dùng chung chỉ lưu TB năm, xem `schools/hcmulaw/knowledgeGaps.ts`.
 * Ngưỡng đầu vào 11 ngành verified từ Thông báo 9/7/2026 (bảng ảnh gốc, transcribe đủ). Chưa có
 * `Page` riêng.
 */
export const hcmulawModule: SchoolModule = {
  id: 'hcmulaw',
  name: 'Trường Đại học Luật Thành phố Hồ Chí Minh',
  shortName: 'HCMULAW',
  about: 'Đại học công lập thành lập năm 1996, một trong hai cơ sở đào tạo luật trọng điểm của Việt Nam.',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển Phương thức 5 (thi TN THPT, mã PT 100) và Phương thức 4 (V-SAT, mã PT 417) tính CHÍNH XÁC — PT5 là tổng thô 3 môn theo tổ hợp; PT4 quy đổi riêng từng môn qua bảng bách phân vị chính thức (7 môn có bảng: Toán/Văn/Anh/Lý/Hóa/Sử/Địa), cả 2 cộng thêm điểm ưu tiên chuẩn quốc gia, ngưỡng đầu vào 11 ngành verified từ Thông báo 9/7/2026 · Phương thức 2 (kết hợp học bạ + chứng chỉ/SAT) và Phương thức 3 (học bạ trường ưu tiên ĐHQG-HCM) vẫn CHƯA tính được — công thức đã công bố nhưng cần điểm học bạ theo 6 học kỳ, hồ sơ dùng chung chỉ lưu TB năm · Tổ hợp môn dùng ngoại ngữ Pháp/Nhật/Trung (thay Tiếng Anh) chưa hỗ trợ · Phân hiệu Quảng Trị chưa phân biệt riêng',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmulawAdmissionMethods),
  },
};
