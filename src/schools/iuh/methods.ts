import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * IUH 2026 chỉ có 2 phương thức: "Xét tuyển thẳng" (theo quy chế Bộ GD-ĐT, không có công thức điểm
 * riêng — cùng quy ước HCMUT/UFM/HUTECH..., không đưa vào đây) và "Xét tuyển kết hợp" (duy nhất
 * phương thức có công thức, dùng Max(XT1,XT2,XT3) — xem `evidence.ts`).
 *
 * `exactCalculator: true` CHỈ trong phạm vi: Trụ sở chính TP.HCM, chương trình Chuẩn (ngoài Dược
 * học/Pháp luật), thí sinh KHÔNG có điểm ĐGNL ĐHQG-HCM trong hồ sơ (nhánh XT3 bị chặn bởi
 * `iuh-dgnl-top-score-unresolved` — ĐTK 2026 chưa xác định từ nguồn IUH), và KHÔNG dùng 3/7 hạng mục
 * điểm xét thưởng cần tra danh mục trường động (`iuh-bonus-school-lookup-not-modeled`). `evaluate.ts`
 * tự hạ về `partial` khi hồ sơ có điểm ĐGNL — KHÔNG âm thầm claim exact sai.
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
    applicantTypes: ['Thí sinh xét tuyển kết hợp, Trụ sở chính TP.HCM, chương trình Chuẩn, KHÔNG có điểm ĐGNL ĐHQG-HCM 2026 trong hồ sơ'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
];
