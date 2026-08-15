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
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title:
      'Thông báo về ngưỡng đảm bảo chất lượng Phương thức 2 năm 2026 - điều kiện THPT/ĐGNL, điều kiện riêng, và infographic 39 ngưỡng đăng ký xét tuyển theo ngành',
    url: 'https://tuyensinh.hcmus.edu.vn/2026-thong-bao-ve-nguong-dam-bao-chat-luong-phuong-thuc-2/',
    accessedAt: '2026-08-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-methods-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title: 'Phương thức tuyển sinh 2026 - mô tả Phương thức 1a/1b/2 (THPT hoặc ĐGNL kết hợp học bạ 3 năm)',
    url: 'https://tuyensinh.hcmus.edu.vn/phuong-thuc-tuyen-sinh/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-info-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title: 'Thông tin tuyển sinh 2026 - 39 ngành/nhóm ngành, chỉ tiêu, tổ hợp',
    url: 'https://tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'cross-checked',
  },
  {
    id: 'hcmus-academic-score-formula-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title:
      'Infographic "CÁCH TÍNH ĐIỂM XÉT TUYỂN" năm 2026 (mã trường QST) - Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên; Điểm học lực = MAX(0.8×THPT+0.2×Học bạ, 0.8×ĐGNL quy đổi+0.2×Học bạ). Ảnh chính thức do người dùng cung cấp.',
    url: 'https://tuyensinh.hcmus.edu.vn/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-vact-conversion-table-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title:
      'Infographic "KHUNG QUY ĐỔI TƯƠNG ĐƯƠNG ĐIỂM THI ĐGNL CỦA ĐHQG-HCM VỚI ĐIỂM THI TỐT NGHIỆP THPT NĂM 2026 THEO QUY ĐỊNH CỦA TRƯỜNG" (mã trường QST) - 101 dòng phân vị <1%→100%, mốc <1%: 1139→30, mốc 100%: 370→10.85. Ảnh chính thức do người dùng cung cấp.',
    url: 'https://tuyensinh.hcmus.edu.vn/',
    accessedAt: '2026-08-13',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmus-bonus-table-2026',
    publisher: 'Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    title:
      'Ảnh "BẢNG ĐIỂM CỘNG PHƯƠNG THỨC 2 TUYỂN SINH TRÌNH ĐỘ ĐẠI HỌC NĂM 2026" đính kèm mục "2. Điểm cộng" của trang Thông tin tuyển sinh 2026 - 15 dòng thang điểm cơ sở (0,15-1,5/30), quy tắc chỉ cộng 01 loại cao nhất, công thức giảm khi tổng điểm ≥28,5/30, mức trần điểm xét 30/30.',
    url: 'https://tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/',
    accessedAt: '2026-08-15',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
