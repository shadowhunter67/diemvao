import type { SubjectId } from '../../../core/subjects';

/**
 * Danh tính thật của "Môn 2"/"Môn 3" trong form HCMUT — KHÔNG đặt trong `core/ApplicantProfile`
 * (đó chỉ giữ factual scores) và KHÔNG đặt trong `AdmissionInput`/`calculator.ts` (calculator vẫn
 * chỉ cần numeric, không cần biết môn gì — giữ đúng nguyên tắc "calculator không biết
 * ApplicantProfile"). Đây là school CONTEXT — cách HCMUT diễn giải 2 con số subject2/subject3
 * thành môn học cụ thể, chỉ cần khi build `ApplicantProfile` (batch 4) hoặc hiển thị nhãn.
 *
 * `null` = chưa chọn — hợp lệ, không ép buộc (form vẫn tính điểm bình thường không cần biết môn,
 * chỉ ApplicantProfile-mapping mới cần). Legacy state (trước batch 4) luôn có 2 field null.
 */
export interface HcmutSubjectContext {
  subject2: SubjectId | null;
  subject3: SubjectId | null;
}

export const defaultHcmutSubjectContext: HcmutSubjectContext = {
  subject2: null,
  subject3: null,
};
