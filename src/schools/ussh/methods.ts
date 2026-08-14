import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { usshKnowledgeGaps } from './knowledgeGaps';

/**
 * USSH 2026 — re-audit 2026-08-13/14 với evidence ảnh mới (công thức + cutoff 2026). `priority:
 * true` vì công thức giảm điểm ưu tiên khi tổng ≥75 đã verified (`priorityReduction.ts`, cùng
 * pattern UEL). `scoreConversion: true` vì ĐT3 (0.9×ĐGNL+0.1×Học bạ) tính được đầy đủ, không chứa
 * α1/α2 (xem `calculator.ts`). `bonus`/`exactCalculator` vẫn `false` — bảng Điểm cộng và bảng Mức
 * điểm ưu tiên gốc theo khu vực/đối tượng chưa có evidence; ĐT1/ĐT2 blocked bởi α1 (vai trò chưa
 * rõ) + α2 (giá trị riêng ngành chưa công bố) — xem `knowledgeGaps.ts`.
 */
export const usshAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ussh-integrated-2026',
    schoolId: 'ussh',
    name: 'Xét tuyển kết hợp',
    year: 2026,
    applicantTypes: ['DT1', 'DT2', 'DT3'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: true,
      exactCalculator: false,
    },
    knowledgeGaps: usshKnowledgeGaps,
  },
];
