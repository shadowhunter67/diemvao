import type { SubjectId } from './subjects';

/**
 * Batch 6, workstream I/J — invariant cho `ApplicantProfile.thpt.scores`/`.transcript.*`:
 *
 * - key = `SubjectId` môn học thật (đã xác nhận qua `HcmutSubjectContext` hoặc tương đương).
 * - value = ĐIỂM THI THPT/HỌC BẠ THẬT của thí sinh, thang 0-10 mỗi môn (thang quốc gia, không
 *   phải tham số riêng trường nào — giống lý do `VACT_COMPONENT_RANGE` đặt ở `core/vactProfile.ts`
 *   thay vì lặp lại trong từng school config).
 * - `undefined` = CHƯA CÓ dữ liệu — khác hẳn `0` (thí sinh thật sự được 0 điểm, vẫn là factual
 *   value hợp lệ). KHÔNG dùng 0 làm giá trị "missing".
 * - KHÔNG BAO GIỜ chứa: điểm đã quy đổi từ nguồn khác (vd chứng chỉ tiếng Anh quốc tế → điểm THPT
 *   tương đương), điểm chuẩn hóa/trọng số của bất kỳ trường nào. Xem
 *   `schools/hcmut/applicantProfileMapper.ts` (`thptNonFactualSubjectIds`) cho cơ chế loại các
 *   giá trị không phải điểm thi thật khỏi profile trước khi ghi.
 */
export const THPT_SUBJECT_SCORE_RANGE = { min: 0, max: 10 } as const;

export function isValidThptScore(value: number): boolean {
  return value >= THPT_SUBJECT_SCORE_RANGE.min && value <= THPT_SUBJECT_SCORE_RANGE.max;
}

export interface ThptScoreValidationIssue {
  subjectId: SubjectId;
  message: string;
}

export interface ThptScoreValidationResult {
  valid: boolean;
  issues: ThptScoreValidationIssue[];
}

/** Audit-only — không throw, không chặn UI realtime. Dùng cho test/dev assertion hoặc safe-repair
 * ở storage layer nếu sau này cần (hiện chưa cần — không có invariant xung đột giữa nhiều field
 * như V-ACT, mỗi SubjectId độc lập với nhau). Cùng hàm này dùng được cho cả `thpt.scores` VÀ
 * `transcript.grade10/11/12` (batch 6, workstream L) — cùng shape `Partial<Record<SubjectId,
 * number>>`, cùng thang 0-10, cùng invariant (raw factual grade, không phải điểm chuẩn hóa/trọng
 * số) — không cần 1 hàm/engine transcript riêng chỉ để lặp lại đúng logic này. */
export function validateThptScores(scores: Partial<Record<SubjectId, number>> | undefined): ThptScoreValidationResult {
  const issues: ThptScoreValidationIssue[] = [];
  if (!scores) return { valid: true, issues };

  for (const [subjectId, value] of Object.entries(scores) as [SubjectId, number | undefined][]) {
    if (value === undefined) continue;
    if (!isValidThptScore(value)) {
      issues.push({
        subjectId,
        message: `Điểm môn ${subjectId} phải trong khoảng ${THPT_SUBJECT_SCORE_RANGE.min}-${THPT_SUBJECT_SCORE_RANGE.max}`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}
