import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * HUFLIT 2026 — 3 phương thức tính điểm (PT4 xét thẳng không có công thức điểm, không đưa vào
 * đây). Công thức PT1/PT2 (tổng thô 3 môn) + ngưỡng cả 3 phương thức đều verified (kể cả re-audit
 * xác nhận ngưỡng PT1 KHÔNG còn "sẽ công bố sau" — đã có Thông báo 09/7/2026).
 *
 * `exactCalculator: true` cho CẢ 3, theo đúng semantics conditional-exact đã dùng ở USSH/IU/TDTU:
 * PT1/PT2 exact trong phạm vi thí sinh KHÔNG có thành tích cộng điểm (ĐC=0 — bảng điểm
 * thưởng/khuyến khích cụ thể CHƯA tìm được nguồn, xem `knowledgeGaps.ts`); PT3 (ĐGNL) exact toàn
 * bộ vì công thức không có thành phần điểm cộng. KHÔNG gắn `knowledgeGaps` vào descriptor (cùng lý
 * do USSH/IU/TDTU — `auditMethods()` coi `exactCalculator:true` + `knowledgeGaps` non-empty là lỗi
 * EXACT_METHOD_HAS_UNRESOLVED_GAPS; gap bảng thưởng là roadmap cho phạm vi rộng hơn, không phải
 * lỗi trong phạm vi đã claim).
 */
export const huflitAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'huflit-pt1-thpt-2026',
    schoolId: 'huflit',
    name: 'Xét kết quả thi tốt nghiệp THPT (Phương thức 1)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026, không có thành tích cộng điểm'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
  {
    id: 'huflit-pt2-hocba-2026',
    schoolId: 'huflit',
    name: 'Xét kết quả học tập THPT / học bạ (Phương thức 2)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT, không có thành tích cộng điểm'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
  {
    id: 'huflit-pt3-dgnl-2026',
    schoolId: 'huflit',
    name: 'Xét kết quả ĐGNL ĐHQG TP.HCM (Phương thức 3)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
];
