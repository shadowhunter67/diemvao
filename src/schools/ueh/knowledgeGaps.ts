import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-13: cả 2 gap cũ ("ueh-final-conversion-step", "ueh-bonus-priority-table") đã
 * resolved — nguồn `ueh-ksa-ksv-info-2026` công bố worked example đầy đủ (hệ số quy đổi cuối) và
 * bảng điểm cộng/ưu tiên đầy đủ (không còn là ví dụ minh họa), xem `evidence.ts`. Mảng này giữ rỗng
 * (không phải xóa file — vẫn là single source of truth cho `AdmissionMethodDescriptor.knowledgeGaps`
 * nếu phát sinh gap mới sau này) thay vì báo "chưa tính được" khi đã tính được thật.
 *
 * Giới hạn phạm vi CÒN LẠI không phải "gap" theo nghĩa số liệu thiếu — là ranh giới cố ý, xem
 * `scopeNotes.ts`: chỉ Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam) có exact calculator; Đối
 * tượng 2 (THPT nước ngoài) dùng cấu trúc học bạ khác UniscoreVN chưa implement.
 */
export const uehKnowledgeGaps: KnowledgeGap[] = [];
