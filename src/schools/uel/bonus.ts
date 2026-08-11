import { UEL_BONUS_CATEGORIES, UEL_BONUS_OVERALL_CAP, type UelBonusCategoryId } from './data/bonus';

export interface UelBonusEligibilitySummary {
  eligibleCategories: UelBonusCategoryId[];
  categoryCaps: Partial<Record<UelBonusCategoryId, number>>;
  overallCap: number;
  exactPointsKnown: false;
}

/**
 * Cùng chính sách với UIT (xem schools/uit/bonus.ts): chỉ báo eligibility + mức trần từng nhóm,
 * KHÔNG suy ra điểm cộng thực nhận cuối cùng.
 */
export function calculateUelBonusEligibility(selectedCategoryIds: UelBonusCategoryId[]): UelBonusEligibilitySummary {
  const categoryCaps: Partial<Record<UelBonusCategoryId, number>> = {};
  for (const id of selectedCategoryIds) {
    const category = UEL_BONUS_CATEGORIES.find((c) => c.id === id);
    if (category) categoryCaps[id] = category.maxPoints;
  }

  return {
    eligibleCategories: selectedCategoryIds,
    categoryCaps,
    overallCap: UEL_BONUS_OVERALL_CAP,
    exactPointsKnown: false,
  };
}
