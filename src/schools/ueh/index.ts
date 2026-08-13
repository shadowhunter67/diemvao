import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UehExplorerPage } from './UehExplorerPage';
import { uehAdmissionMethods } from './methods';

/**
 * Module UEH — research 2026-08-11 (xem docs/admission-research-2026.md). Có bảng quy đổi
 * ĐGNL→THPT đầy đủ và verified (hiếm — UIT/HCMUS/UEL đều thiếu phần này), nên `scoreConversion`
 * = true dù `exactCalculator` vẫn false (thiếu bước quy đổi cuối sang thang 100 + bảng điểm
 * cộng/ưu tiên).
 */
export const uehModule: SchoolModule = {
  id: 'ueh',
  name: 'Trường Đại học Kinh tế TP.HCM',
  shortName: 'UEH',
  year: 2026,
  status: 'researching',
  summary:
    'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn 97 chương trình, ngưỡng đầu vào, quy đổi ĐGNL→THPT) · Calculator chính xác đang chờ bước quy đổi cuối + bảng điểm cộng',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uehAdmissionMethods),
  },
  Page: UehExplorerPage,
};
