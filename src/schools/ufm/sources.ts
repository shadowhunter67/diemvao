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
      'UFM công bố thông tin tuyển sinh đại học chính quy năm 2026 — 5 phương thức (301 xét thẳng/200 học bạ/402 ĐGNL ĐHQG TP.HCM/416 V-SAT/100 thi TN THPT), 5 nhóm chương trình (Chuẩn/Định hướng đặc thù/Tích hợp/Tiếng Anh toàn phần/Tài năng), 8.000 chỉ tiêu',
    url: 'https://tuyensinh.ufm.edu.vn/vi/thong-tin-tuyen-sinh-dai-hoc-chinh-quy/chinh-thuc-thong-tin-tuyen-sinh-ufm-2026',
    accessedAt: '2026-08-18',
    publishedAt: '2026-03-03',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'ufm-quality-threshold-2026',
    publisher: 'Trường Đại học Tài chính – Marketing (UFM)',
    title:
      'UFM công bố ngưỡng đảm bảo chất lượng đầu vào tuyển sinh đại học chính quy năm 2026 — 4 phương thức tính điểm × 2 nhóm ngành (chuẩn/Luật kinh tế), điều kiện riêng Luật kinh tế (Toán ≥6 trước hệ số, không môn nào <1), KHÔNG còn "sẽ công bố sau"',
    url: 'https://ufm.edu.vn/ufm-cong-bo-nguong-dam-bao-chat-luong-dau-vao-tuyen-sinh-dai-hoc-chinh-quy-nam-2026-2113.html',
    accessedAt: '2026-08-18',
    publishedAt: '2026-07-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
