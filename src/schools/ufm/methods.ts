import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * UFM 2026 — 4 phương thức tính điểm (mã 200/402/416/100; PT xét thẳng mã 301 không có công thức
 * điểm, không đưa vào đây, cùng quy ước HUFLIT/HUTECH).
 *
 * Batch 2026-08-20 — đọc toàn bộ "Khung quy đổi tương đương điểm" (mục 3+3.4, Thông báo
 * 2639/TB-ĐHTCM, xem `conversionTable.ts`/`evidence.ts:ufmConversionEvidence`): CẢ 4 phương thức
 * nay `exactCalculator: true` trong phạm vi chương trình CHUẨN (hệ số Toán×2 chỉ áp dụng chương
 * trình Tiếng Anh toàn phần — `knowledgeGaps.ts:ufm-english-full-program-toan-coefficient-not-implemented`,
 * ngoài phạm vi module này).
 *
 * - `thpt`: "Điểm xét tuyển" dùng thẳng tổng thô thang 30, không qua bước quy đổi bách phân vị.
 * - `hocba`/`dgnl`/`vsat`: "Điểm xét tuyển" phải quy đổi qua bảng bách phân vị (mục 3.1/3.2/3.3)
 *   sang thang 30 trước khi cộng ưu tiên/điểm cộng (mục 4) — nay đã transcribe đầy đủ + verify khớp
 *   ví dụ minh họa chính thức của văn bản, KHÔNG còn `unavailable`/`partial`.
 *
 * KHÔNG gắn `knowledgeGaps` vào descriptor nào (`auditMethods()` coi `exactCalculator:true` +
 * `knowledgeGaps` non-empty là lỗi EXACT_METHOD_HAS_UNRESOLVED_GAPS) — 3 gap còn lại của UFM
 * (`knowledgeGaps.ts`) đều KHÔNG chặn exact cho phạm vi chương trình Chuẩn.
 */
export const ufmAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ufm-thpt-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả thi tốt nghiệp THPT 2026 (mã PT 100)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
  {
    id: 'ufm-hocba-2026',
    schoolId: 'ufm',
    name: 'Xét học bạ THPT (mã PT 200)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
  {
    id: 'ufm-vsat-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả V-SAT 2026 (mã PT 416)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-SAT 2026, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
  {
    id: 'ufm-dgnl-2026',
    schoolId: 'ufm',
    name: 'Xét kết quả ĐGNL ĐHQG TP.HCM 2026 (mã PT 402)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
];
