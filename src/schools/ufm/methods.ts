import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { ufmKnowledgeGaps } from './knowledgeGaps';

const hocbaGap = ufmKnowledgeGaps.filter((gap) => gap.id === 'ufm-hocba-semester-granularity-gap');
const vsatGap = ufmKnowledgeGaps.filter((gap) => gap.id === 'ufm-vsat-scale-unconfirmed');

/**
 * UFM 2026 — 4 phương thức tính điểm (mã 200/402/416/100; PT xét thẳng mã 301 không có công thức
 * điểm, không đưa vào đây, cùng quy ước HUFLIT/HUTECH).
 *
 * `exactCalculator: true` cho thpt/dgnl, phạm vi chương trình CHUẨN (KHÔNG phải "Tiếng Anh toàn
 * phần" — hệ số Toán×2 của chương trình đó chưa xác nhận rõ, xem
 * `knowledgeGaps.ts:ufm-math-coefficient-scope-conflicting`) và thí sinh KHÔNG có thành tích cộng
 * điểm. KHÔNG gắn `knowledgeGaps` vào 2 descriptor này (cùng lý do các trường trước —
 * `auditMethods()` coi `exactCalculator:true` + `knowledgeGaps` non-empty là lỗi
 * EXACT_METHOD_HAS_UNRESOLVED_GAPS).
 *
 * `hocba` giữ `exactCalculator: false` — granularity gap (5 học kỳ vs TB năm dùng chung) CHẶN
 * exact. `vsat` giữ eligibility-only — thang điểm/công thức quy đổi chưa xác định.
 */
export const ufmAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ufm-thpt-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả thi tốt nghiệp THPT 2026 (mã PT 100)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026, chương trình Chuẩn, không có thành tích cộng điểm'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
  {
    id: 'ufm-hocba-2026',
    schoolId: 'ufm',
    name: 'Xét học bạ THPT (mã PT 200)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT, không có thành tích cộng điểm'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: hocbaGap,
  },
  {
    id: 'ufm-vsat-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả V-SAT 2026 (mã PT 416)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-SAT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vsatGap,
  },
  {
    id: 'ufm-dgnl-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả ĐGNL ĐHQG TP.HCM 2026 (mã PT 402)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026, chương trình Chuẩn, không có thành tích cộng điểm'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
];
