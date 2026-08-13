import { Users } from 'lucide-react';

/**
 * Batch 6, workstream Q — wording thống nhất cho "field này ghi vào hồ sơ dùng chung nhiều
 * trường", thay vì mỗi trang tự viết lại 1 câu hơi khác nhau (UEH/UEL batch 5). Chỉ 1 notice mỗi
 * section ghi profile — KHÔNG lặp lại ở từng input riêng lẻ (spam).
 */
export function SharedProfileNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-1.5 text-xs text-muted ${className}`}>
      <Users size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
      Điểm này được lưu trong hồ sơ dùng chung và có thể được dùng lại ở trường khác.
    </p>
  );
}
