/**
 * Vòng đời tri thức/dữ liệu — khác `VerificationLevel` (chất lượng của MỘT nguồn cụ thể).
 * `KnowledgeStatus` mô tả trạng thái của một RULE/FACT mà Uniscore đang biết (hay chưa biết):
 * "nguồn official nhưng chưa parse được" khác hẳn "không có nguồn nào"; "trường tự ghi dự kiến"
 * khác hẳn "final"; "2 nguồn official mâu thuẫn nhau" là state riêng, không được ngầm chọn 1
 * trong 2. Không thay thế `VerificationLevel` — dùng như 1 dimension khác, có thể đi kèm nhau.
 */
export type KnowledgeStatus =
  | 'verified'
  | 'provisional'
  | 'conflicting-sources'
  | 'official-but-unparsed'
  | 'incomplete'
  | 'superseded';

const LABELS: Record<KnowledgeStatus, string> = {
  verified: 'Đã xác minh',
  provisional: 'Trường ghi rõ đây là con số dự kiến, có thể đổi',
  'conflicting-sources': 'Nhiều nguồn chính thức nêu số liệu khác nhau',
  'official-but-unparsed': 'Nguồn chính thức tồn tại nhưng chưa đọc được dạng text (ảnh/PDF quét)',
  incomplete: 'Chưa tìm được nguồn chính thức',
  superseded: 'Đã bị thay thế bởi thông báo mới hơn',
};

export function knowledgeStatusLabel(status: KnowledgeStatus): string {
  return LABELS[status];
}

/** Một khoảng trống tri thức cụ thể (rule/fact chưa tính được) — machine-readable thay vì hard-code
 * text rải trong UI, để domain layer là nguồn sự thật duy nhất (xem `schools/uit/knowledgeGaps.ts`). */
export interface KnowledgeGap {
  id: string;
  label: string;
  status: KnowledgeStatus;
  note?: string;
}
