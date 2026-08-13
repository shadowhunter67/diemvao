import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface DataSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  kind: 'official' | 'official-republication' | 'news-republication';
  sourceType?: SourceType;
  publishedAt?: string;
  /** Mức độ tin cậy thật của evidence — dùng để hiển thị wording đúng mức, không nói mạnh hơn bằng chứng. */
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  /** Lần admin/data-maintainer gần nhất xác nhận lại record này còn đúng, ISO date. Optional — chỉ set khi có review thật, không backfill hàng loạt. */
  lastReviewedAt?: string;
}

/**
 * Nguồn công thức/dữ liệu HCMUT đang dùng trong calculator. Xem đối chiếu đầy đủ (kể cả các
 * trường khác đã research nhưng chưa implement) tại docs/admission-research-2026.md.
 */
export const hcmutSources: DataSource[] = [
  {
    id: 'hcmut-formula-2026',
    publisher: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
    title: 'Công bố thông tin tuyển sinh đại học chính quy năm 2026',
    url: 'https://hcmut.edu.vn/tintuc/cong-bo-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-10',
    kind: 'official',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmut-de-an-2026',
    publisher: 'Trường Đại học Bách khoa – ĐHQG TP.HCM (republished)',
    title: 'Đề án tuyển sinh 2026 — Đối tượng 2.2 (không có ĐGNL): điểm năng lực = điểm THPT quy đổi × 0.75',
    url: 'https://diemthi.tuyensinh247.com/de-an-tuyen-sinh/dai-hoc-bach-khoa-hcm-QSB.html',
    accessedAt: '2026-08-10',
    kind: 'official-republication',
    verification: 'cross-checked',
  },
  {
    id: 'hcmut-english-cert-2026',
    publisher: 'Trường Đại học Bách khoa – ĐHQG TP.HCM',
    title: 'Quy đổi chứng chỉ tiếng Anh quốc tế sang điểm thi THPT',
    url: 'https://hcmut.edu.vn/tintuc/quy-doi-chung-chi-tieng-anh',
    accessedAt: '2026-08-10',
    kind: 'official',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmut-cutoffs-cross-check',
    publisher: 'Báo chí (nhiều nguồn, cross-check)',
    title: 'Điểm chuẩn HCMUT các năm — xem chi tiết từng cutoff trong data/cutoffs.ts (sourceLabel/sourceUrl riêng từng dòng)',
    url: 'https://hcmut.edu.vn',
    accessedAt: '2026-08-10',
    kind: 'news-republication',
    sourceType: 'secondary',
    verification: 'cross-checked',
  },
];
