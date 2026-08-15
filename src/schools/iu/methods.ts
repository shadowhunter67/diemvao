import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/** IU 2026 — Phương thức 2, đối tượng "Thí sinh tốt nghiệp THPT 2026" (1.1 có ĐGNL / 1.2 không
 * có ĐGNL): công thức Điểm học lực, Điểm cộng (3 thành phần: điểm thưởng/xét thưởng/khuyến
 * khích, cap 10), Điểm ưu tiên (bảng KV/UT + công thức giảm khi ≥75) đều đã verified đầy đủ từ
 * nguồn chính thức (`sources.ts`, đọc 2026-08-14) — `exactCalculator: true` cho đối tượng này.
 *
 * KHÔNG gắn `knowledgeGaps` vào descriptor này dù `iuKnowledgeGaps` (`knowledgeGaps.ts`) vẫn còn
 * 2 mục — `auditMethods()` coi `exactCalculator: true` + `knowledgeGaps` non-empty là lỗi cứng
 * (EXACT_METHOD_HAS_UNRESOLVED_GAPS), đúng ý nghĩa: gap gắn vào method nghĩa là method đó CHƯA
 * exact. 2 mục còn lại (đối tượng 2/3 chưa hỗ trợ, Cambridge chưa có field) không thuộc phạm vi
 * method `iu-method2-2026` (đối tượng 1) — là roadmap/limitation, không phải gap của method này. */
export const iuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'iu-method2-2026',
    schoolId: 'iu',
    name: 'Phương thức 2 — Xét tuyển tổng hợp (Thí sinh tốt nghiệp THPT 2026)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    },
  },
];
