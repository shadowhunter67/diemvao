import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HcmulawSource {
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
 * Nguồn đã xác minh cho HCMULAW (Trường Đại học Luật Thành phố Hồ Chí Minh) 2026 — research
 * 2026-08-20. Domain chính thức: `hcmulaw.edu.vn`, `ts.hcmulaw.edu.vn` (thông báo phương thức),
 * `tuyensinh.hcmulaw.edu.vn` (thông báo ngưỡng đầu vào). Cả 2 trang đọc trực tiếp qua
 * chrome-devtools (innerText đầy đủ + screenshot cho bảng dạng ảnh), KHÔNG qua mirror/OCR gián
 * tiếp — WebFetch thô bị lỗi TLS chain trên domain này (`unable to verify the first certificate`),
 * dùng browser thật (chrome-devtools MCP) để đọc được nội dung.
 */
export const hcmulawSources: HcmulawSource[] = [
  {
    id: 'hcmulaw-method-notice-2026',
    publisher: 'Trường Đại học Luật Thành phố Hồ Chí Minh (HCMULAW)',
    title:
      'Thông báo phương thức tuyển sinh chính thức năm 2026 — 5 phương thức (301 tuyển thẳng/410 kết hợp học bạ+chứng chỉ quốc tế hoặc SAT/200 học bạ trường ưu tiên ĐHQG-HCM/417 V-SAT/100 thi TN THPT), công thức ĐXT = điểm tổ hợp + điểm cộng (nếu có) + điểm ưu tiên (nếu có) trên thang 30, bảng điểm khuyến khích chứng chỉ ngoại ngữ/SAT, danh mục 11 ngành + mã ngành + tổ hợp môn xét tuyển',
    url: 'https://ts.hcmulaw.edu.vn/thong-tin-tuyen-sinh-dai-hoc/thong-bao-phuong-thuc-tuyen-sinh-chinh-thuc-nam-2026-733.html',
    accessedAt: '2026-08-20',
    publishedAt: '2026-04-28',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp toàn bộ nội dung trang (~22.700 ký tự) qua chrome-devtools evaluate_script (innerText), không phải bảng ảnh — bao gồm cả 2 bảng quy đổi điểm khuyến khích (chứng chỉ tiếng Anh/SAT và chứng chỉ Pháp/Nhật/Trung) dạng HTML text đọc được trực tiếp, không cần OCR.',
  },
  {
    id: 'hcmulaw-quality-threshold-2026',
    publisher: 'Trường Đại học Luật Thành phố Hồ Chí Minh (HCMULAW)',
    title:
      'Thông báo về việc xác định ngưỡng đảm bảo chất lượng đầu vào đối với các ngành đào tạo trình độ đại học hình thức đào tạo chính quy năm 2026 — mã ngành/tổ hợp/số lượng tuyển sinh theo 2 cơ sở (LPS Tp.HCM, LPQ Phân hiệu Quảng Trị), bảng ngưỡng đầu vào theo (ngành × tổ hợp), điều kiện phụ nhóm ngành Luật, công thức tính điểm học bạ M1/M2/M3',
    url: 'https://tuyensinh.hcmulaw.edu.vn/thong-tin-tuyen-sinh-dai-hoc/thong-bao-ve-viec-xac-dinh-nguong-dam-bao-chat-luong-dau-vao-doi-voi-cac-nganh-dao-tao-trinh-do-dai-hoc-hinh-thuc-dao-tao-chinh-quy-nam-2026-cua-truong-dai-hoc-luat-thanh-pho-ho-chi-minh-763.html',
    accessedAt: '2026-08-20',
    publishedAt: '2026-07-09',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Bảng ngưỡng đầu vào theo (ngành × tổ hợp) là 1 ảnh nhúng trong trang (`upload/images/2026/SÀN + QUY ĐỔI/diemsan.png`, 1920×1920) — đọc bằng chrome-devtools take_screenshot trực tiếp trên ảnh gốc (không qua mirror/OCR bên thứ ba), transcribe đủ 11 dòng ngành × 15 cột tổ hợp. Phát hiện: trong phạm vi mỗi ngành, ngưỡng là 1 giá trị DUY NHẤT áp dụng cho MỌI tổ hợp mà ngành đó công bố xét tuyển (không có tổ hợp nào có ngưỡng khác biệt trong cùng 1 ngành) — vì vậy model hoá threshold theo `programId` (không cần theo từng combination code). Ghi chú dưới bảng (verbatim): "Mức điểm ngưỡng đầu vào nêu trên đã bao gồm điểm cộng (trừ ngành Luật, ngành Luật thương mại quốc tế và ngành Quản trị - Luật là không tính điểm cộng), điểm ưu tiên theo khu vực và điểm ưu tiên theo đối tượng chính sách theo quy định của Quy chế tuyển sinh của Bộ Giáo dục và Đào tạo và của Trường."',
  },
];
