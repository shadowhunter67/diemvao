import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';

export interface UelPartialInput {
  dgnlScore?: number;
  thptRawTotal30?: number;
  transcriptTotal30?: number;
  thptSubjectScores?: Partial<Record<SubjectId, number>>;
}

export interface UelSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

/**
 * Batch 5, workstream N — chứng minh HCMUT↔UEH không phải special case: UEL đọc CÙNG
 * `ApplicantProfile.exams.vact.total` mà UEH đọc, cùng thang 0-1200, không quy đổi/suy diễn gì
 * thêm ở bước này (giống hệt cách `schools/ueh/applicantProfileAdapter.ts` đọc). KHÔNG đọc
 * `exams.vact.components` — UEL chỉ cần tổng.
 *
 * Batch 8 — bắt đầu reuse THPT factual profile ở UEL, nhưng chỉ khi có `UelSubjectContext` do user
 * chọn ở UI. `ApplicantProfile` chỉ biết điểm môn thật; tổ hợp A00/A01/B00/D01 là ngữ cảnh riêng
 * của UEL, không ghi vào profile. Nếu thiếu 1 môn, `thptRawTotal30` vẫn là `undefined` (missing ≠
 * 0); nếu điểm thật là 0, adapter vẫn giữ 0 và cộng đúng vào tổng.
 */
export function buildUelEvaluationInput(profile: ApplicantProfile, subjectContext?: UelSubjectContext): UelPartialInput {
  const input: UelPartialInput = { dgnlScore: profile.exams?.vact?.total };
  if (!subjectContext) return input;

  const thptSubjectScores: Partial<Record<SubjectId, number>> = {};
  let hasMissingSubject = false;
  let total = 0;
  let hasMissingTranscript = false;
  let transcriptTotal = 0;

  for (const subjectId of subjectContext.subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) {
      hasMissingSubject = true;
      continue;
    }
    thptSubjectScores[subjectId] = score;
    total += score;

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
    ...input,
    thptSubjectScores,
    thptRawTotal30: hasMissingSubject ? undefined : round2(total),
    transcriptTotal30: hasMissingTranscript ? undefined : round2(transcriptTotal),
  };
}
