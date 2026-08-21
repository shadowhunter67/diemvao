import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HsuSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  note?: string;
}

/**
 * Nguồn đã xác minh cho HSU (Trường Đại học Hoa Sen) 2026 — research 2026-08-21, browser thật
 * (chrome-devtools, đọc trực tiếp `www.hoasen.edu.vn`, KHÔNG qua mirror/tổng hợp bên thứ ba).
 * Domain chính thức: `hoasen.edu.vn`, chuyên trang tuyển sinh `tuyensinh.hoasen.edu.vn`.
 */
export const hsuSources: HsuSource[] = [
  {
    id: 'hsu-quality-threshold-2026',
    publisher: 'Trường Đại học Hoa Sen (HSU) — Phòng Marketing - Truyền thông',
    title:
      'Trường Đại học Hoa Sen công bố điểm sàn xét tuyển năm 2026 — điểm sàn cho 33 ngành, 53 chương trình đào tạo chính quy theo 4 phương thức (thi TN THPT/học bạ 3 môn 6 học kỳ/ĐGNL ĐHQG TP.HCM & Hà Nội/phỏng vấn kết hợp-tuyển thẳng)',
    url: 'https://www.hoasen.edu.vn/dai-hoc-hoa-sen-cong-bo-diem-san-xet-tuyen-nam-2026/',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-03',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools (`document.body.innerText`) 2026-08-21 — trang ghi rõ "03/07/2026". Điểm sàn: học bạ (tổ hợp 3 môn, 6 học kỳ) ≥18/30; thi TN THPT 2026 ≥15/30; ĐGNL ĐHQG TP.HCM ≥600/1200, ĐGNL ĐHQG Hà Nội ≥75 (quy đổi 15/30); phỏng vấn kết hợp/tuyển thẳng ≥18/30. Bài viết ghi rõ khối ngành Luật CHƯA có ngưỡng tại thời điểm đăng (dự kiến công bố 08/07/2026 sau khi Bộ GD&ĐT quyết định) — xem `hsu-law-threshold-2026` cho bản cập nhật.',
  },
  {
    id: 'hsu-law-threshold-2026',
    publisher: 'Trường Đại học Hoa Sen (HSU) — Phòng Marketing - Truyền thông',
    title:
      'Bộ GD&ĐT công bố điểm sàn khối ngành Luật năm 2026: Thí sinh đủ điều kiện đừng bỏ lỡ cơ hội đăng ký vào HSU — ngưỡng đảm bảo chất lượng đầu vào khối ngành Pháp luật (phương thức xét điểm thi TN THPT 2026) là 20 điểm',
    url: 'https://www.hoasen.edu.vn/diem-san-khoi-nganh-luat-2026-hsu/',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-09',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools 2026-08-21 — trang ghi rõ "09/07/2026". "điểm sàn đối với khối ngành Pháp luật là 20 điểm (tổng điểm ba môn theo tổ hợp xét tuyển, chưa nhân hệ số, đã bao gồm điểm ưu tiên nếu có)" — áp dụng phương thức xét điểm thi TN THPT 2026 (mục "Đối với các phương thức xét tuyển khác, thí sinh... cần đáp ứng các điều kiện theo quy định hiện hành của Bộ Giáo dục và Đào tạo" — KHÔNG nêu số cụ thể cho học bạ/ĐGNL/phỏng vấn nhóm Luật, xem `hsu-law-non-thpt-threshold-unpublished`). Trường tuyển 5 chương trình Pháp luật: Luật, Luật Hình sự và Tố tụng hình sự, Luật Kinh tế, Luật Kinh doanh số, Luật Thương mại quốc tế.',
  },
];
