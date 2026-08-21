import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { HcmusPage } from './HcmusPage';
import { hcmusAdmissionMethods } from './methods';

/**
 * HCMUS 2026: supports real partial academic-score calculation and the official
 * 39-program registration threshold table. Final exact score remains blocked by
 * unresolved bonus and priority rules.
 */
export const hcmusModule: SchoolModule = {
  id: 'hcmus',
  name: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
  shortName: 'HCMUS',
  about:
    'Tiền thân từ năm 1941, chính thức là thành viên ĐHQG-HCM từ 1996; đào tạo các ngành khoa học cơ bản và công nghệ.',
  year: 2026,
  status: 'researching',
  summary:
    'Đã tính được Điểm học lực (MAX route THPT/ĐGNL, quy đổi ĐGNL qua bảng phân vị chính thức 2026) và đã có 39 ngưỡng đăng ký xét tuyển theo ngành · Điểm cộng và Điểm ưu tiên chưa đủ evidence để tính điểm cuối',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmusAdmissionMethods),
    partialCalculator: true,
  },
  Page: HcmusPage,
};
