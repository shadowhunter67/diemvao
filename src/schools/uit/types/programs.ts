import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

/**
 * Định danh riêng của UIT — cố tình KHÔNG import từ schools/hcmut/* (mỗi trường độc lập, xem
 * CLAUDE.md). Field naming khớp HCMUT có chủ đích (dễ hợp nhất về sau nếu cần), nhưng chưa tạo
 * type dùng chung ở core/ vì chưa có tính năng nào thật sự tiêu thụ nó. Model lịch sử (status,
 * comparableToPrevious) generic hóa qua core/admissionHistory.ts, dùng chung với HCMUT.
 */
export interface UitProgram {
  id: string;
  code: string;
  name: string;
}

export interface UitCutoff {
  year: number;
  programId: string;
  /** Điểm trúng tuyển thang 100, đã bao gồm điểm cộng và điểm ưu tiên (theo đúng công bố gốc). */
  score: number;
  scoreScale: number;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  /** Ngày công bố gốc (khác accessedAt — ngày mình đọc/đối chiếu). */
  publishedAt: string;
  accessedAt: string;
  /** Không set = 'final' (tương thích data cũ). Xem core/admissionHistory.ts. */
  status?: CutoffStatus;
  /** false nếu phương thức/thang điểm năm này khác đáng kể năm trước. Không set = coi là true. */
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
  lastReviewedAt?: string;
}
