export interface ScoreInput {
  dgnl: number;
  thpt: number;
  transcript: number;
  bonus: number;
  priority: number;
}

export type ScoreFieldKey = keyof ScoreInput;

export interface ScoreBreakdown {
  dgnlContribution: number;
  thptContribution: number;
  transcriptContribution: number;
  academicScore: number;
  bonus: number;
  priority: number;
  finalScore: number;
}

export interface AdmissionConfig {
  year: number;
  weights: {
    dgnl: number;
    thpt: number;
    transcript: number;
  };
  maxBonus: number;
  maxPriority: number;
}
