import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { uefAdmissionMethods } from './methods';

/**
 * Module UEF (Trường Đại học Kinh tế - Tài chính TP.HCM) — research 2026-08-21, browser thật
 * (chrome-devtools, đọc trực tiếp `www.uef.edu.vn`). Mức điểm nhận hồ sơ phương thức thi TN THPT
 * (15 chuẩn/20 khối Luật) và học bạ 6 học kỳ (18 chuẩn; khối Luật dùng điều kiện học lực + điểm
 * thay thế) đã verified từ 1 bài công bố chính thức. Chưa có `Page` riêng (chỉ data/eligibility
 * layer, như AGU/VLU/HUIT/NTTU/HSU) — chưa đủ scope dựng UI calculator khi danh mục ngành, bảng
 * điểm ưu tiên/điểm cộng, và phương pháp tính điểm học bạ theo học kỳ vẫn còn là knowledge gap
 * (xem `knowledgeGaps.ts`).
 */
export const uefModule: SchoolModule = {
  id: 'uef',
  name: 'Trường Đại học Kinh tế - Tài chính TP.HCM',
  shortName: 'UEF',
  about: 'Trường đại học tư thục định hướng quốc tế tại TP.HCM, đào tạo song ngữ, đào tạo mạnh về kinh tế - tài chính - quản trị và luật.',
  year: 2026,
  status: 'researching',
  summary:
    'Mức điểm nhận hồ sơ phương thức thi TN THPT (15 chuẩn/20 khối Luật, thang 30) và học bạ 6 học kỳ (18 chuẩn; khối Luật cần học lực Tốt/Giỏi + điểm thay thế) đã xác minh từ 1 bài công bố chính thức trên uef.edu.vn · Calculator chính xác đang chờ danh mục ngành, bảng điểm ưu tiên/điểm cộng, và phương pháp tính điểm học bạ theo học kỳ',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(uefAdmissionMethods),
  },
};
