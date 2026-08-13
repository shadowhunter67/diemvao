import type { ApplicantProfile } from '../../core/applicantProfile';
import type { UehPartialInput } from './evaluate';

/**
 * Đọc `profile.exams.vact.total` — điểm ĐGNL-HCM TỔNG (thang ~450-1200, đúng cách UEH công bố
 * bảng quy đổi) — KHÁC hẳn `profile.exams.vact.components` mà HCMUT adapter đọc (4 phần thi,
 * thang 300 mỗi phần, tổng có hệ số ra thang 1500). Đây là 2 con số CÙNG một kỳ thi ĐGNL ĐHQG-HCM
 * nhưng 2 cách trường công bố khác nhau — KHÔNG có bảng quy đổi verified giữa 2 thang này, nên
 * KHÔNG tự suy ra `.total` từ `.components` (sẽ là bịa số). `ApplicantProfile` giữ cả 2 field
 * riêng biệt đúng vì lý do này — mỗi trường chỉ đọc field mà trường đó thật sự dùng.
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
