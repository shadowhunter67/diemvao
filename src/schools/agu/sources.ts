import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface AguSource {
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
 * Nguồn đã xác minh cho AGU 2026 — research 2026-08-15, browser thật (chrome-devtools), domain
 * con `tuyensinh.agu.edu.vn` (KHÁC `agu.edu.vn`/`www.agu.edu.vn` từng bị DNS timeout ở lần research
 * trước, xem lịch sử comment cũ trong `schools/index.ts`). 4 ảnh đính kèm Thông báo 24/TB-HĐTS đã
 * mở, zoom, đọc trực tiếp — KHÔNG dùng widget "Ước tính điểm xét tuyển" (JS demo) làm nguồn cho bất
 * kỳ hằng số nào, kể cả khi trùng số với ảnh chính thức, vì widget tự ghi "hệ số giả lập".
 */
export const aguSources: AguSource[] = [
  {
    id: 'agu-threshold-2026',
    publisher: 'Trường Đại học An Giang – ĐHQG TP.HCM',
    title:
      'Thông báo 24/TB-HĐTS ngày 08/07/2026: Ngưỡng đảm bảo chất lượng đầu vào, các hệ số trong công thức xét tuyển và quy tắc quy đổi tương đương điểm xét tuyển đại học chính quy năm 2026 (4 ảnh đính kèm: bảng 43 ngành thang THPT/ĐGNL, điều kiện Luật/Sư phạm, hệ số β1/β2/β3, cam kết công bố bảng quy đổi tương đương sau)',
    url: 'https://tuyensinh.agu.edu.vn/tin-tuc/thong-bao-nguong-dam-bao-chat-luong-dau-vao-cac-he-so-trong-cong-thuc-xet-tuyen-va-quy-tac-quy-doi-tuong-duong-diem-xet-tuyen-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-15',
    publishedAt: '2026-07-08',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'agu-tuyensinh-tool-page-2026',
    publisher: 'Trường Đại học An Giang – ĐHQG TP.HCM',
    title:
      'Trang "Tuyển sinh 2026" (tuyensinh.agu.edu.vn/tuyen-sinh) — công thức ĐXT = β1×THPT + β2×ĐGNL + β3×Học bạ + [Điểm cộng] (khớp ảnh Thông báo 24/TB-HĐTS); công cụ "Ước tính điểm xét tuyển" (JS) tự ghi rõ đang dùng "hệ số giả lập (40%-40%-20%)" — KHÔNG dùng bảng ưu tiên khu vực/đối tượng, công thức giảm điểm ưu tiên, hay mức cộng điểm tối đa 10 điểm hiển thị trong widget này làm evidence (chỉ tồn tại trong JS demo, không có trong 4 ảnh đã ký của thông báo chính thức).',
    url: 'https://tuyensinh.agu.edu.vn/tuyen-sinh',
    accessedAt: '2026-08-15',
    sourceType: 'official-school',
    verification: 'cross-checked',
  },
];
