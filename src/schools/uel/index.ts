import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UelExplorerPage } from './UelExplorerPage';
import { uelAdmissionMethods } from './methods';

/**
 * Module UEL — research 2026-08-11 (xem docs/admission-research-2026.md). Công thức 3 thành
 * phần (ĐGNL/THPT/học bạ) đã biết đầy đủ cách quy đổi. Batch provenance-hygiene (2026-08-17)
 * phát hiện `status` ở đây vẫn `'researching'` dù `uelExactCalculatorAvailable` (`exactness.ts`)
 * đã `true` từ re-audit 2026-08-15 (bảng điểm cộng chứng chỉ ngoại ngữ đã lộ ra công khai trên
 * trang "Tổ hợp tuyển sinh" HTML, xem `knowledgeGaps.ts` — `uelKnowledgeGaps` rỗng từ batch đó) —
 * `status`/`summary` KHÔNG được cập nhật theo dù `capabilities.exactCalculator` đã derive `true`
 * ngay bên dưới, khiến LandingPage hiện "○ Đang bổ sung dữ liệu" cho 1 trường thực ra đã tính
 * exact được (đã có golden/domain conformance coverage, xem `docs/architecture.md` Batch 18).
 * Sửa `status` → `'supported'` khớp `capabilities.exactCalculator: true` thật — KHÔNG đổi công
 * thức/rule nào, chỉ đồng bộ metadata với implementation đã verified.
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
  status: 'supported',
  summary:
    'Dữ liệu tuyển sinh 2026 đầy đủ (điểm chuẩn 38 ngành, ngưỡng đầu vào, điều kiện điểm cộng) · Calculator chính xác đủ cả 3 đối tượng (DT1/DT2/DT3), gồm bảng điểm cộng chứng chỉ ngoại ngữ đã verified',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: true,
    ...aggregateSchoolCapabilities(uelAdmissionMethods),
  },
  Page: UelExplorerPage,
};
