import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

export interface IuProgram {
  id: string;
  code: string;
  name: string;
  /** true nếu là chương trình liên kết đào tạo với đại học nước ngoài (khác chương trình do
   * ĐHQT tự cấp bằng) — nguồn tách 2 nhóm riêng trong cùng thông báo điểm chuẩn. */
  isJointProgram?: boolean;
}

export interface IuCutoff {
  year: number;
  programId: string;
  /** Điểm trúng tuyển thang 100, đã bao gồm điểm cộng và điểm ưu tiên (theo đúng công bố gốc). */
  score: number;
  scoreScale: number;
  sourceLabel: string;
  sourceUrl: string;
  publishedAt: string;
  accessedAt: string;
  status?: CutoffStatus;
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
}
