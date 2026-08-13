import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface UhsSource {
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

export const uhsSources: UhsSource[] = [
  {
    id: 'uhs-info-2026',
    publisher: 'Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM',
    title:
      'Thông tin tuyển sinh 2026 — 5 ngành (Y khoa, Dược, Răng Hàm Mặt, Y học cổ truyền, Điều dưỡng), Phương thức 1 (tuyển thẳng) + Phương thức 2 (tổng hợp), ngưỡng Y khoa/Dược ≥20/30 hoặc từng môn ≥8.5/10',
    url: 'https://tuyensinh.uhsvnu.edu.vn/news.php?slug=thongtintuyensinh1',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uhs-bonus-2026',
    publisher: 'Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM',
    title: 'Điều kiện xét điểm cộng 2026 — chứng chỉ ngoại ngữ quốc tế, SAT ≥1280, học sinh 149 trường ưu tiên',
    url: 'https://tuyensinh.uhsvnu.edu.vn/news.php?slug=diemcong',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
