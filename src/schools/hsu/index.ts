import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hsuAdmissionMethods } from './methods';

/**
 * Module HSU (Trường Đại học Hoa Sen) — research 2026-08-21, browser thật (chrome-devtools, đọc
 * trực tiếp `www.hoasen.edu.vn`). Điểm sàn phương thức thi TN THPT 2026 (15 chuẩn/20 khối Pháp
 * luật) đã verified từ 2 bài công bố chính thức độc lập (điểm sàn tổng quát 03/07 + điểm sàn khối
 * Luật 09/07, cùng domain). Điểm sàn phương thức học bạ (18, chỉ nhóm chuẩn) đã verified. Chưa có
 * `Page` riêng (chỉ data/eligibility layer, như AGU/VLU/HUIT/NTTU) — chưa đủ scope dựng UI
 * calculator khi danh mục ngành, bảng ưu tiên/điểm cộng, và ngưỡng học bạ/ĐGNL nhóm Luật vẫn còn
 * là knowledge gap (xem `knowledgeGaps.ts`).
 */
export const hsuModule: SchoolModule = {
  id: 'hsu',
  name: 'Trường Đại học Hoa Sen',
  shortName: 'HSU',
  about: 'Trường đại học tư thục tại TP.HCM, đạt tiêu chuẩn kiểm định quốc tế, đào tạo mạnh về kinh tế - quản trị, thiết kế và công nghệ.',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm sàn phương thức thi TN THPT (15 chuẩn/20 khối Pháp luật, thang 30) và học bạ (18, chỉ nhóm chuẩn) đã xác minh từ 2 bài công bố chính thức trên hoasen.edu.vn · Calculator chính xác đang chờ danh mục ngành, bảng điểm ưu tiên/điểm cộng, và ngưỡng học bạ/ĐGNL nhóm Luật',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hsuAdmissionMethods),
  },
};
