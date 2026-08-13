/**
 * Guardrail cho share URL/localStorage: field nào KHÔNG được phép serialize (danh tính, ngày
 * sinh, đối tượng chính sách dạng text...). Uniscore hiện client-only, không backend/login —
 * lợi thế privacy này phải giữ khi `ApplicantProfile` (workstream C) mở rộng field trong tương
 * lai. Danh sách dưới đây là "danh sách cấm" kiểm bằng test (xem
 * `schools/hcmut/urlState.test.ts` mục privacy guardrail) trên MỌI key thật sự được ghi vào
 * URL/localStorage — không phải allowlist đầy đủ (không biết trước hết field tương lai), chỉ
 * chặn các pattern rõ ràng nhạy cảm nếu ai đó vô tình thêm vào.
 */
export const FORBIDDEN_SHARE_KEY_PATTERNS: RegExp[] = [
  /name/i,
  /hoten/i,
  /ho_ten/i,
  /cccd/i,
  /cmnd/i,
  /dob/i,
  /birth/i,
  /ngaysinh/i,
  /sdt/i,
  /phone/i,
  /email/i,
  /address/i,
  /diachi/i,
];

export function isForbiddenShareKey(key: string): boolean {
  return FORBIDDEN_SHARE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}
