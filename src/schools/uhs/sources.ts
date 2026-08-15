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
    publisher: 'Trường Đại học Khoa học Sức khỏe - ĐHQG TP.HCM',
    title:
      'Thông tin tuyển sinh đại học chính quy năm 2026 - mã trường QSY, 6 ngành/chương trình, Phương thức 2 thang 100, w1/w2 dạng khoảng, quy đổi thiếu thành phần và điều kiện đầu vào',
    url: 'https://tuyensinh.uhsvnu.edu.vn/news.php?slug=thongtintuyensinh1',
    accessedAt: '2026-08-14',
    publishedAt: '2026-05-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'uhs-bonus-2026',
    publisher: 'Trường Đại học Khoa học Sức khỏe - ĐHQG TP.HCM',
    title:
      'Thông báo nhận chứng chỉ ngoại ngữ và kết quả kỳ thi SAT năm 2026 - điều kiện IELTS/TOEFL/TOEIC/VSTEP/SAT/trường ưu tiên, thời hạn không quá 02 năm, công thức điểm cộng official PDF',
    url: 'https://tuyensinh.uhsvnu.edu.vn/news.php?slug=diemcong',
    accessedAt: '2026-08-14',
    publishedAt: '2026-05-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
