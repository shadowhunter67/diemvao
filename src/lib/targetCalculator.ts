import { calculateAdmissionScore, round2 } from './calculator';
import type { AdmissionConfig, AdmissionInput, AdmissionResult, RequiredDgnlResult } from '../types/admission';

const TOLERANCE = 0.01;
const MAX_ITERATIONS = 100;

/**
 * Tính điểm xét tuyển ứng với một tổng ĐGNL sau hệ số (weightedRaw, 0 → maxWeightedTotal)
 * giả định, giữ nguyên các thành phần khác. Dùng nguyên `calculateAdmissionScore` (không
 * duplicate công thức học lực/điểm cộng/ưu tiên) bằng cách dồn weightedRaw vào field
 * `vietnamese` (không nhân hệ số trong convertDgnlScore) — chỉ dùng nội bộ để tính, KHÔNG
 * suy ra/hiển thị điểm từng phần thi Tiếng Việt/Anh/Toán/Tư duy khoa học cho người dùng.
 */
export function calculateScoreForWeightedRaw(
  weightedRaw: number,
  otherInputs: Omit<AdmissionInput, 'dgnl'>,
  config: AdmissionConfig
): AdmissionResult {
  const input: AdmissionInput = {
    ...otherInputs,
    dgnl: { vietnamese: weightedRaw, english: 0, math: 0, scientificThinking: 0 },
  };
  return calculateAdmissionScore(input, config);
}

/**
 * Tìm ĐGNL chuẩn hóa nhỏ nhất để điểm xét tuyển đạt targetFinalScore, giữ nguyên
 * THPT/học bạ/điểm cộng/ưu tiên hiện tại (lấy từ currentInput).
 *
 * Điểm ưu tiên thực nhận phụ thuộc phi tuyến vào baseScoreForPriority (academic + bonus),
 * nên không thể giải ngược bằng công thức đại số đơn giản. Thay vào đó binary search trên
 * weightedRaw (0 → maxWeightedTotal), đánh giá lại toàn bộ `calculateAdmissionScore` ở mỗi
 * bước — hàm finalScore(weightedRaw) đơn điệu không giảm (academic tăng theo weightedRaw;
 * priorityReceived quanh ngưỡng giảm dần vẫn có hệ số (1 - converted/reductionDivisor) > 0
 * nên tổng vẫn không giảm), nên binary search hội tụ đúng nghiệm nhỏ nhất.
 */
export function calculateRequiredDgnl(
  targetFinalScore: number,
  currentInput: AdmissionInput,
  config: AdmissionConfig
): RequiredDgnlResult {
  const otherInputs: Omit<AdmissionInput, 'dgnl'> = {
    thpt: currentInput.thpt,
    transcript: currentInput.transcript,
    bonus: currentInput.bonus,
    priorityRaw30Scale: currentInput.priorityRaw30Scale,
  };

  const currentFinalScore = calculateAdmissionScore(currentInput, config).finalScore;
  const gap = round2(Math.max(0, targetFinalScore - currentFinalScore));

  if (currentFinalScore >= targetFinalScore - TOLERANCE) {
    return {
      possible: true,
      alreadyReached: true,
      requiredNormalizedScore: null,
      requiredWeightedRawScore: null,
      maxAchievableFinalScore: currentFinalScore,
      gap,
    };
  }

  const maxWeightedRaw = config.dgnl.maxWeightedTotal;
  const maxAchievableFinalScore = calculateScoreForWeightedRaw(maxWeightedRaw, otherInputs, config).finalScore;

  if (maxAchievableFinalScore < targetFinalScore - TOLERANCE) {
    return {
      possible: false,
      alreadyReached: false,
      requiredNormalizedScore: null,
      requiredWeightedRawScore: null,
      maxAchievableFinalScore,
      gap,
      reason: 'Không thể đạt mục tiêu này chỉ bằng việc tăng điểm ĐGNL.',
    };
  }

  let low = 0;
  let high = maxWeightedRaw;
  for (let i = 0; i < MAX_ITERATIONS && high - low > 0.001; i++) {
    const mid = (low + high) / 2;
    const finalScore = calculateScoreForWeightedRaw(mid, otherInputs, config).finalScore;
    if (finalScore >= targetFinalScore) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const requiredWeightedRawScore = round2(high);
  const requiredNormalizedScore = round2((high / maxWeightedRaw) * config.scoreScale);

  return {
    possible: true,
    alreadyReached: false,
    requiredNormalizedScore,
    requiredWeightedRawScore,
    maxAchievableFinalScore,
    gap,
  };
}
