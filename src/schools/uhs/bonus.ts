/**
 * Điều kiện được XÉT điểm cộng (không phải bảng điểm cộng theo mức) — nguồn `uhs-bonus-2026`.
 * Trường công bố AI được xét, KHÔNG công bố xét được bao nhiêu điểm cho từng tiêu chí — nên đây
 * là bonus ELIGIBILITY checker (đạt/không đạt điều kiện), không phải bonus point calculator.
 */
export interface UhsBonusCriterion {
  id: string;
  label: string;
}

export const UHS_BONUS_CRITERIA: UhsBonusCriterion[] = [
  { id: 'ielts-6', label: 'IELTS ≥6.0 (hoặc TOEFL iBT ≥79 / TOEFL ITP ≥550 / TOEIC L,R≥671 & S,W≥271 / VSTEP bậc 4), còn hạn ≤2 năm' },
  { id: 'sat-1280', label: 'SAT ≥1280' },
  { id: 'priority-school', label: 'Học sinh 1 trong 149 trường ưu tiên, ≥2 năm, hạnh kiểm/học lực Khá trở lên 3 năm' },
];

export function checkUhsBonusEligibility(selectedIds: readonly string[]): UhsBonusCriterion[] {
  return UHS_BONUS_CRITERIA.filter((criterion) => selectedIds.includes(criterion.id));
}
