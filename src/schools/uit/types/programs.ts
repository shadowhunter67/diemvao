/**
 * Định danh riêng của UIT — cố tình KHÔNG import từ schools/hcmut/* (mỗi trường độc lập, xem
 * CLAUDE.md). Field naming khớp HCMUT có chủ đích (dễ hợp nhất về sau nếu cần), nhưng chưa tạo
 * type dùng chung ở core/ vì chưa có tính năng nào thật sự tiêu thụ nó.
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
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  accessedAt: string;
}
