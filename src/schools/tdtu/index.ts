import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { tdtuAdmissionMethods } from './methods';

/**
 * Module TDTU (trường thứ 12) — research 2026-08-18 (batch expansion). Trang "Phương thức tuyển
 * sinh năm 2026" (`sources.ts:tdtu-admission-plan-2026`) là HTML text đọc trực tiếp được, công bố
 * đầy đủ công thức PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL, thang
 * 1200) — cả 2 đều `exactCalculator: true` trong phạm vi đã implement. Phụ lục 5/6/7 (PDF, text
 * layer đọc được) xác nhận đầy đủ bảng điểm ưu tiên/điểm thưởng/điểm xét thưởng. Danh mục 119
 * ngành + tổ hợp cụ thể (Phụ lục 2) CHƯA import — evaluator nhận tổ hợp trực tiếp từ caller, không
 * tra được ngành nào dùng tổ hợp/ngưỡng riêng nào (`knowledgeGaps.ts`). Chưa có `Page` riêng (chỉ
 * data/audit layer, giống HCMUTE/AGU).
 */
export const tdtuModule: SchoolModule = {
  id: 'tdtu',
  name: 'Trường Đại học Tôn Đức Thắng',
  shortName: 'TDTU',
  year: 2026,
  status: 'researching',
  summary:
    'Điểm xét tuyển PT1 (Xét tuyển tổng hợp, thang 100, Đối tượng 1.1) và PT2 (Xét theo ĐGNL ĐHQG-HCM, thang 1200) đều tính CHÍNH XÁC từ công thức chính thức (Điểm năng lực/Điểm cộng/Điểm ưu tiên đầy đủ) · Ngưỡng đầu vào riêng theo 119 ngành/chương trình và Đối tượng 1.2-1.5 chưa import',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(tdtuAdmissionMethods),
  },
};
