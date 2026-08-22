import type { AdmissionSource } from '../../core/sourceRegistry';

export const sguSources: Omit<AdmissionSource, 'schoolId'>[] = [
  {
    id: 'sgu-quality-threshold-2026',
    publisher: 'Trang tuyển sinh - Trường Đại học Sài Gòn',
    title: 'Ngưỡng đầu vào, quy tắc quy đổi tương đương và quy định về điểm xét tuyển - Kì tuyển sinh đại học chính quy năm 2026',
    url: 'https://tuyensinh.sgu.edu.vn/',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-10',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'sgu-admission-info-2026',
    publisher: 'Trang tuyển sinh - Trường Đại học Sài Gòn',
    title: 'Thông tin tuyển sinh năm 2026 (chính thức)',
    url: 'https://tuyensinh.sgu.edu.vn/index.php/tuyen-sinh/thong-tin-de-an-tuyen-sinh/nam-2026/thong-tin-tuyen-sinh-nam-2026-chinh-thuc',
    accessedAt: '2026-08-22',
    publishedAt: '2026-06-02',
    sourceType: 'official-admission',
    verification: 'incomplete',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
