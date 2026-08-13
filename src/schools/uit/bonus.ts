import { UIT_BONUS_CATEGORIES, UIT_BONUS_OVERALL_CAP, type UitBonusCategoryId } from './data/bonus';

export interface UitBonusEligibilitySummary {
  eligibleCategories: UitBonusCategoryId[];
  /** Mức trần (upper bound) của từng nhóm đã chọn — KHÔNG phải điểm thực nhận. */
  categoryCaps: Partial<Record<UitBonusCategoryId, number>>;
  overallCap: number;
  /** Luôn false: UniscoreVN chưa có đủ nguồn để khẳng định điểm thực nhận đúng bằng mức trần. */
  exactPointsKnown: false;
}

/**
 * Xác định các nhóm điểm cộng UIT mà thí sinh đủ điều kiện được xét, cùng mức trần từng nhóm —
 * pure function, không phụ thuộc React. Không trả về một con số "điểm cộng" duy nhất: xem
 * comment trong `data/bonus.ts` về lý do không quy đổi eligibility thành awarded points.
 */
export function calculateUitBonusEligibility(selectedCategoryIds: UitBonusCategoryId[]): UitBonusEligibilitySummary {
  const categoryCaps: Partial<Record<UitBonusCategoryId, number>> = {};
  for (const id of selectedCategoryIds) {
    const category = UIT_BONUS_CATEGORIES.find((c) => c.id === id);
    if (category) categoryCaps[id] = category.maxPoints;
  }

  return {
    eligibleCategories: selectedCategoryIds,
    categoryCaps,
    overallCap: UIT_BONUS_OVERALL_CAP,
    exactPointsKnown: false,
  };
}
