import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { vluAdmissionMethods } from './methods';

/**
 * Module VLU (Trường Đại học Văn Lang) — research 2026-08-19/20, browser thật (chrome-devtools,
 * đọc trực tiếp `www.vlu.edu.vn`). Ngưỡng đảm bảo chất lượng đầu vào theo nhóm ngành cho Phương
 * thức 1 (thi TN THPT: 15/18/20/22) và điều kiện bổ sung cho Phương thức 2/3 (học bạ/kết hợp:
 * học lực lớp 12 + điểm thay thế cho khối Sức khỏe/Luật) đã verified từ 2 bài công bố chính thức,
 * cross-check khớp nhau. Chưa có `Page` riêng (chỉ data/eligibility layer, như AGU) — chưa đủ
 * scope dựng UI calculator khi danh mục môn thi chính, bảng ưu tiên/điểm cộng, và bảng quy đổi
 * kỳ thi kết hợp vẫn còn là knowledge gap (xem `knowledgeGaps.ts`).
 */
export const vluModule: SchoolModule = {
  id: 'vlu',
  name: 'Trường Đại học Văn Lang',
  shortName: 'VLU',
  year: 2026,
  status: 'researching',
  summary:
    'Ngưỡng đảm bảo chất lượng đầu vào theo nhóm ngành (thi TN THPT: 15/18/20/22; học bạ/kết hợp: điều kiện học lực lớp 12 + điểm thay thế khối Sức khỏe/Luật) đã xác minh từ 2 bài công bố chính thức trên vlu.edu.vn · Calculator chính xác đang chờ danh mục ngành có "môn thi chính" nhân hệ số 2, bảng điểm ưu tiên/điểm cộng, và bảng quy đổi kỳ thi kết hợp (V-ACT/HSA/TSA/V-SAT/SAT) chính thức',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(vluAdmissionMethods),
  },
};
