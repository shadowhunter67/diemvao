import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { tdtuAdmissionMethods } from './methods';

/**
 * Module TDTU (trường thứ 12) — research 2026-08-18 (batch expansion). Trang "Phương thức tuyển
 * sinh năm 2026" (`sources.ts:tdtu-admission-plan-2026`) là HTML text đọc trực tiếp được, công bố
 * đầy đủ công thức PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL, thang
 * 1200) — cả 2 đều `exactCalculator: true` trong phạm vi đã implement. Phụ lục 5/6/7 (PDF, text
 * layer đọc được) xác nhận đầy đủ bảng điểm ưu tiên/điểm thưởng/điểm xét thưởng. Danh mục 119
 * ngành/chương trình (Phụ lục 2, `data/programs.ts`) ĐÃ import đủ 119/119 (id/mã ngành/tên ngành/
 * nhóm chương trình) — nhưng tổ hợp xét tuyển và ngưỡng đầu vào RIÊNG theo từng ngành CHƯA import
 * (bảng gốc bị ngắt trang giữa ô multi-combo, không đủ tin cậy để gán tự động — xem
 * `knowledgeGaps.ts`); evaluator vẫn nhận tổ hợp trực tiếp từ caller. Chưa có `Page` riêng (chỉ
 * data/audit layer, giống HCMUTE/AGU) — danh mục ngành được dùng qua `compare/programCatalog.ts`
 * (chọn ngành ở trang `/compare`), không qua UI riêng của TDTU.
 */
export const tdtuModule: SchoolModule = {
  id: 'tdtu',
  name: 'Trường Đại học Tôn Đức Thắng',
  shortName: 'TDTU',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL ĐHQG-HCM, thang 1200) đều tính CHÍNH XÁC từ công thức chính thức (Điểm năng lực/Điểm cộng/Điểm ưu tiên đầy đủ) · Danh mục 119 ngành/chương trình đã có (tên/mã ngành) · Tổ hợp và ngưỡng đầu vào riêng theo ngành, Đối tượng 1.2-1.5 chưa import',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(tdtuAdmissionMethods),
  },
};
