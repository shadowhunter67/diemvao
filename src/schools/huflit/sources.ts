import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HuflitSource {
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
 * Nguồn đã xác minh cho HUFLIT (Trường Đại học Ngoại ngữ - Tin học TP.HCM) 2026 — research
 * 2026-08-18. Domain chính thức: `huflit.edu.vn`, `tuyensinh.huflit.edu.vn`,
 * `thongtintuyensinh.huflit.edu.vn` — CHÚ Ý: `tuyensinh.huflis.edu.vn` (đuôi "huflis", KHÔNG phải
 * "huflit") xuất hiện trong kết quả tìm kiếm nhưng KHÔNG được dùng làm nguồn — không xác minh được
 * đây là domain chính thức của trường (tên trường viết tắt HUFLIT, không có "huflis"), loại bỏ
 * theo tinh thần "không dùng blog SEO/domain không xác minh thay official source".
 *
 * `huflit-admission-plan-2026` (02/4/2026) tự nói ngưỡng đầu vào PT1 "sẽ công bố sau khi có kết
 * quả thi tốt nghiệp THPT 2026" — batch trước dừng ở đây. Re-audit tìm được
 * `huflit-threshold-announcement-2026` (09/7/2026) — supersede statement đó, công bố đủ ngưỡng cả
 * 3 phương thức. Bảng điểm thưởng/điểm khuyến khích CỤ THỂ (số điểm theo loại thành tích/chứng
 * chỉ) — đã tìm kỹ nhưng KHÔNG định vị được trang/PDF chính thức nào công bố bảng số, xem
 * `knowledgeGaps.ts` (khác lớp bug "stale gap" của HCMUTE — đây là "đã tìm kỹ, thật sự chưa công
 * khai dạng đọc được", không phải research cũ chưa cập nhật).
 */
export const huflitSources: HuflitSource[] = [
  {
    id: 'huflit-admission-plan-2026',
    publisher: 'Trường Đại học Ngoại ngữ - Tin học TP.HCM (HUFLIT)',
    title:
      'HUFLIT công bố thông tin Tuyển sinh năm 2026 — phạm vi/đối tượng, 4 phương thức xét tuyển (PT1 thi THPT/PT2 học bạ/PT3 ĐGNL ĐHQG-HCM/PT4 xét thẳng), công thức PT1 "tổng điểm 3 môn thi THPT theo tổ hợp", công thức PT2 "tổng điểm TB 3 môn 3 năm", điều kiện xét tuyển từng phương thức',
    url: 'https://huflit.edu.vn/vi/tin-tuc/huflit-cong-bo-thong-tin-tuyen-sinh-nam-2026/',
    accessedAt: '2026-08-18',
    publishedAt: '2026-04-02',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'huflit-threshold-announcement-2026',
    publisher: 'Trường Đại học Ngoại ngữ - Tin học TP.HCM (HUFLIT)',
    title:
      'HUFLIT chính thức công bố ngưỡng điểm bảo đảm chất lượng đầu vào (điểm sàn) xét tuyển đại học năm 2026 — PT1: 15/30 (Luật/Luật kinh tế: 20/30); PT2: 18/30 (Luật/Luật kinh tế: 21/30); PT3 (ĐGNL): 550/1200 (Luật/Luật kinh tế: 720/1200)',
    url: 'https://huflit.edu.vn/vi/tin-tuc/huflit-cong-bo-nguong-diem-bao-dam-chat-luong-dau-vao-diem-san-xet-tuyen-dai-hoc-nam-2026/',
    accessedAt: '2026-08-18',
    publishedAt: '2026-07-09',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current', supersededBy: undefined },
  },
];
