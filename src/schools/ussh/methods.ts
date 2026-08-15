import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * USSH 2026 — re-audit 2026-08-15 với PDF chính thức "Thông tin tuyển sinh năm 2026" (36 trang,
 * text layer, xác nhận độc lập lần 2 bởi thông báo "Một số lưu ý..."). Công thức ĐHL1/ĐHL2/ĐHL3
 * KHÔNG chứa α (α chỉ dùng nội bộ để trường xác định điểm chuẩn theo tổ hợp, không phải input tính
 * điểm cá nhân — xem `calculator.ts`). `exactCalculator: true` cho PHẠM VI thí sinh KHÔNG có thành
 * tích được cộng điểm (ĐC=0, supported-scope exactness) — thí sinh CÓ thành tích cộng điểm vẫn
 * partial vì mức cộng cụ thể theo tiêu chí chưa công bố (`bonus.ts`, `knowledgeGaps.ts`).
 *
 * KHÔNG gắn `knowledgeGaps: usshKnowledgeGaps` vào descriptor này — cùng lý do với
 * `schools/iu/methods.ts`: `auditMethods()` coi `exactCalculator: true` + `knowledgeGaps` non-
 * empty là lỗi cứng (EXACT_METHOD_HAS_UNRESOLVED_GAPS). Gap còn lại (mức cộng theo tiêu chí) không
 * thuộc phạm vi "không có thành tích" đã exact — là roadmap/limitation cho phạm vi rộng hơn.
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
      bonus: true,
      priority: true,
      exactCalculator: true,
    },
  },
];
