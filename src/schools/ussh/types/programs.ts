import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

/**
 * 3 chương trình xét tuyển KHÁC NHAU, giữ RIÊNG (không merge theo tên ngành) — mã xét tuyển
 * (`code`) là định danh chính thức của trường, canonical identity (Phần E "USSH program
 * variants"). Cùng 1 tên ngành có thể xuất hiện ở nhiều `track` với mã và điểm chuẩn khác nhau
 * (vd "Tâm lý học" ở Chuẩn = 7310401, ở Chuẩn quốc tế = 7310401QT).
 */
export type UsshProgramTrack = 'standard' | 'linked-2-2' | 'international-standard';

export interface UsshProgram {
  id: string;
  /** Mã xét tuyển chính thức — giữ nguyên hậu tố LK/QT/A1..., KHÔNG chuẩn hoá bỏ đi. */
  code: string;
  name: string;
  track: UsshProgramTrack;
}

/** ĐT01/ĐT02/ĐT03 — 3 đối tượng xét tuyển ứng ĐT1/ĐT2/ĐT3 trong `calculator.ts`. Giữ nguyên 3 cột
 * điểm chuẩn RIÊNG (không gộp) vì Phần I yêu cầu strict matching program + applicant-type — so
 * điểm ĐT1 với ngưỡng ĐT2 là sai ngữ cảnh. */
export interface UsshCutoff {
  year: number;
  programId: string;
  applicantTypeId: 'DT1' | 'DT2' | 'DT3';
  score: number;
  scoreScale: number;
  sourceLabel: string;
  sourceUrl: string;
  publishedAt?: string;
  accessedAt: string;
  status?: CutoffStatus;
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
}
