import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';

export interface UhsSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface UhsEvaluationInput {
  combinationTotal30?: number;
  subjectScores?: number[];
  transcriptTotal30?: number;
  dgnlRaw1200?: number;
  graduationYear?: number;
}

export function buildUhsEvaluationInput(profile: ApplicantProfile, subjectContext?: UhsSubjectContext): UhsEvaluationInput {
  if (!subjectContext) {
    return {
      dgnlRaw1200: profile.exams?.vact?.total,
      graduationYear: profile.graduationYear,
    };
  }

  const scores: number[] = [];
  let hasMissingThpt = false;
  for (const subjectId of subjectContext.subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) {
      hasMissingThpt = true;
      continue;
    }
    scores.push(score);
  }

  const transcriptAverages: number[] = [];
  let hasMissingTranscript = false;
  for (const subjectId of subjectContext.subjects) {
    const grade10 = profile.transcript?.grade10?.[subjectId];
    const grade11 = profile.transcript?.grade11?.[subjectId];
    const grade12 = profile.transcript?.grade12?.[subjectId];
    if (grade10 === undefined || grade11 === undefined || grade12 === undefined) {
      hasMissingTranscript = true;
      continue;
    }
    transcriptAverages.push(round2((grade10 + grade11 + grade12) / 3));
  }

  return {
    combinationTotal30: hasMissingThpt ? undefined : round2(scores.reduce((a, b) => a + b, 0)),
    subjectScores: hasMissingThpt ? undefined : scores,
    transcriptTotal30: hasMissingTranscript ? undefined : round2(transcriptAverages.reduce((a, b) => a + b, 0)),
    dgnlRaw1200: profile.exams?.vact?.total,
    graduationYear: profile.graduationYear,
  };
}
