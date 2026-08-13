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
}

/** Đọc lại `profile.thpt.scores` theo tổ hợp người dùng chọn — cùng field HCMUT/UEL/UIT đã dùng,
 * không bắt nhập lại. Toán/Lý đọc trực tiếp (dùng cho điều kiện riêng ngành Kỹ thuật hạt nhân) dù
 * tổ hợp đang chọn có chứa 2 môn đó hay không. */
export function buildHcmusEvaluationInput(profile: ApplicantProfile, subjectContext?: HcmusSubjectContext): HcmusEvaluationInput {
  const mathScore = profile.thpt?.scores?.math;
  const physicsScore = profile.thpt?.scores?.physics;

  if (!subjectContext) return { mathScore, physicsScore };

  let total = 0;
  let hasMissingSubject = false;
  for (const subjectId of subjectContext.subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) {
      hasMissingSubject = true;
      continue;
    }
    total += score;
  }

  return {
    thptRawTotal30: hasMissingSubject ? undefined : round2(total),
    mathScore,
    physicsScore,
  };
}
