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
  /** Thang điểm tối đa của điểm xét tuyển (100). */
  scoreScale: number;
}
