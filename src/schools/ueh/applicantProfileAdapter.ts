import type { ApplicantProfile } from '../../core/applicantProfile';
import type { UehPartialInput } from './evaluate';

/**
 * Đọc `profile.exams.vact.total` — điểm ĐGNL ĐHQG-HCM thô, thang 0-1200 (4 phần thi × 300, KHÔNG
 * nhân hệ số Toán×2 của riêng HCMUT). Đây đúng là thang UEH dùng trong bảng quy đổi (450-1200) —
 * cùng thang UEL ("X = raw × 100/1200") và FTU ("ngưỡng 850/1200") cũng dùng, xem
 * docs/admission-research-2026.md. KHÔNG đọc `profile.exams.vact.components` (breakdown 4 phần
 * thi của HCMUT) — UEH chỉ cần tổng, không cần biết chi tiết từng phần. `schools/hcmut/
 * applicantProfileMapper.ts` tự tính `.total` = tổng 4 component KHÔNG trọng số khi ghi profile —
 * UEH không cần tự suy hay quy đổi gì thêm, chỉ đọc thẳng.
 */
export function buildUehEvaluationInput(
  profile: ApplicantProfile,
  context: { campus?: 'hcmc' | 'mekong'; knownAdmissionScore100?: number } = {}
): UehPartialInput {
  return {
    dgnlScore: profile.exams?.vact?.total,
    campus: context.campus,
    knownAdmissionScore100: context.knownAdmissionScore100,
  };
}
