/**
 * Điểm cộng PT1 = Điểm thưởng (Phụ lục 6) + Điểm xét thưởng (Phụ lục 7), CỘNG trực tiếp rồi kẹp
 * tổng ở 10,00 (thang 100) — trang chính thức tự nói "Điểm cộng = Điểm thưởng + Điểm xét thưởng"
 * và "Điểm cộng ... tối đa được 10 điểm" (`sources.ts:tdtu-admission-plan-2026`). Điểm thưởng tự
 * kẹp ở 10 (Phụ lục 6), Điểm xét thưởng tự kẹp ở 5 (Phụ lục 7) TRƯỚC khi cộng — nên tổng luôn ≤15
 * trước bước kẹp cuối, kẹp cuối ở 10 mới là ràng buộc thật.
 */
export const TDTU_BONUS_THUONG_CAP_100 = 10;
export const TDTU_BONUS_XET_THUONG_CAP_100 = 5;
export const TDTU_BONUS_TOTAL_CAP_100 = 10;

/** Phụ lục 6 — Quy định điểm thưởng PT1 (`sources.ts:tdtu-pl6-bonus-award-2026`). Không có lưu ý
 * "chỉ chọn cao nhất" như Phụ lục 7 — mô hình hóa mỗi thí sinh khai NHIỀU thành tích (list), cộng
 * tất cả rồi kẹp ở 10 (đọc đúng nghĩa đen văn bản, dù thực tế hiếm khi 1 thí sinh có >1 thành tích
 * thuộc danh sách này). */
export type TdtuThuongCategory = 'hsg-quocgia-quocte' | 'khkt-quocgia-quocte' | 'the-thao-doi-tuyen-quocgia' | 'my-thuat-quocte' | 'tay-nghe-asean-quocte';

const RANKED_THUONG_POINTS: Record<'nhat' | 'nhi' | 'ba', number> = { nhat: 10, nhi: 8, ba: 6 };
const FLAT_THUONG_POINTS: Partial<Record<TdtuThuongCategory, number>> = {
  'the-thao-doi-tuyen-quocgia': 6,
  'my-thuat-quocte': 6,
};
const RANKED_THUONG_CATEGORIES = new Set<TdtuThuongCategory>(['hsg-quocgia-quocte', 'khkt-quocgia-quocte', 'tay-nghe-asean-quocte']);

export interface TdtuThuongAchievement {
  category: TdtuThuongCategory;
  /** Bắt buộc cho 3 mục có xếp hạng (HSG QG/QT, KHKT QG/QT, tay nghề ASEAN/QT); bỏ qua cho 2 mục
   * flat (thể thao đội tuyển QG, mỹ thuật QT — luôn 6 điểm). */
  rank?: 'nhat' | 'nhi' | 'ba';
}

function pointsForThuong(achievement: TdtuThuongAchievement): number {
  if (RANKED_THUONG_CATEGORIES.has(achievement.category)) {
    return achievement.rank ? RANKED_THUONG_POINTS[achievement.rank] : 0;
  }
  return FLAT_THUONG_POINTS[achievement.category] ?? 0;
}

export function calculateTdtuBonusThuong(achievements: TdtuThuongAchievement[] = []): number {
  const total = achievements.reduce((sum, a) => sum + pointsForThuong(a), 0);
  return Math.min(TDTU_BONUS_THUONG_CAP_100, total);
}

/** Phụ lục 7 — Quy định điểm xét thưởng PT1 (`sources.ts:tdtu-pl7-merit-award-2026`). Lưu ý chính
 * thức: "Thí sinh đoạt đồng thời nhiều thành tích ở các mục 1 và 3 chỉ được cộng điểm xét thưởng
 * cao nhất" — mục 1 (HSG tỉnh/thành) và mục 3 (khuyến khích HSG quốc gia) dùng chung 1 "suất", các
 * mục khác cộng dồn bình thường. */
export type TdtuXetThuongCategory =
  | 'hsg-tinh-thanh'
  | 'hanh-kiem-tot-3-nam'
  | 'hsg-quocgia-khuyenkhich'
  | 'khkt-quocgia-khuyenkhich'
  | 'the-thao-quocgia'
  | 'my-thuat-toanquoc'
  | 'tay-nghe-asean-quocte';

const RANKED_XET_THUONG_POINTS: Record<'nhat' | 'nhi' | 'ba', number> = { nhat: 5, nhi: 4, ba: 3 };
const MEDAL_XET_THUONG_POINTS: Record<'vang' | 'bac' | 'dong', number> = { vang: 5, bac: 4, dong: 3 };
const FLAT_XET_THUONG_POINTS: Partial<Record<TdtuXetThuongCategory, number>> = {
  'hanh-kiem-tot-3-nam': 1,
  'hsg-quocgia-khuyenkhich': 5,
  'khkt-quocgia-khuyenkhich': 5,
  'my-thuat-toanquoc': 3,
};
const RANKED_XET_THUONG_CATEGORIES = new Set<TdtuXetThuongCategory>(['hsg-tinh-thanh', 'tay-nghe-asean-quocte']);
/** mục 1 và 3 — chỉ cộng cao nhất nếu đồng thời đạt (lưu ý chính thức Phụ lục 7). */
const HIGHEST_ONLY_XET_THUONG_CATEGORIES = new Set<TdtuXetThuongCategory>(['hsg-tinh-thanh', 'hsg-quocgia-khuyenkhich']);

export interface TdtuXetThuongAchievement {
  category: TdtuXetThuongCategory;
  /** Bắt buộc cho 'hsg-tinh-thanh'/'tay-nghe-asean-quocte' (nhất/nhì/ba). */
  rank?: 'nhat' | 'nhi' | 'ba';
  /** Bắt buộc cho 'the-thao-quocgia' (vàng/bạc/đồng). */
  medal?: 'vang' | 'bac' | 'dong';
}

function pointsForXetThuong(achievement: TdtuXetThuongAchievement): number {
  if (achievement.category === 'the-thao-quocgia') return achievement.medal ? MEDAL_XET_THUONG_POINTS[achievement.medal] : 0;
  if (RANKED_XET_THUONG_CATEGORIES.has(achievement.category)) return achievement.rank ? RANKED_XET_THUONG_POINTS[achievement.rank] : 0;
  return FLAT_XET_THUONG_POINTS[achievement.category] ?? 0;
}

export function calculateTdtuBonusXetThuong(achievements: TdtuXetThuongAchievement[] = []): number {
  const highestOnly = achievements.filter((a) => HIGHEST_ONLY_XET_THUONG_CATEGORIES.has(a.category));
  const others = achievements.filter((a) => !HIGHEST_ONLY_XET_THUONG_CATEGORIES.has(a.category));
  const highestOnlyBest = highestOnly.reduce((max, a) => Math.max(max, pointsForXetThuong(a)), 0);
  const othersTotal = others.reduce((sum, a) => sum + pointsForXetThuong(a), 0);
  return Math.min(TDTU_BONUS_XET_THUONG_CAP_100, highestOnlyBest + othersTotal);
}

/** Điểm cộng cuối = Điểm thưởng + Điểm xét thưởng, kẹp 10 (thang 100). */
export function calculateTdtuDiemCong(input: { thuong?: TdtuThuongAchievement[]; xetThuong?: TdtuXetThuongAchievement[] }): number {
  const thuong = calculateTdtuBonusThuong(input.thuong);
  const xetThuong = calculateTdtuBonusXetThuong(input.xetThuong);
  return Math.min(TDTU_BONUS_TOTAL_CAP_100, thuong + xetThuong);
}
