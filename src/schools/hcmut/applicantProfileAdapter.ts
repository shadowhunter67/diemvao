import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectCombination } from '../../core/subjects';
import type { AdmissionInput, BonusInput, TranscriptYear } from './types/admission';

/**
 * Thông tin riêng của phương thức HCMUT KHÔNG nằm trong `ApplicantProfile` (không phải factual
 * data dùng chung nhiều trường) — điểm cộng/ưu tiên là quy định riêng HCMUT, tổ hợp môn quyết
 * định môn nào map vào "Môn 2"/"Môn 3" của form (form hiện tại dùng field trung tính, không gắn
 * tên môn cụ thể — xem `ThptSection.tsx`/Phase 8 trong CLAUDE.md).
 */
export interface HcmutMethodContext {
  /** subjects[0] PHẢI là 'math' (HCMUT luôn có Toán trong tổ hợp) — subjects[1]/[2] map vào
   * "Môn 2"/"Môn 3". Dùng COMMON_SUBJECT_COMBINATIONS hoặc tổ hợp tùy chỉnh. */
  combination: SubjectCombination;
  bonus: BonusInput;
  priorityRaw30Scale: number;
}

function requireSubjectScore(scores: Partial<Record<string, number>> | undefined, subjectId: string, stage: string): number {
  const value = scores?.[subjectId];
  if (value === undefined) {
    throw new Error(`ApplicantProfile thiếu điểm môn "${subjectId}" cho ${stage} — không thể build HCMUT AdmissionInput.`);
  }
  return value;
}

function buildTranscriptYear(
  scores: Partial<Record<string, number>> | undefined,
  mathId: string,
  subject2Id: string,
  subject3Id: string,
  yearLabel: string
): TranscriptYear {
  return {
    math: requireSubjectScore(scores, mathId, yearLabel),
    subject2: requireSubjectScore(scores, subject2Id, yearLabel),
    subject3: requireSubjectScore(scores, subject3Id, yearLabel),
  };
}

/**
 * Map `ApplicantProfile` (factual, dùng chung nhiều trường) → `AdmissionInput` (HCMUT-specific)
 * cho đối tượng 2.1 (có ĐGNL). Ném lỗi rõ ràng nếu thiếu dữ liệu bắt buộc thay vì âm thầm điền 0
 * (0 là một điểm số hợp lệ, không phải giá trị "thiếu"). Không đổi `calculateAdmissionScore` —
 * adapter chỉ dịch input, giữ calculator thuần túy như hiện tại.
 */
export function buildHcmutAdmissionInput(profile: ApplicantProfile, context: HcmutMethodContext): AdmissionInput {
  const [mathId, subject2Id, subject3Id] = context.combination.subjects;
  if (mathId !== 'math' || !subject2Id || !subject3Id) {
    throw new Error('HcmutMethodContext.combination phải có dạng [math, mônA, mônB] — HCMUT luôn có Toán trong tổ hợp.');
  }

  const vact = profile.exams?.vact?.components;
  if (!vact) {
    throw new Error('ApplicantProfile thiếu exams.vact.components — bắt buộc cho đối tượng có ĐGNL.');
  }

  return {
    dgnl: {
      vietnamese: requireSubjectScore(vact, 'vietnamese', 'ĐGNL'),
      english: requireSubjectScore(vact, 'english', 'ĐGNL'),
      math: requireSubjectScore(vact, 'math', 'ĐGNL'),
      scientificThinking: requireSubjectScore(vact, 'scientificThinking', 'ĐGNL'),
    },
    thpt: {
      math: requireSubjectScore(profile.thpt?.scores, mathId, 'THPT'),
      subject2: requireSubjectScore(profile.thpt?.scores, subject2Id, 'THPT'),
      subject3: requireSubjectScore(profile.thpt?.scores, subject3Id, 'THPT'),
    },
    transcript: {
      grade10: buildTranscriptYear(profile.transcript?.grade10, mathId, subject2Id, subject3Id, 'học bạ lớp 10'),
      grade11: buildTranscriptYear(profile.transcript?.grade11, mathId, subject2Id, subject3Id, 'học bạ lớp 11'),
      grade12: buildTranscriptYear(profile.transcript?.grade12, mathId, subject2Id, subject3Id, 'học bạ lớp 12'),
    },
    bonus: context.bonus,
    priorityRaw30Scale: context.priorityRaw30Scale,
  };
}
