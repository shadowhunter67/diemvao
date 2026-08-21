import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HuitSource {
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
 * Nguồn đã xác minh cho HUIT (Trường Đại học Công Thương TP.HCM, mã trường DCT) 2026 — research
 * 2026-08-21, browser thật (chrome-devtools, đọc trực tiếp `ts.huit.edu.vn`, KHÔNG qua mirror/
 * tổng hợp bên thứ ba). Domain chính thức: `huit.edu.vn`, chuyên trang tuyển sinh `ts.huit.edu.vn`.
 *
 * Lưu ý freshness: có một bài đăng SỚM HƠN cùng domain (`thong-tin-tuyen-sinh-dai-hoc-nam-2026`,
 * ghi ngày 19/05/2026) nêu điều kiện PT1 nhóm Luật/Luật kinh tế CHỈ LÀ ĐIỀU KIỆN TỐI THIỂU TẠM THỜI
 * ("ngưỡng cuối cùng được xác định cụ thể sau khi Bộ GD&ĐT công bố kết quả kỳ thi tốt nghiệp THPT
 * năm 2026") với số liệu khác (15/18) — bài đó ĐĂNG TRƯỚC kỳ thi THPT 2026 diễn ra, không phải
 * ngưỡng cuối. `huit-quality-threshold-2026` dưới đây đăng 10/07/2026 (SAU kỳ thi, sau khi thí sinh
 * đã có điểm và đang đăng ký nguyện vọng 02/7–14/7) — đúng là bản công bố ngưỡng CUỐI CÙNG mà bài
 * 19/05 hứa hẹn công bố sau. UniscoreVN dùng bản 10/07 (current/final), không dùng số liệu
 * provisional của bản 19/05.
 */
export const huitSources: HuitSource[] = [
  {
    id: 'huit-quality-threshold-2026',
    publisher: 'Trường Đại học Công Thương TP.HCM (HUIT) — Trung tâm Tuyển sinh & Truyền thông',
    title:
      'Điểm sàn xét tuyển đại học năm 2026 Trường Đại học Công Thương TP.HCM — ngưỡng đảm bảo chất lượng đầu vào theo 4 phương thức (thi TN THPT/học tập THPT/ĐGNL ĐHQG TP.HCM/ĐGNL chuyên biệt HCMUE), 2 nhóm ngành (Luật & Luật kinh tế / các ngành còn lại)',
    url: 'https://ts.huit.edu.vn/tin-tuyen-sinh/diem-san-xet-tuyen-dai-hoc-nam-2026-truong-dai-hoc-cong-thuong-tp-hcm',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools (`document.body.innerText`) 2026-08-21 — trang ghi rõ "10/07/2026", đăng bởi Trung tâm Tuyển sinh & Truyền thông HUIT. Bảng điểm sàn CUỐI CÙNG (sau kỳ thi THPT 2026): Thi TN THPT — Luật/Luật KT 20, các ngành còn lại 16 (thang 30); Học tập THPT — Luật/Luật KT 20, các ngành còn lại 20 (thang 30, không nêu chi tiết công thức tính theo học kỳ nào); ĐGNL ĐHQG TP.HCM — Luật/Luật KT 720, các ngành còn lại 600 (thang 1200); ĐGNL chuyên biệt Trường ĐH Sư phạm TP.HCM — Luật/Luật KT 20, các ngành còn lại 20 (thang 30). Trang ghi rõ "điểm sàn là điều kiện tối thiểu để thí sinh đăng ký xét tuyển, không phải điểm trúng tuyển".',
  },
  {
    id: 'huit-admission-info-2026-superseded',
    publisher: 'Trường Đại học Công Thương TP.HCM (HUIT) — Hội đồng tuyển sinh',
    title: 'Thông tin tuyển sinh Đại học năm 2026 (bản trước kỳ thi THPT — điều kiện PT1 nhóm Luật là tạm thời, chưa phải ngưỡng cuối)',
    url: 'https://ts.huit.edu.vn/thong-bao/thong-tin-tuyen-sinh-dai-hoc-nam-2026',
    accessedAt: '2026-08-21',
    publishedAt: '2026-05-19',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'superseded', supersededBy: 'huit-quality-threshold-2026' },
    note:
      'Bài đăng 19/05/2026 (trước kỳ thi THPT 2026) — mục ngưỡng PT1 nhóm Luật/Luật kinh tế tự ghi rõ đây là điều kiện tối thiểu tạm thời, "ngưỡng cuối cùng được xác định cụ thể sau khi Bộ GD&ĐT công bố kết quả kỳ thi tốt nghiệp THPT năm 2026" (khi đó ghi 18/30 kèm điều kiện Toán≥6/Văn≥6, khác 20/30 ở bản cuối 10/07). Giữ lại record này để tránh dùng nhầm số liệu tạm thời — không dùng để tính eligibility, chỉ dùng `huit-quality-threshold-2026`.',
  },
];
