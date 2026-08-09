/** String-based mirror of AdmissionInput, used to keep controlled inputs free-typing (allows "", "9.", decimals in progress). */
export interface DgnlFormState {
  vietnamese: string;
  english: string;
  math: string;
  scientificThinking: string;
}

export interface ThptFormState {
  math: string;
  subject2: string;
  subject3: string;
}

export interface TranscriptYearFormState {
  math: string;
  subject2: string;
  subject3: string;
}

export interface TranscriptFormState {
  grade10: TranscriptYearFormState;
  grade11: TranscriptYearFormState;
  grade12: TranscriptYearFormState;
}

export interface BonusFormState {
  reward: string;
  considerationReward: string;
  encouragement: string;
}

export interface AdmissionFormState {
  dgnl: DgnlFormState;
  thpt: ThptFormState;
  transcript: TranscriptFormState;
  bonus: BonusFormState;
  priorityRaw30Scale: string;
}
