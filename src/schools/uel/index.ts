import type { SchoolModule } from '../../core/schoolModule';
import { UelExplorerPage } from './UelExplorerPage';

/**
 * Module UEL — research 2026-08-11 (xem docs/admission-research-2026.md). Công thức 3 thành
 * phần (ĐGNL/THPT/học bạ) đã biết đầy đủ cách quy đổi, nhưng thiếu bảng điểm cộng ngoại ngữ chi
 * tiết + quy tắc giảm điểm ưu tiên nên CHƯA có exact calculator — giống UIT, `status` giữ
 * 'researching' (formula phần lớn verified, info/cutoff/eligibility thật, calculator blocked).
 */
export const uelModule: SchoolModule = {
  id: 'uel',
  name: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
  shortName: 'UEL',
  year: 2026,
  status: 'researching',
  summary:
    'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn 38 ngành, ngưỡng đầu vào, điều kiện điểm cộng) · Calculator chính xác đang chờ bảng điểm cộng ngoại ngữ + quy tắc ưu tiên',
  capabilities: {
    admissionInfo: true,
    programs: true,
    eligibility: true,
    cutoffs: true,
    scoreConversion: false,
    exactCalculator: false,
  },
  Page: UelExplorerPage,
};
