import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';

export interface UsshSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface UsshEvaluationInput {
  thptRawTotal30?: number;
  transcriptTotal30?: number;
  dgnlRaw1200?: number;
}

/** Đọc lại `ApplicantProfile.thpt`/`transcript`/`exams.vact` — không map field mới, dùng đúng
 * fact đã có sẵn. Học bạ tổ hợp = tổng, mỗi môn lấy TRUNG BÌNH CỘNG 3 năm (lớp 10/11/12) — trường
 * không công bố trọng số theo năm khác nhau (khác UEH 1:2:3), nên dùng trung bình đơn giản. */
export function buildUsshEvaluationInput(profile: ApplicantProfile, subjectContext?: UsshSubjectContext): UsshEvaluationInput {
  const dgnlRaw1200 = profile.exams?.vact?.total;
  if (!subjectContext) return { dgnlRaw1200 };

  let thptTotal = 0;
  let transcriptTotal = 0;
  let hasMissingThpt = false;
  let hasMissingTranscript = false;

  for (const subjectId of subjectContext.subjects) {
    const thptScore = profile.thpt?.scores?.[subjectId];
    if (thptScore === undefined) hasMissingThpt = true;
    else thptTotal += thptScore;

    const g10 = profile.transcript?.grade10?.[subjectId];
    const g11 = profile.transcript?.grade11?.[subjectId];
    const g12 = profile.transcript?.grade12?.[subjectId];
    if (g10 === undefined || g11 === undefined || g12 === undefined) {
      hasMissingTranscript = true;
    } else {
      transcriptTotal += (g10 + g11 + g12) / 3;
    }
  }

  return {
    dgnlRaw1200,
    thptRawTotal30: hasMissingThpt ? undefined : round2(thptTotal),
    transcriptTotal30: hasMissingTranscript ? undefined : round2(transcriptTotal),
  };
}
