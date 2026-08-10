/**
 * Mức độ tin cậy của một nguồn/dữ liệu, dùng chung mọi trường — KHÔNG được nói mạnh hơn
 * bằng chứng thật có. Chọn giá trị theo evidence cụ thể của từng item, không mặc định lạc quan.
 */
export type VerificationLevel = 'verified' | 'official-source-available' | 'cross-checked' | 'incomplete';

const LABELS: Record<VerificationLevel, string> = {
  verified: 'Đã xác minh từ nguồn chính thức',
  'official-source-available': 'Có nguồn chính thức, đang xác minh chi tiết',
  'cross-checked': 'Đã đối chiếu nhiều nguồn',
  incomplete: 'Đang chờ xác minh đầy đủ',
};

export function verificationLabel(level: VerificationLevel): string {
  return LABELS[level];
}
