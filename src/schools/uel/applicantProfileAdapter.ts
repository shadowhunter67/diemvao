import type { ApplicantProfile } from '../../core/applicantProfile';

export interface UelPartialInput {
  dgnlScore?: number;
}

/**
 * Batch 5, workstream N — chứng minh HCMUT↔UEH không phải special case: UEL đọc CÙNG
 * `ApplicantProfile.exams.vact.total` mà UEH đọc, cùng thang 0-1200, không quy đổi/suy diễn gì
 * thêm ở bước này (giống hệt cách `schools/ueh/applicantProfileAdapter.ts` đọc). KHÔNG đọc
 * `exams.vact.components` — UEL chỉ cần tổng.
 */
export function buildUelEvaluationInput(profile: ApplicantProfile): UelPartialInput {
  return { dgnlScore: profile.exams?.vact?.total };
}
