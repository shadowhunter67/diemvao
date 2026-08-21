import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { tdmuAdmissionMethods } from './methods';

/**
 * Module TDMU (Trường Đại học Thủ Dầu Một) — research 2026-08-21, đọc trực tiếp bài đăng chính
 * thức `tdmu.edu.vn` (xem `sources.ts`). Ngưỡng đảm bảo chất lượng đầu vào theo 3 nhóm ngành
 * (standard/law/teacher) đã verified cho 3 phương thức có input khớp `ApplicantProfile`: thi TN
 * THPT (thang 30, 15/20/20), học bạ (thang 30, điểm trung bình 3 môn tổ hợp 6 học kỳ, 16,5/21,5 —
 * chỉ standard/law), ĐGNL ĐHQG-HCM (thang 1200, 600/750 — chỉ standard/law). Chưa có `Page` riêng
 * (chỉ data/eligibility layer, như HUB/CTU) — bảng điểm ưu tiên/điểm cộng riêng của trường vẫn là
 * knowledge gap (xem `knowledgeGaps.ts`).
 */
export const tdmuModule: SchoolModule = {
  id: 'tdmu',
  name: 'Trường Đại học Thủ Dầu Một',
  shortName: 'TDMU',
  about: 'Trường đại học công lập trực thuộc UBND (trước sáp nhập: tỉnh Bình Dương, nay thuộc TP. Hồ Chí Minh), đào tạo đa ngành kỹ thuật, kinh tế, sư phạm, khoa học xã hội.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Ngưỡng đảm bảo chất lượng đầu vào theo 3 nhóm ngành (45 ngành khác/Luật/sư phạm) đã xác minh từ bài đăng chính thức tdmu.edu.vn (09/7/2026) cho 3 phương thức: thi TN THPT (thang 30 — 15/20/20 điểm), học bạ (thang 30, điểm trung bình 3 môn tổ hợp 6 học kỳ — 16,5/21,5, chỉ 2 nhóm đầu), ĐGNL ĐHQG-HCM (thang 1200 — 600/750, chỉ 2 nhóm đầu) · Đây là điểm SÀN NHẬN HỒ SƠ, KHÔNG PHẢI điểm chuẩn trúng tuyển cuối — bảng điểm ưu tiên/điểm cộng riêng của trường chưa tìm được nguồn.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(tdmuAdmissionMethods),
  },
};
