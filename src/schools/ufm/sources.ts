import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface UfmSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  /** Ghi chú provenance bổ sung (vd file PDF cụ thể + cách verify) khi `url` không đủ diễn đạt. */
  note?: string;
}

/**
 * Nguồn đã xác minh cho UFM (Trường Đại học Tài chính – Marketing) 2026 — research 2026-08-18.
 * Domain chính thức: `ufm.edu.vn`, `tuyensinh.ufm.edu.vn`.
 *
 * `ufm-admission-plan-2026` (03/3/2026) công bố 5 phương thức (mã 301/200/402/416/100) nhưng KHÔNG
 * có công thức chi tiết/hệ số. `ufm-quality-threshold-2026` (10/7/2026) bổ sung ngưỡng đầy đủ, xác
 * nhận KHÔNG còn "sẽ công bố sau". Trang thông báo quy đổi tương đương tìm được
 * (`tuyensinh.ufm.edu.vn/.../thong-bao-nguong-dau-vao-hoc-ba...`) khi mở ra có ngày đăng **23/7/2025**
 * (chu kỳ tuyển sinh NĂM TRƯỚC, không phải 2026) — KHÔNG dùng làm nguồn 2026, chỉ ghi chú ở đây để
 * tránh ai nhầm lẫn lần sau (đúng lớp lỗi "stale source" HCMUTE/HUFLIT đã phát hiện, nhưng theo
 * chiều ngược: nguồn tìm được LẠI CŨ hơn batch hiện tại, không phải gap "sẽ công bố sau" chưa
 * resolve).
 */
export const ufmSources: UfmSource[] = [
  {
    id: 'ufm-admission-plan-2026',
    publisher: 'Trường Đại học Tài chính – Marketing (UFM)',
    title:
      'UFM công bố thông tin tuyển sinh đại học chính quy năm 2026 — 5 phương thức (301 xét thẳng/200 học bạ/402 ĐGNL ĐHQG TP.HCM/416 V-SAT/100 thi TN THPT), 5 nhóm chương trình (Chuẩn/Định hướng đặc thù/Tích hợp/Tiếng Anh toàn phần/Tài năng), 8.000 chỉ tiêu, công thức "Điểm xét tuyển" từng phương thức + bảng điểm cộng b1/b2/b3',
    url: 'https://tuyensinh.ufm.edu.vn/vi/thong-tin-tuyen-sinh-dai-hoc-chinh-quy/chinh-thuc-thong-tin-tuyen-sinh-ufm-2026',
    accessedAt: '2026-08-19',
    publishedAt: '2026-06-01',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Trang trên chỉ có tóm tắt + link download; nội dung công thức/bảng điểm cộng đọc từ file đính kèm chính thức "Quyết định 2322/QĐ-ĐHTCM ngày 01/6/2026" tại ' +
      'https://login.ufm.edu.vn/Resources/Docs/SubDomain/tuyensinh/2026/THONGTINTS2026-FINAL_compressed.pdf (subdomain login.ufm.edu.vn — cùng domain gốc ufm.edu.vn) — ' +
      'verified 2026-08-19 bằng chrome-devtools screenshot trực tiếp trang PDF (không qua OCR/mirror): trang 5 (hệ số Toán×2 chỉ chương trình Tiếng Anh toàn phần) và trang 7 (bảng điểm cộng b1/b2/b3 + Bảng 1 chứng chỉ Tiếng Anh) khớp 100% với nội dung đã đọc qua mirror giaoduc247.vn ở batch trước (2026-08-18) — mirror giờ chỉ còn vai trò cross-check phụ, KHÔNG còn là nguồn chính.',
  },
  {
    id: 'ufm-quality-threshold-2026',
    publisher: 'Trường Đại học Tài chính – Marketing (UFM)',
    title:
      'Thông báo 2639/TB-ĐHTCM (10/7/2026) — Ngưỡng đảm bảo chất lượng đầu vào và quy đổi tương đương điểm giữa các phương thức xét tuyển ĐHCQ năm 2026 — 4 phương thức tính điểm × 2 nhóm ngành (chuẩn/Luật kinh tế), điều kiện riêng Luật kinh tế (Toán ≥6 trước hệ số, không môn nào <1), bảng bách phân vị quy đổi tương đương điểm (mục 3)',
    url: 'https://tuyensinh.ufm.edu.vn/vi/thong-tin-tuyen-sinh-dai-hoc-chinh-quy/thong-bao-nguong-dam-bao-chat-luong-dau-vao-va-quy-doi-tuong-duong-diem-giua-cac-phuong-thuc-xet-tuyen-dhcq-nam-2026-cua-truong-dh-tai-chinh-marketing',
    accessedAt: '2026-08-19',
    publishedAt: '2026-07-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'File PDF gốc (8 trang, có dấu/chữ ký, số 2639/TB-ĐHTCM): https://login.ufm.edu.vn/Resources/Docs/SubDomain/tuyensinh/2026/%5B20260710%5D%202639-TB%20Ngu%CC%9Bo%CC%9Bng%20d%C3%A2%CC%89m%20ba%CC%89o%20cha%CC%81t%20lu%CC%9Bo%CC%9Bng%20d%C3%A2%CC%80u%20va%CC%80o%20va%CC%80%20quy%20d%C3%B4%CC%89i%20tu%CC%9Bo%CC%9Bng%20du%CC%9Bo%CC%9Bng%20d%C3%A2%CC%89m%20gi%C6%B0%CC%83a%20ca%CC%81c%20phu%CC%9Bo%CC%9Bng%20thu%CC%81c%20xe%CC%81t%20tuy%C3%AA%CC%89n%20DHCQ%20n%C4%83m%202026%20cu%CC%89a%20Tru%CC%9Bo%CC%9Bng%20DH%20UFM_2506.pdf ' +
      '— verified 2026-08-19 bằng chrome-devtools screenshot trực tiếp. Trang 2-4: bảng ngưỡng đầu vào (khớp số liệu đã ghi ở batch trước) + xác nhận thang V-SAT tổng 3 môn = 450 (trước đây CHƯA biết thang tối đa). Trang 4 mục 3.1 trở đi: bảng "Khung quy đổi tương đương điểm" theo "khoảng phân vị" (percentile bands) — mục 3.1 (học bạ ↔ thi TN THPT) đã đọc được vài dòng đầu (Khoảng 1: học bạ [28,65–30,00] ↔ thi TN [25,75–30,00]; Khoảng 2: [27,15–28,64]↔[24,25–25,74]; Khoảng 3: [25,95–27,14]↔[23,25–24,24]), nhưng bảng đầy đủ (nhiều "khoảng" + còn mục 3.2 ĐGNL↔thi TN, 3.3 V-SAT↔thi TN dự kiến ở trang 5-8) CHƯA transcribe hết trong batch này — xem knowledgeGaps.ts:ufm-final-score-conversion-unparsed. QUAN TRỌNG: theo `THONGTINTS2026-FINAL_compressed.pdf` trang 5, "Điểm xét tuyển" chính thức của CẢ 3 phương thức học bạ/ĐGNL/V-SAT đều phải quy đổi qua bảng này sang thang 30 trước khi cộng điểm ưu tiên/điểm cộng — KHÔNG phải dùng thẳng thang gốc (1200 cho ĐGNL, thang riêng cho V-SAT).',
  },
];
