import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HcmusSource {
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

export const hcmusSources: HcmusSource[] = [
  {
    id: 'hcmus-threshold-method2-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    title:
      'Thông báo về ngưỡng đảm bảo chất lượng Phương thức 2 năm 2026 — ngưỡng THPT tổ hợp ≥15,00/30, điều kiện riêng ngành Thiết kế vi mạch/Kỹ thuật hạt nhân',
    url: 'https://tuyensinh.hcmus.edu.vn/2026-thong-bao-ve-nguong-dam-bao-chat-luong-phuong-thuc-2/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-methods-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    title: 'Phương thức tuyển sinh 2026 — mô tả Phương thức 1a/1b/2 (THPT hoặc ĐGNL kết hợp học bạ 3 năm)',
    url: 'https://tuyensinh.hcmus.edu.vn/phuong-thuc-tuyen-sinh/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-info-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    title: 'Thông tin tuyển sinh 2026 — 39 ngành/nhóm ngành, chỉ tiêu, tổ hợp',
    url: 'https://tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'cross-checked',
  },
];
