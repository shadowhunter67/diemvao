import type { EvidenceCriticality, RuleLifecycle } from './freshness';
import type { SourceType } from './admissionHistory';
import type { VerificationLevel } from './trust';

/**
 * Bằng chứng cho MỘT hằng số/rule cụ thể trong công thức (khác `<school>/sources.ts` vốn liệt
 * kê nguồn ở mức dataset/trang tổng quát). Mục tiêu: từ một con số như 0.75, 75, 0.7 có thể
 * truy ngược nguồn nào chứng minh nó — dùng cho audit, KHÔNG bắt buộc runtime calculator phải
 * đọc field này (calculator vẫn dùng thẳng `AdmissionConfig`/hằng số như hiện tại).
 */
export interface RuleEvidence {
  sourceId: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceType?: SourceType;
  /** Trang/mục/bảng/dòng trong tài liệu nếu biết. */
  location?: string;
  verification: VerificationLevel;
  effectiveYear: number;
  publishedAt?: string;
  lifecycle?: RuleLifecycle;
  /**
   * Only score-affecting evidence can block exact evaluation when stale/superseded.
   * Omitted = score-affecting for existing formula provenance.
   */
  criticality?: EvidenceCriticality;
  verifiedAt?: string;
  lastReviewedAt?: string;
  /** Ghi chú về hạn chế hoặc assumption. */
  note?: string;
}

/** Wrapper gắn evidence vào một giá trị cụ thể — dùng ở registry riêng (vd `schools/<id>/evidence.ts`),
 * không nhét vào chữ ký hàm calculator để giữ code tính điểm đơn giản, dễ đọc. */
export interface SourcedRule<T> {
  value: T;
  evidence: RuleEvidence[];
}
