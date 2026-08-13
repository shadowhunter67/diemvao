import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uehKnowledgeGaps } from './knowledgeGaps';

/** UEH 2026 — Phương thức Xét tuyển tích hợp: có eligibility (ngưỡng đầu vào) + scoreConversion
 * (bảng ĐGNL→THPT verified) nhưng CHƯA có bonus/priority/exactCalculator (thiếu bảng điểm cộng
 * + bước quy đổi cuối sang thang 100) — khớp `uehModule.capabilities`. Chỉ 1 method vì UEH
 * research hiện tại (docs/admission-research-2026.md) chỉ có 1 phương thức implement thật trong
 * repo — không tạo descriptor giả cho phương thức khác chưa có UI/evidence. */
export const uehAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ueh-integrated-2026',
    schoolId: 'ueh',
    name: 'Xét tuyển tích hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: uehKnowledgeGaps,
  },
];
