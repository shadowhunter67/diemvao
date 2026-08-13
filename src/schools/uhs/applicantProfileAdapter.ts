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
}

export function buildUhsEvaluationInput(profile: ApplicantProfile, subjectContext?: UhsSubjectContext): UhsEvaluationInput {
  if (!subjectContext) return {};

  const scores: number[] = [];
  let hasMissing = false;
  for (const subjectId of subjectContext.subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) {
      hasMissing = true;
      continue;
    }
    scores.push(score);
  }

  return {
    combinationTotal30: hasMissing ? undefined : round2(scores.reduce((a, b) => a + b, 0)),
    subjectScores: hasMissing ? undefined : scores,
  };
}
