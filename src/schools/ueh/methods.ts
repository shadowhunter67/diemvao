import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uehKnowledgeGaps } from './knowledgeGaps';

/** UEH 2026 — Phương thức Xét tuyển tích hợp: re-audit 2026-08-13 nâng lên exactCalculator=true
 * cho Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam) — nguồn `ueh-ksa-ksv-info-2026` công bố đủ
 * worked example + bảng điểm cộng/ưu tiên đầy đủ để không còn "gap" nào block công thức, xem
 * `evidence.ts`/`calculator.ts`. `applicantTypes` đánh dấu rõ scope — Đối tượng 2 (THPT nước
 * ngoài) KHÔNG nằm trong applicantTypes vì cấu trúc học bạ khác chưa implement (xem
 * `scopeNotes.ts`), không phải vì thiếu dữ liệu. Chỉ 1 method vì UEH research hiện tại chỉ có 1
 * phương thức implement thật trong repo. */
export const uehAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ueh-integrated-2026',
    schoolId: 'ueh',
    name: 'Xét tuyển tích hợp',
    year: 2026,
    applicantTypes: ['Đối tượng 1 — thí sinh tốt nghiệp THPT Việt Nam'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    },
    knowledgeGaps: uehKnowledgeGaps,
  },
];
