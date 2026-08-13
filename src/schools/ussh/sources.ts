import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface UsshSource {
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

export const usshSources: UsshSource[] = [
  {
    id: 'ussh-threshold-2026',
    publisher: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    title:
      'Thông báo ngưỡng đảm bảo chất lượng đầu vào năm 2026 — THPT/Học bạ ≥17, ĐGNL (V-ACT) ≥620, áp dụng mọi ngành/tổ hợp, chưa gồm ưu tiên/điểm cộng',
    url: 'https://www.hcmussh.edu.vn/bai-viet/thong-bao-nguong-dam-bao-chat-luong-dau-vao-nam-2026',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
