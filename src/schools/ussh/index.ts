import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UsshPage } from './UsshPage';
import { usshAdmissionMethods } from './methods';

/**
 * Module USSH — re-audit 2026-08-13/14 với evidence ảnh mới (công thức + cutoff 2026, 54 chương
 * trình 3 track: Chuẩn/Liên kết 2+2/Chuẩn quốc tế). ĐT3 tính được đầy đủ (partialCalculator) —
 * ĐT1/ĐT2 vẫn blocked bởi α1 (vai trò chưa rõ trong công thức hiển thị) + α2 (giá trị riêng ngành
 * chưa công bố). `programs`/`cutoffs` = true vì đã có registry 54 chương trình + 162 cutoff record.
 */
export const usshModule: SchoolModule = {
  id: 'ussh',
  name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
  shortName: 'USSH',
  year: 2026,
  status: 'researching',
  summary:
    'Đã có điểm chuẩn 2026 đầy đủ (54 chương trình × ĐT01/ĐT02/ĐT03) và tính được ĐT3 (90%ĐGNL+10%Học bạ) · ĐT1/ĐT2 và Điểm cộng/Điểm ưu tiên vẫn thiếu evidence (α1/α2)',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(usshAdmissionMethods),
    partialCalculator: true,
  },
  Page: UsshPage,
};
