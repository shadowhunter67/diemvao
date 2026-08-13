import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface IuSource {
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

export const iuSources: IuSource[] = [
  {
    id: 'iu-method2-2026',
    publisher: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
    title:
      'Thông báo về việc Xét tuyển tổng hợp (Phương thức 2) 2026 — công thức Điểm học lực = k1*THPT + k2*ĐGNL + k3*Học bạ (k1=40%, k2=50%, k3=10%), ngưỡng ≥50/100, đọc qua trình duyệt thật (accordion JS)',
    url: 'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-bao-ve-viec-xet-tuyen-tong-hop-phuong-thuc-2/',
    accessedAt: '2026-08-13',
    publishedAt: '2026-06-07',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
