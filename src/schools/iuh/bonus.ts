import { round2 } from '../../core/round2';

/**
 * Điểm cộng (ĐC) IUH 2026 = Điểm thưởng + Điểm xét thưởng (Phụ lục 1) + Điểm khuyến khích (Phụ lục
 * 2) — xem `evidence.ts:iuhBonusEvidence`. Module này chỉ implement:
 * - Điểm xét thưởng: 4/7 dòng Phụ lục 1 TỰ CHỨA (không cần tra cứu danh mục ngoài) — dòng 5/6/7 (tra
 *   cứu danh mục trường ký kết/trường chuyên/Top trường) CHƯA modeled, xem `knowledgeGaps.ts`.
 * - Điểm khuyến khích: đầy đủ Phụ lục 2 mục 1 (IELTS) — quy đổi chứng chỉ khác sang IELTS (mục 3) là
 *   input của caller (`resolveIuhEnglishCertificateTier`), CHƯA tự tra ngược từ điểm thô TOEIC/VSTEP.
 * - "Điểm thưởng" (thí sinh đủ điều kiện xét thẳng nhưng không dùng quyền) KHÔNG có mức điểm cụ thể
 *   trong nguồn đọc được — KHÔNG implement, không suy đoán số.
 *
 * Trần: Phụ lục 1 "tổng điểm không quá 1,5 điểm" (mọi dòng xét thưởng cộng lại) — nguồn KHÔNG nêu
 * trần tổng ĐC (xét thưởng + khuyến khích cộng chung); module này CHỈ áp trần 1,5 cho riêng phần xét
 * thưởng, KHÔNG tự đặt thêm trần tổng ĐC (tránh suy đoán số không có trong văn bản).
 */

export type IuhAwardLevel = 'second-or-above' | 'other';

const ACADEMIC_AWARD_POINTS: Record<IuhAwardLevel, number> = { 'second-or-above': 1.5, other: 1.25 };
const SCIENCE_CONTEST_AWARD_POINTS: Record<IuhAwardLevel, number> = { 'second-or-above': 1.5, other: 1.25 };
const THREE_YEAR_EXCELLENT_POINTS = 1.25;
const OTHER_OUTSTANDING_ACHIEVEMENT_POINTS = 0.75;
export const IUH_REWARD_CAP_30 = 1.5;

export interface IuhRewardInput {
  /** Dòng 1: giải HSG/Olympic văn hóa cấp tỉnh/thành phố trở lên (môn đạt giải thuộc tổ hợp xét
   * tuyển). */
  academicAward?: IuhAwardLevel;
  /** Dòng 2: giải cuộc thi Khoa học – Kỹ thuật cấp tỉnh/thành phố trở lên (đề tài/môn phù hợp ngành
   * xét tuyển). */
  scienceContestAward?: IuhAwardLevel;
  /** Dòng 3: học lực 3 năm lớp 10/11/12 xếp loại Giỏi. */
  threeYearExcellent?: boolean;
  /** Dòng 4: thành tích nổi bật khác (được tổ chức xác nhận). */
  otherOutstandingAchievement?: boolean;
}

export interface IuhRewardResult {
  raw: number;
  /** Đã kẹp trần 1,5 (Phụ lục 1: "tổng điểm không quá 1,5 điểm"). */
  total30: number;
}

/** Điểm xét thưởng (Phụ lục 1, 4 dòng tự chứa) — kẹp trần 1,5. */
export function calculateIuhReward30(input: IuhRewardInput): IuhRewardResult {
  const raw =
    (input.academicAward ? ACADEMIC_AWARD_POINTS[input.academicAward] : 0) +
    (input.scienceContestAward ? SCIENCE_CONTEST_AWARD_POINTS[input.scienceContestAward] : 0) +
    (input.threeYearExcellent ? THREE_YEAR_EXCELLENT_POINTS : 0) +
    (input.otherOutstandingAchievement ? OTHER_OUTSTANDING_ACHIEVEMENT_POINTS : 0);
  return { raw: round2(raw), total30: Math.min(IUH_REWARD_CAP_30, round2(raw)) };
}

/** Điểm cộng tổng (ĐC) = Điểm xét thưởng + Điểm khuyến khích (KHÔNG áp trần tổng — xem comment đầu
 * file). */
export function calculateIuhTotalBonus30(input: { reward30: number; encouragement30: number }): number {
  return round2(input.reward30 + input.encouragement30);
}

/* ---------- Điểm khuyến khích — Phụ lục 2 ---------- */

export type IuhIeltsBand = 4.5 | 5.0 | 5.5 | 6.0 | 6.5;

const IELTS_ENCOURAGEMENT_POINTS: Record<IuhIeltsBand, number> = {
  4.5: 0.5,
  5.0: 0.75,
  5.5: 1.0,
  6.0: 1.25,
  6.5: 1.5,
};

/** Tra điểm khuyến khích Phụ lục 2 mục 1 theo mốc IELTS đã quy đổi (chứng chỉ khác → IELTS tương
 * đương theo Phụ lục 2 mục 3 là trách nhiệm của caller, module này chỉ tra bảng IELTS cuối cùng). */
export function resolveIuhEnglishEncouragement30(ieltsEquivalentScore: number): number {
  if (ieltsEquivalentScore >= 6.5) return IELTS_ENCOURAGEMENT_POINTS[6.5];
  if (ieltsEquivalentScore >= 6.0) return IELTS_ENCOURAGEMENT_POINTS[6.0];
  if (ieltsEquivalentScore >= 5.5) return IELTS_ENCOURAGEMENT_POINTS[5.5];
  if (ieltsEquivalentScore >= 5.0) return IELTS_ENCOURAGEMENT_POINTS[5.0];
  if (ieltsEquivalentScore >= 4.5) return IELTS_ENCOURAGEMENT_POINTS[4.5];
  return 0;
}
