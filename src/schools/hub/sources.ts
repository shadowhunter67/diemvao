import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HubSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  /** Ghi chú provenance bổ sung khi `url`/`publishedAt` không đủ diễn đạt. */
  note?: string;
}

/**
 * Nguồn đã xác minh cho HUB (Trường Đại học Ngân hàng TP. Hồ Chí Minh) 2026 — đọc trực tiếp qua
 * browser thật, KHÔNG qua mirror/tổng hợp bên thứ ba. Domain chính thức: `hub.edu.vn`,
 * `tuyensinh.hub.edu.vn` (mã trường NHS).
 */
export const hubSources: HubSource[] = [
  {
    id: 'hub-quality-threshold-2026',
    publisher: 'Hội đồng tuyển sinh Trường Đại học Ngân hàng TP. Hồ Chí Minh (HUB, mã trường NHS)',
    title:
      'Thông Báo Ngưỡng Điểm Đảm Bảo Chất Lượng Đầu Vào (Điểm Sàn) Và Quy Đổi Tương Đương Điểm Trúng Tuyển Giữa Các Phương Thức, Tổ Hợp Môn Xét Tuyển Đại Học Chính Quy Năm 2026 Của Trường Đại Học Ngân Hàng TP. Hồ Chí Minh',
    url: 'https://tuyensinh.hub.edu.vn/tin-tuyen-sinh/thong-bao-nguong-diem-dam-bao-chat-luong-dau-vao-diem-san-va-quy-doi-tuong-duong-diem-trung-tuyen-giua-cac-phuong-thuc-to-hop-mon-xet-tuyen-dai-hoc-chinh-quy-nam-2026-cua-truong-dai-hoc-ngan-hang-tp-ho-chi-minh',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-11',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Thông báo chính thức đọc trực tiếp qua browser thật (không phải nguồn thứ cấp/tổng hợp). Nội dung: (I) ngưỡng đảm bảo chất lượng đầu vào (điểm sàn) theo 3 phương thức (thi TN THPT/Tổng hợp/V-SAT) — 15/30 cho các ngành trừ Luật, 20/30 cho khối Luật (khu vực 3, kèm điều kiện môn Toán/Ngữ văn theo tổ hợp), điều kiện IELTS ≥5.5 riêng cho ngành Tài chính - Ngân hàng Chương trình Tinh hoa (Elite Class); (II) quy định quy đổi tương đương điểm trúng tuyển giữa các phương thức/tổ hợp bằng nội suy tuyến tính, chi tiết nằm ở Phụ lục I (bảng phân vị V-SAT) và Phụ lục II (khung quy đổi phương thức Tổng hợp) — 2 phụ lục này chỉ có nút Download trên trang, URL PDF thật không lộ ra trong DOM snapshot đã lấy, nội dung bảng số liệu KHÔNG đọc được ở lần research này (xem `knowledgeGaps.ts`). Cổng tra cứu điểm quy đổi riêng (`xettuyen.hub.edu.vn/quy-doi-diem`) là ứng dụng động (không phải trang tĩnh), cũng chưa parse được.',
  },
];
