import type { ApplicantProfile } from './applicantProfile';

/**
 * Batch 6, workstream R — pure helper tóm tắt `ApplicantProfile` cho UI cấp cao (landing) mà
 * KHÔNG bắt UI tự inspect nested field (`profile.exams?.vact?.total`...). Chỉ đếm/trích field đã
 * có consumer thật — không thêm field mới vào summary chỉ vì `ApplicantProfile` có sẵn.
 */
export interface ApplicantProfileSummary {
  hasData: boolean;
  vactTotal?: number;
  thptSubjectCount: number;
  transcriptSubjectCount: number;
}

function countDefinedKeys(record: Partial<Record<string, number>> | undefined): number {
  if (!record) return 0;
  return Object.values(record).filter((value) => value !== undefined).length;
}

export function summarizeApplicantProfile(profile: ApplicantProfile): ApplicantProfileSummary {
  const vactTotal = profile.exams?.vact?.total;
  const thptSubjectCount = countDefinedKeys(profile.thpt?.scores);
  // Học bạ đếm theo số môn CÓ ít nhất 1 năm đã nhập (không cộng dồn 3 năm thành số lớn gây hiểu
  // nhầm "10 môn" khi thật ra chỉ 3 môn × nhiều năm) — dùng union key giữa 3 năm.
  const transcriptSubjectIds = new Set<string>();
  for (const year of [profile.transcript?.grade10, profile.transcript?.grade11, profile.transcript?.grade12]) {
    if (!year) continue;
    for (const [subjectId, value] of Object.entries(year)) {
      if (value !== undefined) transcriptSubjectIds.add(subjectId);
    }
  }

  const hasData = vactTotal !== undefined || thptSubjectCount > 0 || transcriptSubjectIds.size > 0;

  return {
    hasData,
    vactTotal,
    thptSubjectCount,
    transcriptSubjectCount: transcriptSubjectIds.size,
  };
}
