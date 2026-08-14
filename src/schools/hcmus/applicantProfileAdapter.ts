import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { round2 } from '../../core/round2';

export interface HcmusSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface HcmusEvaluationInput {
  thptRawTotal30?: number;
  mathScore?: number;
  physicsScore?: number;
  /** Học bạ tổ hợp (thang 30) — trung bình 3 năm mỗi môn, cùng quy ước USSH/UEL (trường không
   * công bố trọng số khác nhau theo năm). */
  transcriptTotal30?: number;
  /** Điểm ĐGNL ĐHQG-HCM thô, thang 1200 — đọc từ `profile.exams.vact.total`, dùng chung field với
   * UEH/UEL/USSH (cùng 1 kỳ thi). */
  vactRaw1200?: number;
}

/** Đọc lại `profile.thpt.scores`/`profile.transcript`/`profile.exams.vact` theo tổ hợp người dùng
 * chọn — cùng field HCMUT/UEL/UIT/USSH đã dùng, không bắt nhập lại. Toán/Lý đọc trực tiếp (dùng
 * cho điều kiện riêng ngành Kỹ thuật hạt nhân) dù tổ hợp đang chọn có chứa 2 môn đó hay không. */
export function buildHcmusEvaluationInput(profile: ApplicantProfile, subjectContext?: HcmusSubjectContext): HcmusEvaluationInput {
  const mathScore = profile.thpt?.scores?.math;
  const physicsScore = profile.thpt?.scores?.physics;
  const vactRaw1200 = profile.exams?.vact?.total;

  if (!subjectContext) return { mathScore, physicsScore, vactRaw1200 };

  let total = 0;
  let hasMissingSubject = false;
  let transcriptTotal = 0;
  let hasMissingTranscript = false;
  for (const subjectId of subjectContext.subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) {
      hasMissingSubject = true;
    } else {
      total += score;
    }

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
    thptRawTotal30: hasMissingSubject ? undefined : round2(total),
    mathScore,
    physicsScore,
    transcriptTotal30: hasMissingTranscript ? undefined : round2(transcriptTotal),
    vactRaw1200,
  };
}
