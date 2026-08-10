import type {
  AcademicResult,
  AdmissionConfig,
  AdmissionInput,
  AdmissionResult,
  BonusInput,
  BonusResult,
  DgnlInput,
  DgnlResult,
  PriorityResult,
  ThptInput,
  ThptResult,
  TranscriptInput,
  TranscriptResult,
} from '../types/admission';
import { round2 } from '../../../core/round2';

export { round2 };

/**
 * Điểm ĐGNL ĐHQG-HCM: Toán nhân hệ số, tổng quy đổi về thang scoreScale (100)
 * trên nền tổng điểm tối đa của bài thi (maxWeightedTotal, 1500).
 */
export function convertDgnlScore(input: DgnlInput, config: AdmissionConfig): DgnlResult {
  const { mathMultiplier, maxWeightedTotal } = config.dgnl;

  const rawScore = input.vietnamese + input.english + input.math + input.scientificThinking;
  const weightedMath = input.math * mathMultiplier;
  const weightedScore = input.vietnamese + input.english + weightedMath + input.scientificThinking;
  const normalizedScore = (weightedScore / maxWeightedTotal) * config.scoreScale;

  return {
    rawScore: round2(rawScore),
    weightedMath: round2(weightedMath),
    weightedScore: round2(weightedScore),
    normalizedScore: round2(normalizedScore),
  };
}

/**
 * Điểm thi THPT: Toán nhân hệ số, trung bình có trọng số trên thang maxPerSubject (10)
 * rồi quy đổi về thang scoreScale (100).
 */
export function convertThptScore(input: ThptInput, config: AdmissionConfig): ThptResult {
  const { mathMultiplier, maxPerSubject } = config.thpt;
  const weightCount = mathMultiplier + 2;

  const weightedMath = input.math * mathMultiplier;
  const weightedAverage = (weightedMath + input.subject2 + input.subject3) / weightCount;
  const normalizedScore = (weightedAverage / maxPerSubject) * config.scoreScale;

  return {
    math: round2(input.math),
    weightedMath: round2(weightedMath),
    subject2: round2(input.subject2),
    subject3: round2(input.subject3),
    weightedAverage: round2(weightedAverage),
    normalizedScore: round2(normalizedScore),
  };
}

/**
 * Điểm học bạ 3 năm: Toán nhân hệ số mỗi năm, trung bình có trọng số trên thang
 * maxPerSubject (10) rồi quy đổi về thang scoreScale (100).
 * Không xử lý trường hợp đổi môn tổ hợp giữa các lớp.
 */
export function convertTranscriptScore(input: TranscriptInput, config: AdmissionConfig): TranscriptResult {
  const { mathMultiplier, maxPerSubject } = config.transcript;
  const weightCountPerYear = mathMultiplier + 2;
  const years = [input.grade10, input.grade11, input.grade12];

  const weightedTotal = years.reduce(
    (sum, year) => sum + year.math * mathMultiplier + year.subject2 + year.subject3,
    0
  );
  const weightedAverage = weightedTotal / (weightCountPerYear * years.length);
  const normalizedScore = (weightedAverage / maxPerSubject) * config.scoreScale;

  return {
    weightedTotal: round2(weightedTotal),
    weightedAverage: round2(weightedAverage),
    normalizedScore: round2(normalizedScore),
  };
}

export function calculateAcademicScore(
  dgnlNormalized: number,
  thptNormalized: number,
  transcriptNormalized: number,
  config: AdmissionConfig
): AcademicResult {
  const dgnlContribution = dgnlNormalized * config.weights.dgnl;
  const thptContribution = thptNormalized * config.weights.thpt;
  const transcriptContribution = transcriptNormalized * config.weights.transcript;
  const score = dgnlContribution + thptContribution + transcriptContribution;

  return {
    dgnlContribution: round2(dgnlContribution),
    thptContribution: round2(thptContribution),
    transcriptContribution: round2(transcriptContribution),
    score: round2(score),
  };
}

/** Điểm cộng (thưởng + xét thưởng + khuyến khích), không vượt quá bonus.maxTotal. */
export function calculateBonus(input: BonusInput, config: AdmissionConfig): BonusResult {
  const raw = input.reward + input.considerationReward + input.encouragement;
  const received = Math.min(raw, config.bonus.maxTotal);

  return {
    raw: round2(raw),
    received: round2(received),
  };
}

/**
 * Điểm ưu tiên KV/ĐT: quy đổi từ thang 30 rồi giảm dần khi baseScore
 * (điểm học lực + điểm cộng) đạt ngưỡng reductionThreshold (75), theo quy định.
 */
export function calculatePriority(
  priorityRaw30Scale: number,
  baseScoreForPriority: number,
  config: AdmissionConfig
): PriorityResult {
  const { scaleDivisor, scaleMultiplier, reductionThreshold, reductionDivisor } = config.priority;
  const converted = (priorityRaw30Scale / scaleDivisor) * scaleMultiplier;

  // baseScoreForPriority >= scoreScale (100) làm (scoreScale - baseScoreForPriority) âm,
  // Math.max(0, ...) đảm bảo priorityReceived không bao giờ âm trong trường hợp đó.
  const received =
    baseScoreForPriority < reductionThreshold
      ? converted
      : Math.max(0, ((config.scoreScale - baseScoreForPriority) / reductionDivisor) * converted);

  return {
    raw30Scale: round2(priorityRaw30Scale),
    converted: round2(converted),
    received: round2(received),
  };
}

export function calculateAdmissionScore(input: AdmissionInput, config: AdmissionConfig): AdmissionResult {
  const dgnl = convertDgnlScore(input.dgnl, config);
  const thpt = convertThptScore(input.thpt, config);
  const transcript = convertTranscriptScore(input.transcript, config);

  const academic = calculateAcademicScore(dgnl.normalizedScore, thpt.normalizedScore, transcript.normalizedScore, config);
  const bonus = calculateBonus(input.bonus, config);

  const baseScoreForPriority = round2(academic.score + bonus.received);
  const priority = calculatePriority(input.priorityRaw30Scale, baseScoreForPriority, config);

  const finalScore = round2(Math.min(config.scoreScale, academic.score + bonus.received + priority.received));

  return {
    dgnl,
    thpt,
    transcript,
    academic,
    bonus,
    priority,
    baseScore: baseScoreForPriority,
    finalScore,
  };
}

/**
 * Đối tượng 2.2 (không có kết quả ĐGNL ĐHQG-HCM 2026): điểm năng lực = điểm THPT quy đổi ×
 * config.noDgnl.abilityMultiplier (0.75) — nguồn: docs/admission-research-2026.md#hcmut. Tái
 * dùng nguyên convertThptScore cho cả "điểm THPT quy đổi" (thành phần điểm năng lực) lẫn
 * "THPT chuẩn hóa" (thành phần 20% trong điểm học lực) vì đề án dùng đúng 1 công thức quy đổi
 * THPT cho cả hai chỗ. Kết quả trả về đúng shape AdmissionResult (dgnl field chứa điểm năng
 * lực đã quy đổi, không phải điểm thi ĐGNL thật) để tái sử dụng nguyên UI hiện có
 * (CurrentScoreCard, ScoreBreakdownDetails, StickySummaryBar...) không cần nhánh riêng.
 */
export function calculateAdmissionScoreNoDgnl(
  input: Omit<AdmissionInput, 'dgnl'>,
  config: AdmissionConfig
): AdmissionResult {
  const thpt = convertThptScore(input.thpt, config);
  const transcript = convertTranscriptScore(input.transcript, config);

  const abilityNormalizedScore = round2(thpt.normalizedScore * config.noDgnl.abilityMultiplier);
  const ability: DgnlResult = {
    rawScore: 0,
    weightedMath: 0,
    weightedScore: 0,
    normalizedScore: abilityNormalizedScore,
  };

  const academic = calculateAcademicScore(ability.normalizedScore, thpt.normalizedScore, transcript.normalizedScore, config);
  const bonus = calculateBonus(input.bonus, config);

  const baseScoreForPriority = round2(academic.score + bonus.received);
  const priority = calculatePriority(input.priorityRaw30Scale, baseScoreForPriority, config);

  const finalScore = round2(Math.min(config.scoreScale, academic.score + bonus.received + priority.received));

  return {
    dgnl: ability,
    thpt,
    transcript,
    academic,
    bonus,
    priority,
    baseScore: baseScoreForPriority,
    finalScore,
  };
}
