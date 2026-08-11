import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

export interface HcmutProgram {
  id: string;
  code?: string;
  name: string;
  englishName?: string;
  /** Nhóm chương trình đào tạo (chuẩn / tiếng Anh / tiên tiến-chuyển tiếp quốc tế...). */
  group?: string;
}

export interface AdmissionCutoff {
  year: number;
  programId: string;
  score: number;
  method: 'combined';
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  /** Ngày dữ liệu được đối chiếu/thu thập, ISO date (YYYY-MM-DD). */
  accessedAt: string;
  /** Không set = 'final' (tương thích data cũ). Xem core/admissionHistory.ts. */
  status?: CutoffStatus;
  /**
   * false nếu công thức/thang điểm năm này khác đáng kể năm trước, không nên vẽ trend/gap như
   * cùng thang. Không set = coi là true (mọi cutoff hiện có đều method 'combined' như nhau).
   */
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
  /** Lần admin/data-maintainer gần nhất xác nhận lại record này còn đúng, ISO date. */
  lastReviewedAt?: string;
}
