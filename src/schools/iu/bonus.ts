/**
 * "Điểm cộng" IU 2026 đầy đủ (nguồn `iu-admission-info-2026` Khoản 5.a) — tổng 3 thành phần,
 * KHÔNG vượt quá 10 điểm (thang 100):
 *   1. Điểm thưởng — thí sinh đủ điều kiện tuyển thẳng theo Bộ GD&ĐT nhưng không dùng quyền đó.
 *   2. Điểm xét thưởng (tối đa 5) — trường ưu tiên (149 trường) + thành tích đặc biệt.
 *   3. Điểm khuyến khích (tối đa 5) — chứng chỉ ngoại ngữ quốc tế.
 */

export type IuAwardTier = 'international' | 'national-first' | 'national-second' | 'national-third' | 'none';

/** Điểm thưởng theo Khoản 5.a — chỉ áp dụng thí sinh ĐỦ điều kiện tuyển thẳng (Khoản 7) nhưng
 * không dùng quyền tuyển thẳng. Không cap riêng (đã nằm trong cap tổng 10). */
export const IU_AWARD_BONUS_POINTS: Record<Exclude<IuAwardTier, 'none'>, number> = {
  international: 10.0,
  'national-first': 9.0,
  'national-second': 8.0,
  'national-third': 7.0,
};

export function computeIuAwardBonus(tier: IuAwardTier): number {
  return tier === 'none' ? 0 : IU_AWARD_BONUS_POINTS[tier];
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

export const IU_KHUYEN_KHICH_MAX = 5;

/** Bảng "Điểm khuyến khích" chứng chỉ ngoại ngữ (Khoản 5.a) — KHÁC bảng quy đổi điểm môn Tiếng
 * Anh THPT ở Mục 2.b (điểm số khác nhau dù cùng ngưỡng chứng chỉ). Ngưỡng thấp nhất công bố là
 * IELTS 5.0/TOEFL iBT 35/TOEIC 450 (Nghe&Đọc) — dưới ngưỡng này không có điểm khuyến khích (không
 * suy diễn ngoại suy). */
interface CertificateThreshold {
  minIelts?: number;
  minToeflIbt?: number;
  minToeic?: number;
  points: number;
}

const IU_CERTIFICATE_THRESHOLDS: CertificateThreshold[] = [
  { minIelts: 7.0, minToeflIbt: 94, minToeic: 850, points: 5.0 },
  { minIelts: 6.5, minToeflIbt: 79, minToeic: 785, points: 4.5 },
  { minIelts: 6.0, minToeflIbt: 60, minToeic: 650, points: 4.0 },
  { minIelts: 5.5, minToeflIbt: 46, minToeic: 550, points: 3.5 },
  { minIelts: 5.0, minToeflIbt: 35, minToeic: 450, points: 3.0 },
];

export interface IuCertificateInput {
  ielts?: number;
  toeflIbt?: number;
  toeic?: number;
  /** true nếu thí sinh đã dùng chứng chỉ này để quy đổi điểm môn Tiếng Anh THPT (miễn thi) —
   * theo đúng quy định "không được dùng cho điểm khuyến khích" trong trường hợp đó. */
  usedForThptEnglishExemption?: boolean;
}

/** Điểm khuyến khích cao nhất đạt được từ 1 trong 3 loại chứng chỉ đã nhập (không cộng dồn nhiều
 * loại — bảng gốc liệt kê như các mức tương đương của CÙNG MỘT thang, không phải cộng dồn). */
export function computeIuEncouragementBonus(input: IuCertificateInput): number {
  if (input.usedForThptEnglishExemption) return 0;

  let best = 0;
  for (const tier of IU_CERTIFICATE_THRESHOLDS) {
    const meetsIelts = tier.minIelts !== undefined && input.ielts !== undefined && input.ielts >= tier.minIelts;
    const meetsToefl = tier.minToeflIbt !== undefined && input.toeflIbt !== undefined && input.toeflIbt >= tier.minToeflIbt;
    const meetsToeic = tier.minToeic !== undefined && input.toeic !== undefined && input.toeic >= tier.minToeic;
    if (meetsIelts || meetsToefl || meetsToeic) {
      best = Math.max(best, tier.points);
    }
  }
  return best;
}

export interface IuTotalBonusInput {
  awardTier: IuAwardTier;
  hasPrioritySchool: boolean;
  specialAchievementCount: number;
  certificate: IuCertificateInput;
}

export interface IuTotalBonusResult {
  awardBonus: number;
  xetThuongBonus: number;
  encouragementBonus: number;
  /** Tổng 3 thành phần, đã cap ở 10 (thang 100) theo đúng Khoản 5.a. */
  total: number;
  capped: boolean;
}

export const IU_TOTAL_BONUS_CAP = 10;

export function computeIuTotalBonus(input: IuTotalBonusInput): IuTotalBonusResult {
  const awardBonus = computeIuAwardBonus(input.awardTier);
  const xetThuongBonus = computeIuXetThuongBonus(input.hasPrioritySchool, input.specialAchievementCount);
  const encouragementBonus = computeIuEncouragementBonus(input.certificate);
  const rawTotal = awardBonus + xetThuongBonus + encouragementBonus;
  const total = Math.min(IU_TOTAL_BONUS_CAP, rawTotal);
  return { awardBonus, xetThuongBonus, encouragementBonus, total, capped: rawTotal > IU_TOTAL_BONUS_CAP };
}
