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
  /**
   * 2 nguồn dưới — infographic chính thức USSH (mã trường QSX hiển thị trên ảnh) do NGƯỜI DÙNG
   * cung cấp trực tiếp trong hội thoại 2026-08-13/14 — không phải kết quả fetch web của
   * UniscoreVN. `url` trỏ về domain chính thức đã verified ở source trên (root, UniscoreVN chưa
   * tự fetch lại đúng subpage đang host các ảnh này — Phần J, không lưu đường dẫn file cục bộ).
   */
  {
    id: 'ussh-scoring-principles-2026',
    publisher: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    title:
      'Infographic "Nguyên tắc tính điểm xét tuyển" năm 2026 (mã trường QSX) — công thức ĐT1/ĐT2/ĐT3, hệ số α1/α2, công thức giảm điểm ưu tiên khi tổng điểm ≥75. Ảnh chính thức do người dùng cung cấp.',
    url: 'https://www.hcmussh.edu.vn/',
    accessedAt: '2026-08-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'ussh-cutoff-2026',
    publisher: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    title:
      'Infographic "ĐIỂM CHUẨN XÉT TUYỂN ĐẠI HỌC CHÍNH QUY NĂM 2026" (mã trường QSX) — Chương trình Chuẩn (2 ảnh, 42 dòng), Liên kết 2+2 (4 dòng), Chuẩn quốc tế (8 dòng), mỗi dòng gồm ĐT01/ĐT02/ĐT03 thang 100. Ảnh chính thức do người dùng cung cấp.',
    url: 'https://www.hcmussh.edu.vn/',
    accessedAt: '2026-08-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
