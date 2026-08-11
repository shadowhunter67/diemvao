import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

/** Định danh riêng của UEL — độc lập HCMUT/UIT, xem CLAUDE.md nguyên tắc mỗi trường tự quản lý. */
export interface UelProgram {
  id: string;
  code: string;
  name: string;
  /** Nhóm ngành theo đúng cách trường trình bày bảng điểm chuẩn gốc: Kinh tế / Kinh doanh và Quản lý / Pháp luật. */
  group: 'Kinh tế' | 'Kinh doanh và Quản lý' | 'Pháp luật';
}

export interface UelCutoff {
  year: number;
  programId: string;
  /** Điểm trúng tuyển thang 100, đã bao gồm điểm cộng và điểm ưu tiên (theo đúng công bố gốc). */
  score: number;
  scoreScale: number;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  publishedAt: string;
  accessedAt: string;
  status?: CutoffStatus;
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
  lastReviewedAt?: string;
}
