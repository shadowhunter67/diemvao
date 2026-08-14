import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { HcmusPage } from './HcmusPage';
import { hcmusAdmissionMethods } from './methods';

/**
 * Module HCMUS — re-audit 2026-08-13 với evidence ảnh mới (xem docs/CHANGELOG.md batch mới nhất).
 * Đã tính được Điểm học lực THẬT (MAX route THPT/ĐGNL, quy đổi ĐGNL qua bảng phân vị 101 dòng) —
 * `partialCalculator: true`, cùng pattern UEL. Điểm cộng/Điểm ưu tiên và bảng ngưỡng 39 ngành vẫn
 * thiếu evidence nên chưa lên `exactCalculator`.
 */
export const hcmusModule: SchoolModule = {
  id: 'hcmus',
  name: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
  shortName: 'HCMUS',
  year: 2026,
  status: 'researching',
  summary:
    'Đã tính được Điểm học lực (MAX route THPT/ĐGNL, quy đổi ĐGNL qua bảng phân vị chính thức 2026) · Điểm cộng, Điểm ưu tiên và bảng ngưỡng 39 ngành chưa có evidence',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmusAdmissionMethods),
    partialCalculator: true,
  },
  Page: HcmusPage,
};
