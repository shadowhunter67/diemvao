import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hutechKnowledgeGaps } from './knowledgeGaps';

const hocbaGap = hutechKnowledgeGaps.filter((gap) => gap.id === 'hutech-hocba-semester-granularity-gap');
const vsatGap = hutechKnowledgeGaps.filter((gap) => gap.id === 'hutech-vsat-scale-conflicting');

/**
 * HUTECH 2026 — 4 phương thức xét tuyển (tên mô tả thay vì số hiệu PT, xem `sources.ts` lý do).
 *
 * `exactCalculator: true` cho thpt/dgnl, theo đúng semantics conditional-exact đã dùng ở
 * USSH/IU/TDTU/HUFLIT: exact trong phạm vi thí sinh KHÔNG có thành tích cộng điểm (bảng điểm
 * thưởng/khuyến khích CHƯA tìm được nguồn, xem `knowledgeGaps.ts`). KHÔNG gắn `knowledgeGaps` vào 2
 * descriptor này (cùng lý do USSH/IU/TDTU/HUFLIT — `auditMethods()` coi `exactCalculator:true` +
 * `knowledgeGaps` non-empty là lỗi EXACT_METHOD_HAS_UNRESOLVED_GAPS).
 *
 * `hocba` giữ `exactCalculator: false` — khoảng cách độ chi tiết dữ liệu (6 học kỳ vs TB năm dùng
 * chung, xem `knowledgeGaps.ts:hutech-hocba-semester-granularity-gap`) chặn exact, KHÔNG phải thiếu
 * điểm cộng. `vsat` giữ eligibility-only — thang điểm/công thức quy đổi chưa xác định rõ ràng
 * (`knowledgeGaps.ts:hutech-vsat-scale-conflicting`).
 */
export const hutechAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hutech-thpt-2026',
    schoolId: 'hutech',
    name: 'Xét kết quả thi tốt nghiệp THPT 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026, không có thành tích cộng điểm'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
  {
    id: 'hutech-hocba-2026',
    schoolId: 'hutech',
    name: 'Xét học bạ THPT (6 học kỳ)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT, không có thành tích cộng điểm'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: hocbaGap,
  },
  {
    id: 'hutech-vsat-2026',
    schoolId: 'hutech',
    name: 'Xét kết quả V-SAT 2026',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-SAT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vsatGap,
  },
  {
    id: 'hutech-dgnl-2026',
    schoolId: 'hutech',
    name: 'Xét kết quả ĐGNL ĐHQG TP.HCM 2026',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
];
