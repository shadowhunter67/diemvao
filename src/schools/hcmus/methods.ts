import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmusKnowledgeGaps } from './knowledgeGaps';

/**
 * HCMUS 2026 — Phương thức 2 (THPT hoặc ĐGNL kết hợp học bạ 3 năm): re-audit 2026-08-13 với evidence
 * ảnh mới (công thức Điểm học lực + bảng quy đổi phân vị ĐGNL↔THPT đầy đủ). `scoreConversion: true`
 * (bảng quy đổi 101 dòng đã verified, xem `dgnlConversion.ts`) — `bonus`/`priority` vẫn `false`
 * (bảng Điểm cộng + công thức Điểm ưu tiên chưa có evidence, xem `knowledgeGaps.ts`), nên
 * `exactCalculator` vẫn `false`. Điểm học lực (route MAX) tính được thật trên input người dùng —
 * xem `hcmusModule.capabilities.partialCalculator`.
 */
export const hcmusAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmus-method2-2026',
    schoolId: 'hcmus',
    name: 'Phương thức 2 — THPT/ĐGNL kết hợp học bạ',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
    knowledgeGaps: hcmusKnowledgeGaps,
  },
];
