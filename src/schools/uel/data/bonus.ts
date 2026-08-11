import { UEL_BONUS_OVERALL_CAP, UEL_PRIORITY_SCHOOL_BONUS } from './thresholds';

/**
 * Điểm cộng UEL 2026 mới xác nhận được 1/nhiều nhóm: học sinh 149 trường THPT ưu tiên ĐHQG-HCM,
 * mức cố định +5/100 (nguồn: tuyensinh.uel.edu.vn, thông tin tuyển sinh 2026). Nhóm chứng chỉ
 * ngoại ngữ quốc tế (IELTS ≥5.0 tương đương trở lên) CÓ tồn tại (nguồn: VnExpress dẫn "Phụ lục
 * 2" của trường, biết khoảng 2–5 điểm/100) nhưng bảng quy đổi chi tiết theo từng mức chứng chỉ
 * chỉ tồn tại dạng ảnh chưa đọc được — KHÔNG đưa vào như một category có số cụ thể để tránh hiển
 * thị sai; xem UelExplorerPage.tsx phần cảnh báo.
 */
export type UelBonusCategoryId = 'priority-school';

export interface UelBonusCategory {
  id: UelBonusCategoryId;
  maxPoints: number;
  label: string;
  description: string;
}

export const UEL_BONUS_CATEGORIES: UelBonusCategory[] = [
  {
    id: 'priority-school',
    maxPoints: UEL_PRIORITY_SCHOOL_BONUS,
    label: 'Học sinh trường THPT ưu tiên ĐHQG-HCM',
    description: 'Thuộc danh sách 149 trường THPT ưu tiên ĐHQG-HCM, tốt nghiệp đúng năm 2026.',
  },
];

export { UEL_BONUS_OVERALL_CAP };
