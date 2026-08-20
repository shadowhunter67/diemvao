import { round2 } from '../../core/round2';

/**
 * Điểm cộng UFM 2026 — "b. Điểm cộng (tối đa 3 điểm bao gồm điểm thưởng, điểm xét thưởng và điểm
 * khuyến khích)" — verified TRỰC TIẾP qua screenshot PDF chính thức tại `login.ufm.edu.vn`
 * (`THONGTINTS2026-FINAL_compressed.pdf`, trang 7 mục 5.b, xem `evidence.ts:ufmBonusEvidence`),
 * KHÔNG còn dựa vào mirror chưa verify (research 2026-08-19).
 *
 * Dùng chung cho cả 4 phương thức (mục 4 Thông báo 2639/TB-ĐHTCM: "Điểm xét tuyển (thang 30) =
 * Điểm quy đổi tương đương + Điểm cộng (nếu có) + Điểm ưu tiên (nếu có)") — với học bạ/ĐGNL/V-SAT,
 * "Điểm quy đổi tương đương" là `y` sau khi qua bảng bách phân vị (`conversionTable.ts`), KHÔNG phải
 * điểm thang gốc.
 */

export type UfmNationalAchievementLevel = 'first' | 'second' | 'third';

const B1_POINTS: Record<UfmNationalAchievementLevel, number> = { first: 3, second: 2, third: 1.5 };
const B2_ENCOURAGEMENT_AWARD = 1;
const B2_GIFTED_SCHOOL = 0.75;
const B2_GOOD_STUDENT_3_YEARS = 0.75;
const B2_CAP = 1.5;
const B3_CAP = 1.5;
/** "Điểm cộng của mỗi thí sinh không vượt quá 10% mức điểm tối đa của thang điểm xét" — 10% của 30. */
export const UFM_BONUS_CAP_30 = 3;

export interface UfmBonusInput {
  /** b1: giải Nhất/Nhì/Ba kỳ thi HSG quốc gia/cuộc thi KHKT cấp quốc gia (môn đoạt giải thuộc tổ hợp
   * xét tuyển). Model độc lập với `nationalEncouragementAward` theo đúng cấu trúc văn bản (b1 khác
   * b2.Nhóm1) — trên thực tế 1 thí sinh thường chỉ thuộc 1 trong 2. */
  nationalAchievementLevel?: UfmNationalAchievementLevel;
  /** b2 Nhóm 1: giải khuyến khích kỳ thi/cuộc thi KHKT cấp quốc gia (+1,0). "Thí sinh đoạt nhiều giải
   * sẽ chỉ tính một điểm cộng tương ứng mức giải cao nhất" — caller tự chọn giải cao nhất trước khi
   * truyền cờ này. */
  nationalEncouragementAward?: boolean;
  /** b2 Nhóm 2: học sinh trường chuyên/năng khiếu trực thuộc tỉnh/thành/đại học (+0,75). */
  giftedSchoolStudent?: boolean;
  /** b2 Nhóm 3: học sinh giỏi trở lên cả 3 năm lớp 10/11/12 (+0,75). */
  goodStudentThreeYears?: boolean;
  /** b3: mức điểm khuyến khích tra theo Bảng 1 (0,5/0,75/1,5) — dùng
   * `resolveUfmEnglishCertificateTier` để tra từ chứng chỉ cụ thể trước khi truyền field này. */
  englishCertificateTier?: 0.5 | 0.75 | 1.5;
}

export interface UfmBonusResult {
  b1: number;
  b2: number;
  b3: number;
  /** Tổng điểm cộng đã kẹp trần 3,0 (10% thang 30). */
  total30: number;
}

export function calculateUfmBonus30(input: UfmBonusInput): UfmBonusResult {
  const b1 = input.nationalAchievementLevel ? B1_POINTS[input.nationalAchievementLevel] : 0;
  const b2Raw =
    (input.nationalEncouragementAward ? B2_ENCOURAGEMENT_AWARD : 0) +
    (input.giftedSchoolStudent ? B2_GIFTED_SCHOOL : 0) +
    (input.goodStudentThreeYears ? B2_GOOD_STUDENT_3_YEARS : 0);
  const b2 = Math.min(B2_CAP, round2(b2Raw));
  const b3 = Math.min(B3_CAP, input.englishCertificateTier ?? 0);
  const total30 = Math.min(UFM_BONUS_CAP_30, round2(b1 + b2 + b3));
  return { b1, b2, b3, total30 };
}

/* ---------- b3: Bảng 1 — Chứng chỉ Tiếng Anh ---------- */

export type UfmCefrLikeLevel = 'B1' | 'B2' | 'C1' | 'C2';
export type UfmVstepLevel = 3 | 4 | 5 | 6;
export type UfmPeicLevel = 2 | 3 | 4 | 5;

export interface UfmToeicSkillScores {
  listening: number;
  reading: number;
  speaking: number;
  writing: number;
}

export type UfmEnglishCertificateInput =
  | { type: 'cefr'; level: UfmCefrLikeLevel }
  | { type: 'cambridge'; level: UfmCefrLikeLevel }
  | { type: 'aptis'; level: UfmCefrLikeLevel }
  | { type: 'vstep'; level: UfmVstepLevel }
  | { type: 'toefl-ibt'; score: number }
  | { type: 'toefl-itp'; score: number }
  | { type: 'toeic'; scores: UfmToeicSkillScores }
  | { type: 'ielts'; score: number }
  | { type: 'peic'; level: UfmPeicLevel }
  | { type: 'pte-academic'; score: number }
  | { type: 'sat'; score: number };

function cefrLikeTier(level: UfmCefrLikeLevel): 0.5 | 0.75 | 1.5 {
  if (level === 'B1') return 0.5;
  if (level === 'B2') return 0.75;
  return 1.5; // C1, C2
}

function vstepTier(level: UfmVstepLevel): 0.5 | 0.75 | 1.5 {
  if (level === 3) return 0.5;
  if (level === 4) return 0.75;
  return 1.5; // 5, 6
}

function peicTier(level: UfmPeicLevel): 0.5 | 0.75 | 1.5 {
  if (level === 2) return 0.5;
  if (level === 3) return 0.75;
  return 1.5; // 4, 5
}

/** TOEFL iBT: Bảng 1 ghi "45 | 46-93 | 94-120" — cột tier thấp nhất chỉ có 1 mốc (không nêu sàn
 * dưới), đọc như "≤45" — KHÔNG suy đoán thêm sàn tối thiểu vì nguồn không ghi. */
function toeflIbtTier(score: number): 0.5 | 0.75 | 1.5 | undefined {
  if (score >= 94) return score <= 120 ? 1.5 : undefined;
  if (score >= 46) return 0.75;
  if (score > 0 && score <= 45) return 0.5;
  return undefined;
}

function toeflItpTier(score: number): 0.5 | 0.75 | 1.5 | undefined {
  if (score >= 627) return score <= 677 ? 1.5 : undefined;
  if (score >= 500) return 0.75;
  if (score >= 450) return 0.5;
  return undefined;
}

/** IELTS Academic: Bảng 1 ghi "5.0 | 5.5-6.5 | 7.0-9.0" — cùng lưu ý mốc đơn ở tier thấp nhất như
 * TOEFL iBT (đọc như trần trên, không có sàn dưới nêu rõ). */
function ieltsTier(score: number): 0.5 | 0.75 | 1.5 | undefined {
  if (score >= 7.0) return score <= 9.0 ? 1.5 : undefined;
  if (score >= 5.5) return score <= 6.5 ? 0.75 : undefined;
  if (score > 0 && score <= 5.0) return 0.5;
  return undefined;
}

function pteAcademicTier(score: number): 0.5 | 0.75 | 1.5 | undefined {
  if (score >= 76) return score <= 90 ? 1.5 : undefined;
  if (score >= 59) return 0.75;
  if (score >= 43) return 0.5;
  return undefined;
}

function satTier(score: number): 0.5 | 0.75 | 1.5 | undefined {
  if (score >= 1400) return 1.5;
  if (score >= 1300) return score <= 1390 ? 0.75 : undefined;
  if (score >= 1200) return score <= 1290 ? 0.5 : undefined;
  return undefined;
}

function toeicSkillTier(score: number, bands: readonly [number, number, number]): 0.5 | 0.75 | 1.5 | undefined {
  const [min1, min2, min3] = bands;
  if (score >= min3) return 1.5;
  if (score >= min2) return 0.75;
  if (score >= min1) return 0.5;
  return undefined;
}

/** TOEIC 4 kỹ năng — mỗi kỹ năng có ngưỡng riêng theo Bảng 1; tier chung = tier THẤP NHẤT trong 4 kỹ
 * năng (diễn giải thận trọng — cần cả 4 kỹ năng cùng đạt mức mới tính là đạt mức đó, KHÔNG suy đoán
 * chỉ cần 1 kỹ năng đạt là đủ). */
function toeicTier(scores: UfmToeicSkillScores): 0.5 | 0.75 | 1.5 | undefined {
  const listening = toeicSkillTier(scores.listening, [275, 400, 490]);
  const reading = toeicSkillTier(scores.reading, [275, 385, 455]);
  const speaking = toeicSkillTier(scores.speaking, [120, 160, 180]);
  const writing = toeicSkillTier(scores.writing, [120, 150, 180]);
  const tiers = [listening, reading, speaking, writing];
  if (tiers.some((t) => t === undefined)) return undefined;
  return Math.min(...(tiers as number[])) as 0.5 | 0.75 | 1.5;
}

/** Tra Bảng 1 (Chứng chỉ Tiếng Anh) — trả về mức điểm khuyến khích (0,5/0,75/1,5) hoặc `undefined`
 * nếu điểm/level không đạt mức nào trong bảng. */
export function resolveUfmEnglishCertificateTier(input: UfmEnglishCertificateInput): 0.5 | 0.75 | 1.5 | undefined {
  switch (input.type) {
    case 'cefr':
    case 'cambridge':
    case 'aptis':
      return cefrLikeTier(input.level);
    case 'vstep':
      return vstepTier(input.level);
    case 'peic':
      return peicTier(input.level);
    case 'toefl-ibt':
      return toeflIbtTier(input.score);
    case 'toefl-itp':
      return toeflItpTier(input.score);
    case 'ielts':
      return ieltsTier(input.score);
    case 'pte-academic':
      return pteAcademicTier(input.score);
    case 'sat':
      return satTier(input.score);
    case 'toeic':
      return toeicTier(input.scores);
    default:
      return undefined;
  }
}
