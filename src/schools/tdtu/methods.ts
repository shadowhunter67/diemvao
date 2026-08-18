import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * TDTU 2026 — 2 phương thức độc lập, thang điểm khác nhau, KHÔNG dùng chung 1 descriptor.
 *
 * `tdtu-pt1-2026` (Xét tuyển tổng hợp, thang 100): Điểm năng lực (Đối tượng 1.1 — học sinh lớp 12
 * tốt nghiệp THPT 2026) + Điểm cộng (Phụ lục 6+7, ĐẦY ĐỦ) + Điểm ưu tiên (Phụ lục 5, ĐẦY ĐỦ) đều
 * verified từ trang chính thức (HTML text, không phải PDF quét) — `exactCalculator: true` cho
 * PHẠM VI Đối tượng 1.1. Các đối tượng 1.2-1.5 và ngưỡng đầu vào riêng theo ngành CHƯA implement
 * (`knowledgeGaps.ts`) — giống lý do USSH/IU KHÔNG gắn `knowledgeGaps` vào descriptor exact này
 * (auditMethods() coi exactCalculator:true + knowledgeGaps non-empty là lỗi
 * EXACT_METHOD_HAS_UNRESOLVED_GAPS — gap còn lại là roadmap cho phạm vi rộng hơn, không phải lỗi
 * trong phạm vi Đối tượng 1.1 đã claim).
 *
 * `tdtu-pt2-dgnl-2026` (Xét theo ĐGNL ĐHQG-HCM, thang 1200): Điểm xét tuyển = Tổng điểm ĐGNL +
 * Điểm ưu tiên — công thức đơn giản, verified đầy đủ, áp dụng MỌI ngành (không có Điểm cộng ở
 * phương thức này) — cũng `exactCalculator: true`.
 *
 * Cả 2 phương thức: `eligibility` chỉ kiểm tra được ngưỡng CHUNG (15/30 Bộ GDĐT cho PT1); ngưỡng
 * riêng theo ngành do TDTU công bố chưa có dữ liệu — evaluator trả `eligibility.status: 'unknown'`
 * khi đạt ngưỡng chung thay vì 'eligible' (không overclaim).
 */
export const tdtuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'tdtu-pt1-2026',
    schoolId: 'tdtu',
    name: 'Xét tuyển tổng hợp (Phương thức 1)',
    year: 2026,
    applicantTypes: ['Đối tượng 1.1 — học sinh lớp 12, tốt nghiệp THPT 2026'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    },
  },
  {
    id: 'tdtu-pt2-dgnl-2026',
    schoolId: 'tdtu',
    name: 'Xét theo kết quả ĐGNL ĐHQG-HCM (Phương thức 2)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả ĐGNL ĐHQG-HCM 2026'],
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: true,
      exactCalculator: true,
    },
  },
];
