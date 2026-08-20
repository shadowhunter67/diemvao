import { round2 } from '../../core/round2';

/**
 * Điểm khuyến khích (chứng chỉ ngoại ngữ IELTS/TOEFL iBT, hoặc SAT) — Thông báo 2415/TB-ĐHYD mục
 * 6.2.2(c) + mục 6, xem `evidence.ts:umpBonusEvidence`. Công thức = 0,9×(điểm/thang tối đa), cộng
 * dồn 2 thành phần (ngoại ngữ + SAT) nếu thí sinh có cả 2, kẹp trần 1,50.
 */
const IELTS_THRESHOLD = 6.0;
const TOEFL_IBT_THRESHOLD = 80;
const SAT_THRESHOLD = 1340;
const IELTS_MAX = 9;
const TOEFL_IBT_MAX = 120;
const SAT_MAX = 1600;
const BONUS_FACTOR = 0.9;
export const UMP_BONUS_CAP_30 = 1.5;

export interface UmpBonusInput {
  /** Chỉ chọn 1 trong 2 (IELTS hoặc TOEFL iBT) — nếu thí sinh có cả 2, tự chọn loại cao điểm hơn
   * trước khi truyền vào (caller quyết định, không suy đoán ở đây). */
  englishCertificate?: { type: 'ielts'; score: number } | { type: 'toefl-ibt'; score: number };
  satScore?: number;
}

export interface UmpBonusResult {
  englishBonus: number;
  satBonus: number;
  total30: number;
}

function calculateEnglishBonus(cert: UmpBonusInput['englishCertificate']): number {
  if (!cert) return 0;
  if (cert.type === 'ielts') {
    if (cert.score < IELTS_THRESHOLD) return 0;
    return BONUS_FACTOR * (cert.score / IELTS_MAX);
  }
  if (cert.score < TOEFL_IBT_THRESHOLD) return 0;
  return BONUS_FACTOR * (cert.score / TOEFL_IBT_MAX);
}

function calculateSatBonus(satScore: number | undefined): number {
  if (satScore === undefined || satScore < SAT_THRESHOLD) return 0;
  return BONUS_FACTOR * (satScore / SAT_MAX);
}

export function calculateUmpBonus30(input: UmpBonusInput): UmpBonusResult {
  const englishBonus = round2(calculateEnglishBonus(input.englishCertificate));
  const satBonus = round2(calculateSatBonus(input.satScore));
  const total30 = Math.min(UMP_BONUS_CAP_30, round2(englishBonus + satBonus));
  return { englishBonus, satBonus, total30 };
}
