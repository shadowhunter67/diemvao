import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmulawAdmissionMethods } from './methods';

/**
 * Module HCMULAW (Trường Đại học Luật Thành phố Hồ Chí Minh, trường thứ 17) — research 2026-08-20.
 * 1/4 phương thức tính điểm (xét kết quả thi TN THPT, mã PT 100) `exactCalculator: true` — công
 * thức là tổng thô 3 môn theo tổ hợp (thang 30, không nhân hệ số) + điểm ưu tiên chuẩn quốc gia,
 * không có điểm cộng ở phương thức này. 3 phương thức còn lại (410 kết hợp học bạ+chứng chỉ/SAT,
 * 200 học bạ trường ưu tiên ĐHQG-HCM, 417 V-SAT) đều `unavailable` — cả 3 cần "Mức quy đổi tương
 * đương" sang thang điểm thi TN THPT mà văn bản gốc xác nhận CHƯA TỒN TẠI (sẽ công bố sau khi có
 * kết quả thi TN THPT 2026), xem `schools/hcmulaw/knowledgeGaps.ts`. Ngưỡng đầu vào 11 ngành verified
 * từ Thông báo 9/7/2026 (bảng ảnh gốc, transcribe đủ). Chưa có `Page` riêng.
 */
export const hcmulawModule: SchoolModule = {
  id: 'hcmulaw',
  name: 'Trường Đại học Luật Thành phố Hồ Chí Minh',
  shortName: 'HCMULAW',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển Phương thức 5 (xét kết quả thi TN THPT 2026, mã PT 100) tính CHÍNH XÁC — công thức là tổng thô 3 môn theo tổ hợp (thang 30) + điểm ưu tiên chuẩn quốc gia, ngưỡng đầu vào 11 ngành verified từ Thông báo 9/7/2026 · Phương thức 2 (kết hợp học bạ + chứng chỉ/SAT), Phương thức 3 (học bạ trường ưu tiên ĐHQG-HCM) và Phương thức 4 (V-SAT) đều CHƯA tính được — cả 3 cần bảng quy đổi tương đương sang thang thi TN THPT mà Trường xác nhận sẽ công bố SAU khi có kết quả thi TN THPT 2026 · Tổ hợp môn dùng ngoại ngữ Pháp/Nhật/Trung (thay Tiếng Anh) chưa hỗ trợ · Phân hiệu Quảng Trị chưa phân biệt riêng',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmulawAdmissionMethods),
  },
};
