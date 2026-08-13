import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UelExplorerPage } from './UelExplorerPage';
import { uelAdmissionMethods } from './methods';

/**
 * Module UEL — research 2026-08-11 (xem docs/admission-research-2026.md). Công thức 3 thành
 * phần (ĐGNL/THPT/học bạ) đã biết đầy đủ cách quy đổi, nhưng thiếu bảng điểm cộng ngoại ngữ chi
 * tiết nên CHƯA có exact calculator — giống UIT, `status` giữ
 * 'researching' (formula phần lớn verified, info/cutoff/eligibility thật, calculator blocked).
 *
 * `eligibility`/`scoreConversion`/`exactCalculator` derive từ `uelAdmissionMethods` (batch 6,
 * workstream F) thay vì hard-code — batch 5 từng để `scoreConversion: false` dù đã thêm công cụ
 * quy đổi ĐGNL→100 thật (`dgnlConversion.ts` + UI), lệch với capability thật; derive từ method
 * descriptor tránh lặp lại loại lệch này. `admissionInfo`/`programs`/`cutoffs` không thuộc
 * `AdmissionMethodCapabilities` (capability ở mức trang/dataset, không phải phương thức tính
 * điểm) nên vẫn khai báo tay.
 */
export const uelModule: SchoolModule = {
  id: 'uel',
  name: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
  shortName: 'UEL',
  year: 2026,
  status: 'researching',
  summary:
    'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn 38 ngành, ngưỡng đầu vào, điều kiện điểm cộng) · Calculator chính xác đang chờ bảng điểm cộng ngoại ngữ',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uelAdmissionMethods),
  },
  Page: UelExplorerPage,
};
