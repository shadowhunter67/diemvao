import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uelExactCalculatorAvailable } from './exactness';
import { uelKnowledgeGaps } from './knowledgeGaps';

/** UEL 2026 — Phương thức Xét tuyển Tổng hợp: có eligibility (ngưỡng THPT) + scoreConversion
 * (ĐGNL→thang 100, công thức đơn giản ×100/1200 đã verified — xem `dgnlConversion.ts`) + priority
 * (batch 6: quy tắc giảm điểm ưu tiên khi tổng điểm cao đã verified từ nguồn chính thức — xem
 * `priorityReduction.ts`) nhưng CHƯA có bonus/exactCalculator (bảng điểm cộng ngoại ngữ chi tiết
 * vẫn thiếu — chỉ 1-2 điểm dữ liệu rời rạc, không đủ dựng bảng, xem `knowledgeGaps.ts`) — khớp
 * `uelModule.capabilities`. Chỉ 1 method vì repo hiện chỉ implement UI cho 1 phương thức thật
 * (Xét tuyển Tổng hợp) — không tạo descriptor cho phương thức khác chưa có evidence/UI. */
export const uelAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'uel-comprehensive-2026',
    schoolId: 'uel',
    name: 'Xét tuyển Tổng hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: uelExactCalculatorAvailable,
    },
    knowledgeGaps: uelKnowledgeGaps,
  },
];
