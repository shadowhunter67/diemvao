import { UIT_BONUS_CATEGORIES, UIT_BONUS_OVERALL_CAP, type UitBonusCategoryId } from './data/bonus';

/** Cộng điểm trần từng nhóm đã chọn, áp cap tổng 10/100 — pure function, không phụ thuộc React. */
export function calculateUitBonus(selectedCategoryIds: UitBonusCategoryId[]): number {
  const raw = selectedCategoryIds.reduce((sum, id) => {
    const category = UIT_BONUS_CATEGORIES.find((c) => c.id === id);
    return sum + (category?.maxPoints ?? 0);
  }, 0);
  return Math.min(raw, UIT_BONUS_OVERALL_CAP);
}
