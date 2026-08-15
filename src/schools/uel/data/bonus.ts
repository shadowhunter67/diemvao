import { UEL_BONUS_OVERALL_CAP, UEL_PRIORITY_SCHOOL_BONUS } from './thresholds';

/**
 * Điểm cộng UEL 2026 mới xác nhận được 1/nhiều nhóm: học sinh 149 trường THPT ưu tiên ĐHQG-HCM,
 * mức cố định +5/100 (nguồn: tuyensinh.uel.edu.vn, thông tin tuyển sinh 2026). Nhóm chứng chỉ
 * ngoại ngữ quốc tế (IELTS ≥5.0 tương đương trở lên) CÓ tồn tại (nguồn: VnExpress dẫn "Phụ lục
 * 2" của trường, biết khoảng 2–5 điểm/100) nhưng bảng quy đổi chi tiết theo từng mức chứng chỉ
 * chỉ tồn tại dạng ảnh chưa đọc được — KHÔNG đưa vào như một category có số cụ thể để tránh hiển
 * thị sai; xem UelExplorerPage.tsx phần cảnh báo.
 */
export type UelBonusCategoryId =
  | 'priority-school'
  | 'ielts-5-0'
  | 'ielts-5-5'
  | 'ielts-6-0-plus'
  | 'toefl-ibt-45-47'
  | 'toefl-ibt-48-50'
  | 'toefl-ibt-51-53'
  | 'toefl-ibt-54-56'
  | 'toefl-ibt-57-58'
  | 'toefl-ibt-59-61'
  | 'toefl-ibt-62-65'
  | 'toefl-ibt-66-69'
  | 'toefl-ibt-70-73'
  | 'toefl-ibt-74-77'
  | 'toefl-ibt-78-plus'
  | 'toeic-550-565'
  | 'toeic-570-590'
  | 'toeic-595-615'
  | 'toeic-620-640'
  | 'toeic-645-665'
  | 'toeic-670-680'
  | 'toeic-685-705'
  | 'toeic-710-730'
  | 'toeic-735-755'
  | 'toeic-760-780'
  | 'toeic-785-plus';

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
  { id: 'ielts-5-0', maxPoints: 2, label: 'IELTS Academic 5.0', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'ielts-5-5', maxPoints: 3.5, label: 'IELTS Academic 5.5', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'ielts-6-0-plus', maxPoints: 5, label: 'IELTS Academic tu 6.0', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-45-47', maxPoints: 2, label: 'TOEFL iBT 45-47', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-48-50', maxPoints: 2.3, label: 'TOEFL iBT 48-50', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-51-53', maxPoints: 2.6, label: 'TOEFL iBT 51-53', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-54-56', maxPoints: 2.9, label: 'TOEFL iBT 54-56', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-57-58', maxPoints: 3.2, label: 'TOEFL iBT 57-58', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-59-61', maxPoints: 3.5, label: 'TOEFL iBT 59-61', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-62-65', maxPoints: 3.8, label: 'TOEFL iBT 62-65', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-66-69', maxPoints: 4.1, label: 'TOEFL iBT 66-69', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-70-73', maxPoints: 4.4, label: 'TOEFL iBT 70-73', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-74-77', maxPoints: 4.7, label: 'TOEFL iBT 74-77', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toefl-ibt-78-plus', maxPoints: 5, label: 'TOEFL iBT tu 78', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-550-565', maxPoints: 2, label: 'TOEIC Nghe doc 550-565', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-570-590', maxPoints: 2.3, label: 'TOEIC Nghe doc 570-590', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-595-615', maxPoints: 2.6, label: 'TOEIC Nghe doc 595-615', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-620-640', maxPoints: 2.9, label: 'TOEIC Nghe doc 620-640', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-645-665', maxPoints: 3.2, label: 'TOEIC Nghe doc 645-665', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-670-680', maxPoints: 3.5, label: 'TOEIC Nghe doc 670-680', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-685-705', maxPoints: 3.8, label: 'TOEIC Nghe doc 685-705', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-710-730', maxPoints: 4.1, label: 'TOEIC Nghe doc 710-730', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-735-755', maxPoints: 4.4, label: 'TOEIC Nghe doc 735-755', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-760-780', maxPoints: 4.7, label: 'TOEIC Nghe doc 760-780', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
  { id: 'toeic-785-plus', maxPoints: 5, label: 'TOEIC Nghe doc tu 785', description: 'Quy doi chung chi tieng Anh UEL 2026.' },
];

export { UEL_BONUS_OVERALL_CAP };
