import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';

export interface IuSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface IuEvaluationInput {
  thptRawTotal30?: number;
  transcriptTotal30?: number;
  dgnlRaw1200?: number;
  /** Điểm chứng chỉ ngoại ngữ factual — dùng cho "Điểm khuyến khích" (`bonus.ts`), đọc thẳng từ
   * `ApplicantProfile.certificates`, không map/quy đổi ở tầng adapter. */
  ielts?: number;
  toeflIbt?: number;
  toeic?: number;
  /** Mã khu vực/đối tượng ưu tiên ('KV1', 'UT1'...) — đọc thẳng từ `ApplicantProfile.priority`. */
  priorityRegion?: string;
  priorityCategory?: string;
}

/** Cùng cách đọc `ApplicantProfile.thpt`/`transcript`/`exams.vact` như UEL/USSH — Học bạ tổ hợp =
 * tổng, mỗi môn lấy trung bình cả năm lớp 10/11/12 (trường không công bố trọng số khác năm). */
export function buildIuEvaluationInput(profile: ApplicantProfile, subjectContext?: IuSubjectContext): IuEvaluationInput {
  const dgnlRaw1200 = profile.exams?.vact?.total;
  const shared = {
    ielts: profile.certificates?.ielts,
    toeflIbt: profile.certificates?.toeflIbt,
    toeic: profile.certificates?.toeic,
    priorityRegion: profile.priority?.region,
    priorityCategory: profile.priority?.category,
  };
  if (!subjectContext) return { dgnlRaw1200, ...shared };

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
    if (g10 === undefined || g11 === undefined || g12 === undefined) hasMissingTranscript = true;
    else transcriptTotal += (g10 + g11 + g12) / 3;
  }

  return {
    dgnlRaw1200,
    thptRawTotal30: hasMissingThpt ? undefined : round2(thptTotal),
    transcriptTotal30: hasMissingTranscript ? undefined : round2(transcriptTotal),
    ...shared,
  };
}
