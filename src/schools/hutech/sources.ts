import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HutechSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
}

/**
 * Nguồn đã xác minh cho HUTECH (Trường Đại học Công nghệ TP.HCM) 2026 — research 2026-08-18.
 * Domain chính thức: `hutech.edu.vn`, `www.hutech.edu.vn`, `tuyensinh.hutech.edu.vn`,
 * `dangkytuyensinh.hutech.edu.vn`.
 *
 * LƯU Ý về đánh số phương thức: trang phương án tuyển sinh (`hutech-admission-plan-2026`) và trang
 * ngưỡng đảm bảo chất lượng (`hutech-quality-threshold-2026`) gọi tên "Phương thức 3"/"Phương thức 4"
 * cho V-SAT/ĐGNL theo THỨ TỰ NGƯỢC NHAU giữa 2 lần fetch (không xác định được số hiệu chính thức
 * nhất quán) — vì vậy module này KHÔNG dùng nhãn "PT1..PT4", chỉ dùng tên mô tả theo loại kỳ thi
 * (thpt/hocba/vsat/dgnl) để tránh gán sai số hiệu. Đây là 1 dạng "conflicting-sources" nhẹ, xem
 * `knowledgeGaps.ts:hutech-method-numbering-inconsistent`.
 *
 * `hutech-cutoff-2026` (điểm chuẩn TRÚNG TUYỂN, công bố ~09/8/2026) CỐ TÌNH không dùng làm ngưỡng
 * đầu vào cho công thức — theo đúng phân biệt bắt buộc "ngưỡng đảm bảo chất lượng" ≠ "điểm chuẩn
 * trúng tuyển" (PHẦN A của batch). Chỉ giữ làm nguồn tham khảo/context.
 */
export const hutechSources: HutechSource[] = [
  {
    id: 'hutech-admission-plan-2026',
    publisher: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
    title:
      'HUTECH công bố phương án tuyển sinh Đại học chính quy năm 2026 — 4 phương thức (thi TN THPT 2026 / học bạ THPT 6 học kỳ / V-SAT 2026 / ĐGNL ĐHQG TP.HCM 2026), điều kiện riêng ngành Luật/Luật kinh tế/Dược/Điều dưỡng/Kỹ thuật xét nghiệm y học/Y khoa, 63 ngành',
    url: 'https://www.hutech.edu.vn/tuyensinh/tin-tuyen-sinh/14630721-hutech-cong-bo-phuong-an-tuyen-sinh-dai-hoc-chinh-quy-du-kien-nam-2026',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'hutech-quality-threshold-2026',
    publisher: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
    title:
      'HUTECH công bố ngưỡng đảm bảo chất lượng đầu vào đại học 2026 — bảng đầy đủ 4 phương thức × 4 nhóm ngành (Y khoa/Dược+Luật+Luật kinh tế/Điều dưỡng+Kỹ thuật xét nghiệm y học/các ngành còn lại), KHÔNG còn câu "sẽ công bố sau"',
    url: 'https://www.hutech.edu.vn/tuyensinh/tin-tuyen-sinh/14634076-hutech-cong-bo-nguong-dam-bao-chat-luong-dau-vao-dai-hoc-2026',
    accessedAt: '2026-08-18',
    publishedAt: '2026-07-04',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'hutech-cutoff-2026',
    publisher: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
    title:
      'HUTECH chính thức công bố điểm chuẩn năm 2026 (điểm thi THPT từ 15-22 điểm) — điểm chuẩn TRÚNG TUYỂN, khác ngưỡng đảm bảo chất lượng ở trên. Dùng làm nguồn tham khảo/context, KHÔNG dùng làm ngưỡng đầu vào công thức eligibility.',
    url: 'https://www.hutech.edu.vn/tuyensinh/tin-tuyen-sinh/14634620-hutech-chinh-thuc-cong-bo-diem-chuan-nam-2026-diem-thi-thpt-tu-15-22-diem',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'cross-checked',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
