import { HCMUS_BONUS_CATEGORIES_2026, HCMUS_BONUS_REDUCTION_THRESHOLD_30, type HcmusBonusCategoryId } from './data/bonus';

export interface HcmusBonusResult {
  categoryId: HcmusBonusCategoryId | null;
  basePoints30: number;
  /** Điểm cộng thực nhận sau khi áp công thức giảm gần mức trần (nếu có), thang 30. */
  awardedPoints30: number;
  reduced: boolean;
}

/**
 * Tính điểm cộng Phương thức 2 HCMUS 2026 cho MỘT loại thành tích (thí sinh chỉ được cộng 01
 * loại điểm cộng có mức điểm cao nhất — quy định đã xác nhận từ nguồn chính thức, UI ở lớp gọi
 * chịu trách nhiệm chỉ truyền vào loại có `basePoints30` cao nhất trong các loại thí sinh đạt).
 *
 * `totalScoreBeforeBonus30`: "Tổng điểm đạt được của thí sinh" dùng trong công thức giảm điểm
 * cộng khi ≥ 28,5 (thang 30) — nguồn chính thức không nói rõ đây là điểm học lực đơn thuần hay đã
 * gồm phần nào khác; hàm này nhận đúng số caller truyền vào theo định nghĩa nguồn, không tự suy
 * diễn thành phần nào được cộng vào trước.
 */
export function calculateHcmusBonus(categoryId: HcmusBonusCategoryId | null, totalScoreBeforeBonus30: number): HcmusBonusResult {
  if (categoryId === null) {
    return { categoryId: null, basePoints30: 0, awardedPoints30: 0, reduced: false };
  }

  const category = HCMUS_BONUS_CATEGORIES_2026.find((c) => c.id === categoryId);
  if (!category) {
    return { categoryId: null, basePoints30: 0, awardedPoints30: 0, reduced: false };
  }

  if (totalScoreBeforeBonus30 < HCMUS_BONUS_REDUCTION_THRESHOLD_30) {
    return { categoryId, basePoints30: category.basePoints30, awardedPoints30: category.basePoints30, reduced: false };
  }

  const awarded = ((30 - totalScoreBeforeBonus30) / 1.5) * category.basePoints30;
  return { categoryId, basePoints30: category.basePoints30, awardedPoints30: Math.max(0, awarded), reduced: true };
}

export function selectHighestHcmusBonusCategory(categoryIds: readonly HcmusBonusCategoryId[]): HcmusBonusCategoryId | null {
  let selected: HcmusBonusCategoryId | null = null;
  let selectedPoints = 0;
  for (const categoryId of categoryIds) {
    const category = HCMUS_BONUS_CATEGORIES_2026.find((item) => item.id === categoryId);
    if (category && category.basePoints30 > selectedPoints) {
      selected = category.id;
      selectedPoints = category.basePoints30;
    }
  }
  return selected;
}
