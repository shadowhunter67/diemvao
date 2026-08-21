import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { nttuAdmissionMethods } from './methods';

/**
 * Module NTTU (Trường Đại học Nguyễn Tất Thành, mã trường NNT) — research 2026-08-21, browser
 * thật (chrome-devtools, đọc trực tiếp `tuyensinh.ntt.edu.vn`). Ngưỡng điểm sàn phương thức học
 * bạ theo 6 nhóm ngành (Y khoa 23, Răng-Hàm-Mặt 23, Y học cổ truyền & Dược học 21, Điều dưỡng và
 * nhóm liên quan 19, Luật 18, các ngành còn lại 18 — thang 30) đã verified từ 1 bài công bố chính
 * thức. Chưa có `Page` riêng (chỉ data/eligibility layer, như AGU/VLU/HUIT) — chưa đủ scope dựng
 * UI calculator khi danh mục ngành, bảng ưu tiên/điểm cộng, và phương thức ĐGNL vẫn còn là
 * knowledge gap (xem `knowledgeGaps.ts`).
 */
export const nttuModule: SchoolModule = {
  id: 'nttu',
  name: 'Trường Đại học Nguyễn Tất Thành',
  shortName: 'NTTU',
  about: 'Trường đại học tư thục đa ngành tại TP.HCM, đào tạo mạnh về khối Sức khỏe (Y khoa, Răng - Hàm - Mặt, Dược học) và công nghệ - kỹ thuật.',
  year: 2026,
  status: 'researching',
  ownership: 'private',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Ngưỡng điểm sàn phương thức học bạ theo 6 nhóm ngành (khối Sức khỏe: 19-23; Luật: 18; các ngành còn lại: 18, thang 30) đã xác minh từ 1 bài công bố chính thức trên tuyensinh.ntt.edu.vn · Calculator chính xác đang chờ danh mục ngành, bảng điểm ưu tiên/điểm cộng, và phương pháp tính điểm học bạ chi tiết',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(nttuAdmissionMethods),
  },
};
