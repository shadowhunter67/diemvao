import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hiuAdmissionMethods } from './methods';

/**
 * Module HIU (Trường Đại học Quốc tế Hồng Bàng) — research 2026-08-21, đọc trực tiếp bài đăng
 * chính thức `hiu.vn` (xem `sources.ts`). Ngưỡng thi TN THPT nhóm ngành thường (15/30) và ngưỡng
 * ĐGNL ĐHQG-HCM cả 3 nhóm (650/700/675, thang 1200) đã verified. Nhóm pháp luật/sức khỏe cấp phép
 * hành nghề dùng ngưỡng do Bộ GD&ĐT quy định cho phương thức thi TN THPT — nguồn HIU KHÔNG nêu
 * con số cụ thể (`hiu-health-license-law-threshold-not-found`). Phương thức kết hợp thi TN THPT +
 * học bạ có ngưỡng nhưng thiếu công thức trọng số, không xây được evaluator.
 */
export const hiuModule: SchoolModule = {
  id: 'hiu',
  name: 'Trường Đại học Quốc tế Hồng Bàng',
  shortName: 'HIU',
  about: 'Trường đại học tư thục tại TP. Hồ Chí Minh, chuyên sâu về khoa học sức khỏe (Y khoa, Răng Hàm Mặt, Dược, Điều dưỡng...) và các ngành kinh doanh, công nghệ, xã hội, ngôn ngữ.',
  year: 2026,
  status: 'researching',
  ownership: 'private',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Ngưỡng đầu vào phương thức thi TN THPT (15/30, phần lớn ngành) và ĐGNL ĐHQG-HCM (650/700/675, thang 1200, tùy nhóm ngành) đã xác minh từ bài đăng chính thức hiu.vn (cập nhật 10/8/2026) · Nhóm pháp luật/sức khỏe cấp phép hành nghề dùng ngưỡng Bộ GD&ĐT quy định cho phương thức thi TN THPT — nguồn HIU không nêu con số cụ thể · Phương thức kết hợp thi TN THPT + học bạ có ngưỡng (16/30) nhưng thiếu công thức trọng số, chưa xây được eligibility checker.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hiuAdmissionMethods),
  },
};
