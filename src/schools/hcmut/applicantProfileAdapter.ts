import type { ApplicantProfile } from '../../core/applicantProfile';
import type { MissingRequirement } from '../../core/admissionEvaluation';
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

export type BuildHcmutAdmissionInputResult = { ok: true; input: AdmissionInput } | { ok: false; requirement: MissingRequirement };

/**
 * Internal control-flow error — KHÔNG BAO GIỜ leak ra ngoài module này dưới dạng chưa phân loại.
 * Mang sẵn `MissingRequirement` structured (kind/code/label) tại đúng chỗ phát hiện thiếu dữ liệu,
 * thay vì để caller đoán ngược từ `error.message` bằng substring match (bug cũ ở
 * `schools/hcmut/comparison.ts`, xem `docs/architecture.md`). `buildHcmutAdmissionInputResult`
 * catch đúng loại này và trả `requirement` structured; bất kỳ error nào KHÁC (thật sự ngoài dự
 * kiến — không phải "user chưa nhập đủ") được re-throw nguyên trạng, không bị gán nhầm code.
 */
class HcmutInputRequirementError extends Error {
  requirement: MissingRequirement;

  constructor(requirement: MissingRequirement) {
    super(requirement.label);
    this.name = 'HcmutInputRequirementError';
    this.requirement = requirement;
  }
}

function requireSubjectScore(
  scores: Partial<Record<string, number>> | undefined,
  subjectId: string,
  stage: string,
  requirementCode: string
): number {
  const value = scores?.[subjectId];
  if (value === undefined) {
    throw new HcmutInputRequirementError({
      kind: 'profile-input',
      code: requirementCode,
      label: `ApplicantProfile thiếu điểm môn "${subjectId}" cho ${stage} — không thể build HCMUT AdmissionInput.`,
    });
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
    math: requireSubjectScore(scores, mathId, yearLabel, 'hcmut-transcript'),
    subject2: requireSubjectScore(scores, subject2Id, yearLabel, 'hcmut-transcript'),
    subject3: requireSubjectScore(scores, subject3Id, yearLabel, 'hcmut-transcript'),
  };
}

/**
 * Map `ApplicantProfile` (factual, dùng chung nhiều trường) → `AdmissionInput` (HCMUT-specific)
 * cho đối tượng 2.1 (có ĐGNL). Ném `HcmutInputRequirementError` (nội bộ) rõ ràng nếu thiếu dữ
 * liệu bắt buộc thay vì âm thầm điền 0 (0 là một điểm số hợp lệ, không phải giá trị "thiếu").
 * Không đổi `calculateAdmissionScore` — adapter chỉ dịch input, giữ calculator thuần túy như hiện
 * tại. Dùng chung cho cả 2 public entrypoint bên dưới (`buildHcmutAdmissionInput` throw-based,
 * `buildHcmutAdmissionInputResult` Result-based) — 1 nguồn logic detect duy nhất.
 */
function buildAdmissionInputOrThrow(profile: ApplicantProfile, context: HcmutMethodContext): AdmissionInput {
  const [mathId, subject2Id, subject3Id] = context.combination.subjects;
  if (mathId !== 'math' || !subject2Id || !subject3Id) {
    throw new HcmutInputRequirementError({
      kind: 'school-context',
      code: 'hcmut-invalid-combination',
      label: 'HcmutMethodContext.combination phải có dạng [math, mônA, mônB] — HCMUT luôn có Toán trong tổ hợp.',
    });
  }

  const vact = profile.exams?.vact?.components;
  if (!vact) {
    throw new HcmutInputRequirementError({
      kind: 'profile-input',
      code: 'hcmut-dgnl',
      label: 'ApplicantProfile thiếu exams.vact.components — bắt buộc cho đối tượng có ĐGNL.',
    });
  }

  return {
    dgnl: {
      vietnamese: requireSubjectScore(vact, 'vietnamese', 'ĐGNL', 'hcmut-dgnl'),
      english: requireSubjectScore(vact, 'english', 'ĐGNL', 'hcmut-dgnl'),
      math: requireSubjectScore(vact, 'math', 'ĐGNL', 'hcmut-dgnl'),
      scientificThinking: requireSubjectScore(vact, 'scientificThinking', 'ĐGNL', 'hcmut-dgnl'),
    },
    thpt: {
      math: requireSubjectScore(profile.thpt?.scores, mathId, 'THPT', 'hcmut-thpt'),
      subject2: requireSubjectScore(profile.thpt?.scores, subject2Id, 'THPT', 'hcmut-thpt'),
      subject3: requireSubjectScore(profile.thpt?.scores, subject3Id, 'THPT', 'hcmut-thpt'),
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

/**
 * Result-based entrypoint — dùng bởi `schools/hcmut/comparison.ts` (expected "user chưa nhập đủ
 * dữ liệu" KHÔNG nên là exception; kind Result diễn tả tốt hơn cho use case comparison batch nhiều
 * trường). Chỉ `HcmutInputRequirementError` được convert sang `{ ok: false, requirement }` —
 * error nào khác (thật sự ngoài dự kiến, ví dụ bug ở nơi khác) được re-throw nguyên trạng, KHÔNG bị
 * gán nhầm 1 requirement code cụ thể (an toàn nhưng trung thực, xem
 * `comparison.ts`'s catch-all top-level).
 */
export function buildHcmutAdmissionInputResult(profile: ApplicantProfile, context: HcmutMethodContext): BuildHcmutAdmissionInputResult {
  try {
    return { ok: true, input: buildAdmissionInputOrThrow(profile, context) };
  } catch (error) {
    if (error instanceof HcmutInputRequirementError) return { ok: false, requirement: error.requirement };
    throw error;
  }
}

/**
 * Throw-based entrypoint — giữ nguyên cho caller hiện có (`applicantProfileAdapter.test.ts`,
 * `applicantProfile.crossSchool.test.ts`) muốn "cho tôi input hoặc throw", không cần xử lý Result.
 * Cùng logic detect với `buildHcmutAdmissionInputResult` (không duplicate rule) — chỉ khác cách
 * trả kết quả ra ngoài.
 */
export function buildHcmutAdmissionInput(profile: ApplicantProfile, context: HcmutMethodContext): AdmissionInput {
  return buildAdmissionInputOrThrow(profile, context);
}
