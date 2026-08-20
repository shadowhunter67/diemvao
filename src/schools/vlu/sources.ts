import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface VluSource {
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
 * Nguồn đã xác minh cho VLU (Trường Đại học Văn Lang) 2026 — research 2026-08-19/20, browser thật
 * (chrome-devtools, đọc trực tiếp `www.vlu.edu.vn`, KHÔNG qua mirror/tổng hợp bên thứ ba). Domain
 * chính thức: `vlu.edu.vn`, `tuyensinh.vlu.edu.vn` (mã trường DVL). Trang lưu trữ "Đề án tuyển
 * sinh" chính thức (`vlu.edu.vn/dynamic/de-an-tuyen-sinh`) tại thời điểm research CHƯA có bản 2026
 * (chỉ có 2018/2023/2024/2025) — không tìm được PDF Đề án 2026 nào, nên 2 nguồn dưới đây (tin tức
 * chính thức trên chính domain trường, đọc trực tiếp qua devtools) là evidence tốt nhất hiện có.
 */
export const vluSources: VluSource[] = [
  {
    id: 'vlu-admission-info-2026',
    publisher: 'Trường Đại học Văn Lang (VLU) — Phòng Tuyển sinh và Truyền thông',
    title:
      'Trường Đại học Văn Lang công bố thông tin tuyển sinh đại học chính quy 2026 — 64 ngành, 06 phương thức xét tuyển (thi TN THPT/học bạ/kết hợp học bạ+ĐGNL-ĐGTD-chứng chỉ quốc tế/kết hợp thi TN THPT+năng khiếu/kết hợp học bạ+năng khiếu/xét thẳng), điều kiện xét tuyển từng phương thức, ngưỡng đảm bảo chất lượng khối Sức khỏe và Luật, ngưỡng môn năng khiếu (Piano/Thanh nhạc/Sân khấu Điện ảnh)',
    url: 'https://www.vlu.edu.vn/news/truong-dai-hoc-van-lang-cong-bo-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026',
    accessedAt: '2026-08-20',
    publishedAt: '2026-08-15',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools (`document.body.innerText`, không qua tool fetch tóm tắt) 2026-08-20 — trang ghi rõ "NGÀY 15/08/2026", tác giả "Phòng Tuyển sinh và Truyền thông". Đây là nguồn CHÍNH cho: danh sách 6 phương thức, nguyên tắc "môn thi chính nhân hệ số 2" (không kèm danh mục ngành áp dụng — xem knowledgeGaps.ts), điều kiện học lực lớp 12 (giỏi/khá) + điểm thay thế cho khối Sức khỏe/Luật ở phương thức 2-5 (không áp dụng phương thức 1), và ngưỡng môn năng khiếu.',
  },
  {
    id: 'vlu-quality-threshold-2026',
    publisher: 'Trường Đại học Văn Lang (VLU) — tác giả bài viết: Mai Yến',
    title:
      'Trường Đại học Văn Lang công bố điểm sàn tuyển sinh 2026: Mở rộng phương thức xét tuyển, nâng chuẩn chương trình Global Elite — bảng ngưỡng đảm bảo chất lượng đầu vào (điểm sàn) theo nhóm ngành cho phương thức xét điểm thi TN THPT, và ngưỡng bổ sung cho phương thức học bạ/kết hợp',
    url: 'https://www.vlu.edu.vn/news/truong-dai-hoc-van-lang-cong-bo-diem-san-tuyen-sinh-2026-mo-rong-phuong-thuc-xet-tuyen-nang-chuan-chuong-trinh-global-elite',
    accessedAt: '2026-08-20',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools 2026-08-20. Trang ghi ngày đăng KHÔNG ổn định giữa 2 lần đọc (lần 1 qua tool fetch tóm tắt: "31/08/2026" kèm "17205 lượt xem"; lần 2 qua devtools đọc trực tiếp DOM vài phút sau: "31/08/2026" kèm "17206 lượt xem" — lượt xem tăng nhưng NGÀY hiển thị 31/08/2026 là ngày TƯƠNG LAI so với thời điểm truy cập 20/08/2026, tức không thể là ngày đăng thật). KHÔNG dùng ngày này làm `publishedAt` (để trống, không suy đoán) — chỉ ghi chú lại để maintainer sau biết đây là artifact hiển thị lỗi của CMS trường, không phải lỗi đọc dữ liệu của UniscoreVN. Nội dung số liệu (bảng ngưỡng 15/18/20/22, điều kiện học lực+điểm thay thế) khớp 100% với `vlu-admission-info-2026` ở phần trùng lặp — cross-verified giữa 2 bài viết độc lập trên cùng domain chính thức.',
  },
];
