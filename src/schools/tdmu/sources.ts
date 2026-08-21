import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface TdmuSource {
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
 * Nguồn đã xác minh cho Đại học Thủ Dầu Một (TDMU) 2026 — đọc trực tiếp qua browser thật, domain
 * chính thức `tdmu.edu.vn`/`tuyensinh.tdmu.edu.vn`.
 */
export const tdmuSources: TdmuSource[] = [
  {
    id: 'tdmu-quality-threshold-2026',
    publisher: 'Hội đồng tuyển sinh Trường Đại học Thủ Dầu Một (TDMU)',
    title: 'Trường Đại học Thủ Dầu Một công bố ngưỡng đảm bảo chất lượng đầu vào đại học chính quy năm 2026',
    url: 'https://tdmu.edu.vn/tin-tuc/tin-dao-tao/truong-dai-hoc-thu-dau-mot-cong-bo-nguong-dam-bao-chat-luong-dau-vao-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-09',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Bài đăng chính thức của trường (Ban Biên tập TDMU), đọc trực tiếp qua browser thật, dẫn từ cuộc họp Hội đồng tuyển sinh ngày 08/7/2026. Nội dung: ngưỡng đảm bảo chất lượng đầu vào (điểm sàn nhận hồ sơ, KHÔNG phải điểm quy đổi tương đương giữa phương thức) theo 4 phương thức — (1) thi TN THPT 2026 (thang 30, điểm thô không cần quy đổi); (2) học bạ (điểm trung bình 3 môn tổ hợp qua 6 học kỳ lớp 10/11/12, thang 30 — công thức trực tiếp, KHÔNG qua bảng quy đổi); (3) ĐGNL Trường ĐH Sư phạm Hà Nội (không có field tương ứng trong `ApplicantProfile`, không model); (4) ĐGNL ĐHQG-HCM (thang 1200, điểm thô — khớp `ApplicantProfile.exams.vact.total`). Ngưỡng chung 45 ngành khác Luật/sư phạm: 15/16,5/16,5/600. Ngành Luật (7380101): 20/21,5/21,5/750. 4 ngành sư phạm (Giáo dục Tiểu học, Giáo dục Mầm non, Sư phạm Ngữ văn, Sư phạm Lịch sử, Sư phạm Toán — bài viết liệt kê 5 tên nhưng gọi là "4 ngành", có thể Ngữ văn+Lịch sử tính chung 1 ngành ghép) CHỈ dùng phương thức thi TN THPT, ngưỡng 20/30. Ngành Giáo dục Mầm non/Kiến trúc/Kỹ thuật xây dựng có điều kiện phụ riêng (công thức năng khiếu×2/3, môn năng khiếu/Toán tối thiểu) — không model (ngoài phạm vi batch threshold-only, xem knowledgeGaps).',
  },
];
