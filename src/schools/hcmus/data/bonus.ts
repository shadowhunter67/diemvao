/**
 * Bảng "Điểm cộng" Phương thức 2 (2026) — nguồn ảnh "BẢNG ĐIỂM CỘNG PHƯƠNG THỨC 2 TUYỂN SINH TRÌNH
 * ĐỘ ĐẠI HỌC NĂM 2026" đính kèm trang tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/ (xem
 * `sources.ts`, id 'hcmus-bonus-table-2026'), đọc trực tiếp 15 dòng thang điểm cơ sở (thang 30).
 * Quy tắc đã xác nhận từ chính trang: (1) thí sinh chỉ được cộng 01 loại điểm cộng cao nhất —
 * KHÔNG cộng dồn; (2) điểm cộng bằng điểm cộng cơ sở khi tổng điểm đạt được < 28,5 (thang 30);
 * (3) khi tổng điểm đạt được ≥ 28,5, điểm cộng = [(30 − tổng điểm đạt được) / 1.5] × điểm cộng cơ
 * sở; (4) điểm xét (gồm cả điểm cộng, điểm ưu tiên) không vượt quá 30 (thang 30).
 */
export type HcmusBonusCategoryId =
  | 'national-international-olympiad-first-second-third'
  | 'national-tech-competition-first-second-third'
  | 'national-international-olympiad-encouragement'
  | 'national-tech-competition-fourth'
  | 'provincial-olympiad-first-second'
  | 'provincial-olympiad-third'
  | 'provincial-tech-competition-first-second'
  | 'provincial-tech-competition-third'
  | 'icpc-champion-first-second'
  | 'icpc-third-encouragement'
  | 'olympic-30-4-gold-silver'
  | 'olympic-30-4-bronze'
  | 'priority-school-graduate-specialized-2026'
  | 'priority-school-graduate-non-specialized-2026'
  | 'priority-school-graduate-mixed-2026';

export interface HcmusBonusCategory {
  id: HcmusBonusCategoryId;
  /** Điểm cộng cơ sở, thang 30 — trước khi áp công thức giảm khi tổng điểm ≥ 28,5. */
  basePoints30: number;
  label: string;
}

export const HCMUS_BONUS_CATEGORIES_2026: HcmusBonusCategory[] = [
  { id: 'national-international-olympiad-first-second-third', basePoints30: 1.5, label: 'Giải Nhất/Nhì/Ba kỳ thi chọn HSG quốc gia/quốc tế các môn được cộng điểm' },
  { id: 'national-tech-competition-first-second-third', basePoints30: 1.5, label: 'Giải Nhất/Nhì/Ba cuộc thi KHKT cấp quốc gia, nội dung thuộc đúng ngành/ngành gần với ngành đăng ký xét tuyển' },
  { id: 'national-international-olympiad-encouragement', basePoints30: 1.0, label: 'Giải Khuyến khích kỳ thi chọn HSG quốc gia/quốc tế các môn được cộng điểm' },
  { id: 'national-tech-competition-fourth', basePoints30: 1.0, label: 'Giải Tư cuộc thi KHKT cấp quốc gia, nội dung thuộc đúng ngành/ngành gần với ngành đăng ký xét tuyển' },
  { id: 'provincial-olympiad-first-second', basePoints30: 0.75, label: 'Học sinh giỏi cấp tỉnh/TP trực thuộc trung ương đoạt giải Nhất, Nhì đối với các môn (*)' },
  { id: 'provincial-olympiad-third', basePoints30: 0.5, label: 'Học sinh giỏi cấp tỉnh/TP trực thuộc trung ương đoạt giải Ba đối với các môn (*)' },
  { id: 'provincial-tech-competition-first-second', basePoints30: 0.75, label: 'Giải Nhất, Nhì cuộc thi KHKT cấp tỉnh/TP trực thuộc trung ương, thuộc đúng ngành/ngành gần với ngành đăng ký xét tuyển' },
  { id: 'provincial-tech-competition-third', basePoints30: 0.5, label: 'Giải Ba cuộc thi KHKT cấp tỉnh/TP trực thuộc trung ương, thuộc đúng ngành/ngành gần với ngành đăng ký xét tuyển' },
  { id: 'icpc-champion-first-second', basePoints30: 1.5, label: 'Giải Vô địch, Nhất, Nhì cuộc thi lập trình ICPC THPT quốc gia/quốc tế' },
  { id: 'icpc-third-encouragement', basePoints30: 1.0, label: 'Giải Ba, Khuyến khích cuộc thi lập trình ICPC THPT quốc gia/quốc tế' },
  { id: 'olympic-30-4-gold-silver', basePoints30: 0.75, label: 'Huy chương Vàng, Bạc kỳ thi Olympic 30/4 các môn (*)' },
  { id: 'olympic-30-4-bronze', basePoints30: 0.5, label: 'Huy chương Đồng kỳ thi Olympic 30/4 các môn (*)' },
  {
    id: 'priority-school-graduate-specialized-2026',
    basePoints30: 0.25,
    label: 'Tốt nghiệp 2026, học cả 3 năm lớp 10-11-12 tại trường chuyên/năng khiếu thuộc danh sách 149 trường ĐHQG-HCM ưu tiên và đạt kết quả học tập loại Tốt 3 năm',
  },
  {
    id: 'priority-school-graduate-non-specialized-2026',
    basePoints30: 0.15,
    label: 'Tốt nghiệp 2026, học cả 3 năm lớp 10-11-12 tại trường không chuyên/không năng khiếu thuộc danh sách 149 trường ĐHQG-HCM ưu tiên và đạt kết quả học tập loại Tốt 3 năm',
  },
  {
    id: 'priority-school-graduate-mixed-2026',
    basePoints30: 0.15,
    label: 'Tốt nghiệp 2026, học 3 năm lớp 10-11-12 vừa thuộc trường chuyên/năng khiếu vừa thuộc trường không chuyên/không năng khiếu trong danh sách 149 trường ĐHQG-HCM ưu tiên và đạt kết quả học tập loại Tốt 3 năm',
  },
];

/** Ngưỡng tổng điểm đạt được (thang 30) mà từ đó điểm cộng bắt đầu bị giảm theo công thức. */
export const HCMUS_BONUS_REDUCTION_THRESHOLD_30 = 28.5;
/** Điểm xét tuyển tối đa, thang 30 — điểm cộng + điểm ưu tiên không được vượt mức này. */
export const HCMUS_MAX_SCORE_30 = 30;
