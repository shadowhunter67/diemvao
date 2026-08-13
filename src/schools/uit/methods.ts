import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uitKnowledgeGaps } from './knowledgeGaps';

/** UIT 2026 — Phương thức Xét tuyển Tổng hợp: có eligibility (ngưỡng THPT/ĐGNL/chứng chỉ) +
 * bonus (bảng điểm cộng đầy đủ, đọc được nguyên văn — `bonus.ts`, Level C exact theo
 * `docs/admission-research-2026.md`) nhưng CHƯA có scoreConversion/priority/exactCalculator
 * (thiếu công thức bách phân vị quy đổi THPT↔ĐGNL, cách tính học bạ, quy đổi SAT/ACT/IB/A-Level)
 * — khớp `uitModule.capabilities`. */
export const uitAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'uit-comprehensive-2026',
    schoolId: 'uit',
    name: 'Xét tuyển Tổng hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: false,
      bonus: true,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: uitKnowledgeGaps,
  },
];
