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
  /**
   * 2 nguồn dưới đây: infographic chính thức HCMUS (thương hiệu/logo "ĐHQG-HCM · KHTN", mã
   * trường QST hiển thị trên ảnh) do NGƯỜI DÙNG cung cấp trực tiếp trong hội thoại 2026-08-13 —
   * không phải kết quả fetch trang web của UniscoreVN. Repo KHÔNG lưu đường dẫn file cục bộ
   * (Phần J) — `url` trỏ về domain tuyển sinh chính thức đã verified ở các source khác cùng file
   * này (root, không phải subpage cụ thể — UniscoreVN chưa tự fetch lại đúng URL đang host 2 ảnh
   * này). Mọi số liệu (39 ngưỡng ngành CHƯA có — xem knowledgeGaps; 101 dòng bảng quy đổi phân vị
   * ĐÃ có) đọc trực tiếp bằng vision từ ảnh, đối chiếu 2 lượt trước khi ghi vào
   * `vactConversionTable.ts`/`academicScore.ts`.
   */
  {
    id: 'hcmus-academic-score-formula-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    title:
      'Infographic "CÁCH TÍNH ĐIỂM XÉT TUYỂN" năm 2026 (mã trường QST) — Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên; Điểm học lực = MAX(0.8×THPT+0.2×Học bạ, 0.8×ĐGNL quy đổi+0.2×Học bạ). Ảnh chính thức do người dùng cung cấp.',
    url: 'https://tuyensinh.hcmus.edu.vn/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-vact-conversion-table-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    title:
      'Infographic "KHUNG QUY ĐỔI TƯƠNG ĐƯƠNG ĐIỂM THI ĐGNL CỦA ĐHQG-HCM VỚI ĐIỂM THI TỐT NGHIỆP THPT NĂM 2026 THEO QUY ĐỊNH CỦA TRƯỜNG" (mã trường QST) — 101 dòng phân vị <1%→100%, mốc <1%: 1139→30, mốc 100%: 370→10.85. Ảnh chính thức do người dùng cung cấp.',
    url: 'https://tuyensinh.hcmus.edu.vn/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
