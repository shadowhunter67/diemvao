import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * IUH 2026 chỉ có 2 phương thức: "Xét tuyển thẳng" (theo quy chế Bộ GD-ĐT, không có công thức điểm
 * riêng — cùng quy ước HCMUT/UFM/HUTECH..., không đưa vào đây) và "Xét tuyển kết hợp" (duy nhất
 * phương thức có công thức, dùng Max(XT1,XT2,XT3) — xem `evidence.ts`).
 *
 * `exactCalculator: true` — batch 2026-08-20 đóng gap ĐTK 2026 (`calculator.ts:IUH_DTK_2026` = 1139,
 * cross-check 2 nguồn độc lập: ĐHQG-HCM chính thức + UFM), nên nhánh XT3 (ĐGNL) NAY ĐÃ tính được, kể
 * cả thí sinh CÓ điểm ĐGNL trong hồ sơ. Phạm vi còn lại: Trụ sở chính TP.HCM, chương trình Chuẩn
 * (ngoài Dược học/Pháp luật), KHÔNG dùng 3/7 hạng mục điểm xét thưởng cần tra danh mục trường động
 * (`iuh-bonus-school-lookup-not-modeled`).
 *
 * KHÔNG gắn `knowledgeGaps` vào descriptor này dù có gap score-affecting thật (cùng quy ước UFM/
 * HUTECH — `auditMethods()` coi `exactCalculator:true` + `knowledgeGaps` non-empty là lỗi
 * EXACT_METHOD_HAS_UNRESOLVED_GAPS; gap được evaluator xử lý bằng cách hạ `confidence` tại runtime
 * thay vì khai báo tĩnh ở đây). Toàn bộ gap xem `knowledgeGaps.ts`.
 */
export const iuhAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'iuh-combined-2026',
    schoolId: 'iuh',
    name: 'Xét tuyển kết hợp (Trụ sở chính TP.HCM, chương trình Chuẩn)',
    year: 2026,
    applicantTypes: ['Thí sinh xét tuyển kết hợp, Trụ sở chính TP.HCM, chương trình Chuẩn'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
];
