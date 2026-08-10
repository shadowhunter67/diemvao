import {
  calculateAcademicScore,
  calculateAdmissionScore,
  calculateBonus,
  calculatePriority,
  convertThptScore,
  convertTranscriptScore,
  round2,
} from './calculator';
import type {
  AdmissionConfig,
  AdmissionInput,
  RequiredDgnlResult,
  SimulatedAdmissionResult,
} from '../types/admission';

const TOLERANCE = 0.01;
const MAX_ITERATIONS = 100;

/**
 * Tính điểm xét tuyển ứng với một ĐGNL sau hệ số (weightedRaw, 0 → maxWeightedTotal) GIẢ ĐỊNH,
 * giữ nguyên THPT/học bạ/điểm cộng/ưu tiên. Tái sử dụng đúng các hàm engine chính
 * (convertThptScore, convertTranscriptScore, calculateAcademicScore, calculateBonus,
 * calculatePriority — cùng những hàm calculateAdmissionScore dùng) nên không duplicate công
 * thức nào. Không gọi calculateAdmissionScore/convertDgnlScore vì không có 4 điểm thành phần
 * thi ĐGNL thật — dựng DgnlInput giả cho một tổng weightedRaw sẽ đánh lừa chính API đó.
 */
export function calculateAdmissionScoreFromWeightedDgnlRaw(
  weightedRaw: number,
  otherInputs: Omit<AdmissionInput, 'dgnl'>,
  config: AdmissionConfig
): SimulatedAdmissionResult {
  const dgnlNormalizedScore = round2((weightedRaw / config.dgnl.maxWeightedTotal) * config.scoreScale);
  const thpt = convertThptScore(otherInputs.thpt, config);
  const transcript = convertTranscriptScore(otherInputs.transcript, config);

  const academic = calculateAcademicScore(dgnlNormalizedScore, thpt.normalizedScore, transcript.normalizedScore, config);
  const bonus = calculateBonus(otherInputs.bonus, config);

  const baseScoreForPriority = round2(academic.score + bonus.received);
  const priority = calculatePriority(otherInputs.priorityRaw30Scale, baseScoreForPriority, config);

  const finalScore = round2(Math.min(config.scoreScale, academic.score + bonus.received + priority.received));

  return {
    dgnlNormalizedScore,
    dgnlWeightedRawScore: round2(weightedRaw),
    academic,
    bonus,
    priority,
    baseScore: baseScoreForPriority,
    finalScore,
  };
}

/**
 * Tìm ĐGNL chuẩn hóa nhỏ nhất để điểm xét tuyển đạt targetFinalScore, giữ nguyên
 * THPT/học bạ/điểm cộng/ưu tiên hiện tại (lấy từ currentInput).
 *
 * Điểm ưu tiên thực nhận phụ thuộc phi tuyến vào baseScoreForPriority (academic + bonus),
 * nên không thể giải ngược bằng công thức đại số đơn giản. Thay vào đó binary search trên
 * weightedRaw (0 → maxWeightedTotal), đánh giá lại toàn bộ điểm ở mỗi bước qua
 * calculateAdmissionScoreFromWeightedDgnlRaw — hàm finalScore(weightedRaw) đơn điệu không
 * giảm (academic tăng theo weightedRaw; priorityReceived quanh ngưỡng giảm dần vẫn có hệ số
 * (1 - converted/reductionDivisor) > 0 nên tổng vẫn không giảm), nên binary search hội tụ
 * đúng nghiệm nhỏ nhất.
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
  const maxAchievableFinalScore = calculateAdmissionScoreFromWeightedDgnlRaw(maxWeightedRaw, otherInputs, config).finalScore;

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
    const finalScore = calculateAdmissionScoreFromWeightedDgnlRaw(mid, otherInputs, config).finalScore;
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

/**
 * Biến thể của calculateRequiredDgnl dùng khi người dùng nhập thẳng ĐGNL sau hệ số
 * (chế độ "Nhập tổng điểm ĐGNL") thay vì 4 điểm thành phần thật — nên không có
 * AdmissionInput.dgnl hợp lệ để đưa qua calculateAdmissionScore như hàm gốc. Logic tìm
 * nghiệm (binary search) giống hệt calculateRequiredDgnl, chỉ khác nguồn lấy currentFinalScore
 * (từ currentWeightedRaw qua calculateAdmissionScoreFromWeightedDgnlRaw thay vì từ currentInput
 * đầy đủ) — cố tình không refactor gộp chung với calculateRequiredDgnl để không đụng vào hàm đó.
 */
export function calculateRequiredDgnlFromWeightedRaw(
  targetFinalScore: number,
  currentWeightedRaw: number,
  otherInputs: Omit<AdmissionInput, 'dgnl'>,
  config: AdmissionConfig
): RequiredDgnlResult {
  const currentFinalScore = calculateAdmissionScoreFromWeightedDgnlRaw(currentWeightedRaw, otherInputs, config).finalScore;
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
  const maxAchievableFinalScore = calculateAdmissionScoreFromWeightedDgnlRaw(maxWeightedRaw, otherInputs, config).finalScore;

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
    const finalScore = calculateAdmissionScoreFromWeightedDgnlRaw(mid, otherInputs, config).finalScore;
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
