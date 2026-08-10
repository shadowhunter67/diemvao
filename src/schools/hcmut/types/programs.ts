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
}
