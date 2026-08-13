/**
 * "Điểm xét thưởng" IU 2026 (một phần của Điểm cộng, tối đa 10 tổng) — CHỈ 2 tiêu chí đọc được
 * nguyên văn từ nguồn `iu-method2-2026`, tổng điểm xét thưởng tối đa 5. "Điểm thưởng" và "điểm
 * khuyến khích" (2 phần còn lại của Điểm cộng) nằm trong PDF 24 trang liên kết — chưa đọc được,
 * xem `knowledgeGaps.ts`. KHÔNG cộng gộp coi đây là toàn bộ điểm cộng.
 */
export interface IuBonusCriterion {
  id: string;
  label: string;
  points: number;
}

export const IU_PRIORITY_SCHOOL_POINTS = 3;
export const IU_SPECIAL_ACHIEVEMENT_POINTS_EACH = 2;
export const IU_XET_THUONG_MAX = 5;

/** `specialAchievementCount`: "được cộng 2 điểm cho mỗi giải thưởng" — nhiều giải cộng dồn, tự cap
 * ở tổng điểm xét thưởng tối đa 5 (cùng nhóm với tiêu chí trường ưu tiên). */
export function computeIuXetThuongBonus(hasPrioritySchool: boolean, specialAchievementCount: number): number {
  const total = (hasPrioritySchool ? IU_PRIORITY_SCHOOL_POINTS : 0) + Math.max(0, specialAchievementCount) * IU_SPECIAL_ACHIEVEMENT_POINTS_EACH;
  return Math.min(IU_XET_THUONG_MAX, total);
}
