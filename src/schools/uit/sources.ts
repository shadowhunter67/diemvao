import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface UitSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  /** Lần admin/data-maintainer gần nhất xác nhận lại record này còn đúng, ISO date. Optional — chỉ set khi có review thật, không backfill hàng loạt. */
  lastReviewedAt?: string;
}

/**
 * Nguồn đã xác minh cho UIT — chỉ những gì thật sự đọc được trực tiếp từ trang chính thức.
 * Phần chuẩn hóa chi tiết (THPT/ĐGNL/học bạ quy đổi thế nào, nhánh không-ĐGNL, ưu tiên riêng)
 * KHÔNG có nguồn text đọc được (chỉ tồn tại dạng ảnh/PDF không truy cập được) — không liệt kê
 * ở đây như một nguồn đã xác minh, xem ghi chú "chưa đủ dữ liệu" ở UitInfoPage.tsx.
 */
export const uitSources: UitSource[] = [
  {
    id: 'uit-weights-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title: 'Trọng số xét tuyển tổng hợp 2026: THPT 47,5% + ĐGNL 47,5% + Học bạ 5%, điểm cộng tối đa 10/100',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026',
    accessedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uit-threshold-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title:
      'Thông báo ngưỡng đảm bảo chất lượng đầu vào 2026 (THPT ≥22, ĐGNL ≥717, ngành Thiết kế vi mạch cao hơn)',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-bao-nguong-dam-bao-chat-luong-dau-vao-theo-phuong-thuc-xet-tuyen-tong-hop-nam-2026',
    accessedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uit-cutoffs-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title: 'Công bố điểm chuẩn trúng tuyển 2026, phương thức Xét tuyển Tổng hợp (19 ngành, thang 100)',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-bao-diem-trung-tuyen-theo-phuong-thuc-xet-tuyen-tong-hop',
    accessedAt: '2026-08-10',
    publishedAt: '2026-08-09',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uit-bonus-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title:
      'Thông báo đăng ký minh chứng xét điểm cộng 2026 — 4 nhóm điểm cộng (tối đa 10/5/5/5), tổng cap 10/100',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-bao-ve-viec-dang-ky-thong-tin-minh-chung-xet-diem-cong-dung-de-xet-tuyen-theo-phuong-thuc-tong-hop-vao-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uit-certificate-registration-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title:
      'Thông báo đăng ký chứng chỉ quốc tế 2026 — ngưỡng đăng ký minh chứng (SAT≥1080/ACT≥21/A-Level≥67%/IB≥29)',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-bao-ve-viec-dang-ky-thong-tin-chung-chi-quoc-te-dung-de-xet-tuyen-theo-phuong-thuc-tong-hop-vao-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uit-direct-admission-2026',
    publisher: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    title: 'Thông báo tuyển thẳng theo Điều 8 Quy chế tuyển sinh đại học của Bộ GD&ĐT năm 2026',
    url: 'https://tuyensinh.uit.edu.vn/2026-thong-bao-ve-viec-tuyen-thang-theo-quy-dinh-tai-dieu-8-quy-che-tuyen-sinh-dai-hoc-cua-bo-gddt-vao-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
