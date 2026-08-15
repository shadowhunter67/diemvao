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

export function lookupUelCertificateBonus(input: { ielts?: number; toeflIbt?: number; toeic?: number }): number {
  const candidates: number[] = [];
  if (input.ielts !== undefined) {
    if (input.ielts >= 6) candidates.push(5);
    else if (input.ielts >= 5.5) candidates.push(3.5);
    else if (input.ielts >= 5) candidates.push(2);
  }
  if (input.toeflIbt !== undefined) {
    const score = input.toeflIbt;
    if (score >= 78) candidates.push(5);
    else if (score >= 74) candidates.push(4.7);
    else if (score >= 70) candidates.push(4.4);
    else if (score >= 66) candidates.push(4.1);
    else if (score >= 62) candidates.push(3.8);
    else if (score >= 59) candidates.push(3.5);
    else if (score >= 57) candidates.push(3.2);
    else if (score >= 54) candidates.push(2.9);
    else if (score >= 51) candidates.push(2.6);
    else if (score >= 48) candidates.push(2.3);
    else if (score >= 45) candidates.push(2);
  }
  if (input.toeic !== undefined) {
    const score = input.toeic;
    if (score >= 785) candidates.push(5);
    else if (score >= 760) candidates.push(4.7);
    else if (score >= 735) candidates.push(4.4);
    else if (score >= 710) candidates.push(4.1);
    else if (score >= 685) candidates.push(3.8);
    else if (score >= 670) candidates.push(3.5);
    else if (score >= 645) candidates.push(3.2);
    else if (score >= 620) candidates.push(2.9);
    else if (score >= 595) candidates.push(2.6);
    else if (score >= 570) candidates.push(2.3);
    else if (score >= 550) candidates.push(2);
  }
  return Math.max(0, ...candidates);
}

export function calculateUelBonus(input: { certificateBonus?: number; prioritySchool?: boolean }): number {
  const certificateBonus = input.certificateBonus ?? 0;
  const prioritySchoolBonus = input.prioritySchool ? 5 : 0;
  return Math.min(UEL_BONUS_OVERALL_CAP, certificateBonus + prioritySchoolBonus);
}
