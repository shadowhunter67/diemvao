import type { AdmissionSource } from '../../core/sourceRegistry';

export const hnueSources: Omit<AdmissionSource, 'schoolId'>[] = [
  {
    id: 'hnue-quality-threshold-2026',
    publisher: 'Trường Đại học Sư phạm Hà Nội',
    title: 'Ngưỡng bảo đảm chất lượng đầu vào năm 2026',
    url: 'https://tuyensinh.hnue.edu.vn/thong-bao/667',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-08',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'hnue-spt-conversion-2026',
    publisher: 'Trường Đại học Sư phạm Hà Nội',
    title: 'Thông báo về Quy đổi điểm PT2, SPT2026',
    url: 'https://tuyensinh.hnue.edu.vn/thong-bao',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-06',
    sourceType: 'official-admission',
    verification: 'incomplete',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
