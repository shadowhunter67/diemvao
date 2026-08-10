export interface DgnlInput {
  vietnamese: number;
  english: number;
  math: number;
  scientificThinking: number;
}

export interface DgnlResult {
  rawScore: number;
  weightedMath: number;
  weightedScore: number;
  normalizedScore: number;
}

export interface ThptInput {
  math: number;
  subject2: number;
  subject3: number;
}

export interface ThptResult {
  math: number;
  weightedMath: number;
  subject2: number;
  subject3: number;
  weightedAverage: number;
  normalizedScore: number;
}

export interface TranscriptYear {
  math: number;
  subject2: number;
  subject3: number;
}

export interface TranscriptInput {
  grade10: TranscriptYear;
  grade11: TranscriptYear;
  grade12: TranscriptYear;
}

export interface TranscriptResult {
  weightedTotal: number;
  weightedAverage: number;
  normalizedScore: number;
}

export interface BonusInput {
  reward: number;
  considerationReward: number;
  encouragement: number;
}

export interface BonusResult {
  raw: number;
  received: number;
}

export interface PriorityResult {
  raw30Scale: number;
  converted: number;
  received: number;
}

export interface AdmissionInput {
  dgnl: DgnlInput;
  thpt: ThptInput;
  transcript: TranscriptInput;
  bonus: BonusInput;
  priorityRaw30Scale: number;
}

export interface AcademicResult {
  dgnlContribution: number;
  thptContribution: number;
  transcriptContribution: number;
  score: number;
}

export interface AdmissionResult {
  dgnl: DgnlResult;
  thpt: ThptResult;
  transcript: TranscriptResult;
  academic: AcademicResult;
  bonus: BonusResult;
  priority: PriorityResult;
  baseScore: number;
  finalScore: number;
}

/**
 * Kết quả tính điểm xét tuyển từ một ĐGNL chuẩn hóa/weightedRaw GIẢ ĐỊNH (không phải từ 4
 * điểm thành phần thi thật) — dùng cho scenario simulator và tính ngược target. Không có
 * breakdown rawScore/weightedMath như DgnlResult vì không có dữ liệu thật cho từng phần thi.
 */
export interface SimulatedAdmissionResult {
  dgnlNormalizedScore: number;
  dgnlWeightedRawScore: number;
  academic: AcademicResult;
  bonus: BonusResult;
  priority: PriorityResult;
  baseScore: number;
  finalScore: number;
}

/** Kết quả tính ngược điểm ĐGNL chuẩn hóa cần đạt để chạm điểm xét tuyển mục tiêu. */
export interface RequiredDgnlResult {
  possible: boolean;
  /** true nếu điểm xét tuyển hiện tại (với DGNL hiện có) đã đạt/vượt mục tiêu. */
  alreadyReached: boolean;
  requiredNormalizedScore: number | null;
  requiredWeightedRawScore: number | null;
  /** Điểm xét tuyển tối đa có thể đạt nếu DGNL chuẩn hóa = 100, các thành phần khác giữ nguyên. */
  maxAchievableFinalScore: number;
  /** target - điểm hiện tại (>= 0 khi chưa đạt mục tiêu). */
  gap: number;
  reason?: string;
}

export interface AdmissionConfig {
  year: number;
  weights: {
    dgnl: number;
    thpt: number;
    transcript: number;
  };
  dgnl: {
    maxPerComponent: number;
    mathMultiplier: number;
    maxWeightedTotal: number;
  };
  thpt: {
    maxPerSubject: number;
    mathMultiplier: number;
  };
  transcript: {
    maxPerSubject: number;
    mathMultiplier: number;
  };
  bonus: {
    maxTotal: number;
  };
  priority: {
    maxRaw30Scale: number;
    scaleDivisor: number;
    scaleMultiplier: number;
    reductionThreshold: number;
    reductionDivisor: number;
  };
  noDgnl: {
    /** Hệ số nhân vào điểm THPT quy đổi để ra "điểm năng lực" cho thí sinh không có ĐGNL. */
    abilityMultiplier: number;
  };
  /** Thang điểm tối đa của điểm xét tuyển (100). */
  scoreScale: number;
}
