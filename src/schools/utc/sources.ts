import type { AdmissionSource } from '../../core/sourceRegistry';

export const utcSources: Omit<AdmissionSource, 'schoolId'>[] = [
  {
    id: 'utc-quality-threshold-2026',
    publisher: 'Cổng thông tin tuyển sinh Đại học chính quy - Trường Đại học Giao thông vận tải',
    title: 'Ngưỡng đảm bảo chất lượng đầu vào xét tuyển đại học chính quy năm 2026',
    url: 'https://tuyensinh.utc.edu.vn/?q=tin-tuyen-sinh%2Fng%C6%B0%E1%BB%A1ng-%C4%91%E1%BA%A3m-b%E1%BA%A3o-ch%E1%BA%A5t-l%C6%B0%E1%BB%A3ng-%C4%91%E1%BA%A7u-v%C3%A0o-x%C3%A9t-tuy%E1%BB%83n-%C4%91%E1%BA%A1i-h%E1%BB%8Dc-ch%C3%ADnh-quy-n%C4%83m-2026',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-07',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
