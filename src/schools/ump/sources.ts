import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface UmpSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  note?: string;
}

/**
 * Nguồn đã xác minh cho Đại học Y Dược Thành phố Hồ Chí Minh (UMP — University of Medicine and
 * Pharmacy at HCMC, trường thứ 19) — research 2026-08-19/20. Domain chính thức: `ump.edu.vn`
 * (KHÔNG nhầm với `ump.vnu.edu.vn` — đó là Trường Đại học Y Dược, ĐHQG Hà Nội, một trường HOÀN
 * TOÀN KHÁC dù tên viết tắt trùng). Cả 3 văn bản dưới đây đọc trực tiếp từ `ump.edu.vn`/
 * `admin.ump.edu.vn` (subdomain gốc, cùng tổ chức) qua curl (PDF) và chrome-devtools (ảnh PNG nhúng
 * trong bài đăng CKEditor) — không qua mirror/nguồn thứ cấp.
 */
export const umpSources: UmpSource[] = [
  {
    id: 'ump-admission-notice-2415-2026',
    publisher: 'Đại học Y Dược Thành phố Hồ Chí Minh (UMP)',
    title:
      'Thông báo số 2415/TB-ĐHYD (01/6/2026) — Về việc xét tuyển đại học hệ chính quy năm 2026: 01 phương thức (Xét kết quả thi tốt nghiệp THPT 2026), 5 tổ hợp (A00/B00/B08/D01/D07), công thức Điểm xét tuyển = Tổng điểm 3 môn + Điểm ưu tiên + Điểm khuyến khích, công thức điểm ưu tiên (chuẩn quốc gia) và điểm khuyến khích (chứng chỉ ngoại ngữ/SAT), danh mục 18 ngành/chương trình + chỉ tiêu, chính sách xét tuyển thẳng/dự bị đại học.',
    url: 'https://ump.edu.vn/tuyen-sinh-dao-tao/dai-hoc/thong-bao/10534/thong-bao-xet-tuyen-dai-hoc-he-chinh-quy-nam-2026',
    accessedAt: '2026-08-19',
    publishedAt: '2026-06-01',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Nội dung công thức/danh mục ngành đọc trực tiếp từ file PDF đính kèm chính thức tại ' +
      'https://ump.edu.vn/uploads/ckeditor/files/Truong/DaoTaoDaiHoc/TuyenSinh/2026/2415_ThongBao_XetTuyenDHCQ2026.pdf ' +
      '(10 trang, có số hiệu văn bản/chữ ký Hiệu trưởng Ngô Quốc Đạt) — tải qua curl trực tiếp, đọc text layer PDF gốc (không OCR/mirror), verified 2026-08-19. ' +
      'Mục 6.2.2 (trang 5-6): công thức đầy đủ ĐXT=Tổng 3 môn+Ưu tiên+Khuyến khích, công thức giảm ưu tiên (ngưỡng 22,5/30, chia 7,5), bảng mức ưu tiên KV1/KV2-NT/KV2/UT1/UT2, công thức khuyến khích 0,9×(điểm/thang tối đa) cho IELTS/TOEFL iBT/SAT (ngưỡng IELTS≥6.0/TOEFL≥80/SAT≥1340, cap 1,5). Mục 4 (trang 2-3): bảng đầy đủ 18 ngành × mã ngành × tổ hợp × chỉ tiêu.',
  },
  {
    id: 'ump-threshold-notice-2983-2026',
    publisher: 'Đại học Y Dược Thành phố Hồ Chí Minh (UMP) — Hội đồng tuyển sinh',
    title:
      'Thông báo số 2983/TB-ĐHYD (08/7/2026) — Về việc xác định ngưỡng đảm bảo chất lượng đầu vào và điểm trúng tuyển quy đổi tương đương năm 2026: bảng ngưỡng ĐBCL đầu vào 17,0-23,0 điểm (thang 30) theo 18 ngành, và quy tắc quy đổi tương đương điểm trúng tuyển giữa 5 tổ hợp (B00 là tổ hợp gốc; A00 = B00; B08/D01/D07 = B00 − 1,5).',
    url: 'https://ump.edu.vn/tuyen-sinh-dao-tao/dai-hoc/thong-bao/10705/thong-bao-ve-viec-xac-dinh-nguong-dam-bao-chat-luong-dau-vao-va-diem-trung-tuyen-quy-doi-tuong-duong-nam-2026',
    accessedAt: '2026-08-20',
    publishedAt: '2026-07-08',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Nội dung là 2 ảnh PNG nhúng trực tiếp trong bài đăng CKEditor (không phải PDF đính kèm) tại ' +
      'https://ump.edu.vn/uploads/ckeditor/images/Truong/DaoTaoDaiHoc/TuyenSinh/2026/2983_TB_NguongDambaochatluong_Dolechdiem_1.png và _2.png — ' +
      'tải qua curl trực tiếp, đọc trực tiếp ảnh gốc (không OCR bên thứ 3), verified 2026-08-20. Căn cứ Quyết định 1962/QĐ-BGDĐT (07/7/2026, ngưỡng Bộ GD-ĐT cho khối ngành sức khỏe) và Biên bản 2926/BB-ĐHYD (07/7/2026) — UMP tự xác định ngưỡng RIÊNG (bằng hoặc cao hơn sàn Bộ), có bảng số cụ thể theo từng ngành, KHÔNG phải "dùng thẳng sàn Bộ" như một số trường khác.',
  },
  {
    id: 'ump-cutoff-notice-3557-2026',
    publisher: 'Đại học Y Dược Thành phố Hồ Chí Minh (UMP) — Hội đồng tuyển sinh',
    title:
      'Thông báo số 3557/TB-ĐHYD (10/8/2026) — Điểm trúng tuyển đại học hệ chính quy năm 2026: điểm trúng tuyển thật theo từng ngành × tổ hợp (sau lọc ảo lần 6 của Bộ GD&ĐT ngày 09/8/2026), 2.942 thí sinh trúng tuyển/2.738 chỉ tiêu còn lại.',
    url: 'https://ump.edu.vn/tuyen-sinh-dao-tao/dai-hoc/thong-bao/10836/thong-bao-diem-trung-tuyen-dai-hoc-he-chinh-quy-nam-2026',
    accessedAt: '2026-08-20',
    publishedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Nội dung là 3 ảnh PNG nhúng trực tiếp trong bài đăng CKEditor (không phải PDF đính kèm) tại ' +
      'https://ump.edu.vn/uploads/ckeditor/images/Truong/DaoTaoDaiHoc/TuyenSinh/2026/3557_TB_DiemtrungtuyenDHCQ2026_1.png, _2.png, _3.png — ' +
      'tải qua curl trực tiếp, đọc trực tiếp ảnh gốc, verified 2026-08-20. Đây là ĐIỂM TRÚNG TUYỂN THẬT (cutoff, kết quả tuyển sinh 2026 đã lọc ảo xong) — KHÁC ngưỡng đảm bảo chất lượng đầu vào (`ump-threshold-notice-2983-2026`, threshold, điều kiện nộp hồ sơ). Ghi chú (3) trong bảng: "Tổ hợp B00 là tổ hợp gốc. Điểm trúng tuyển của các tổ hợp A00, B08, D01 và D07 được xác định là điểm thấp nhất của thí sinh đăng ký xét tuyển" — khớp quy tắc quy đổi đã công bố ở `ump-threshold-notice-2983-2026` (A00=B00; B08/D01/D07 thấp hơn B00, thực tế quan sát được chênh lệch quanh 1,5 điểm, không luôn đúng chính xác 1,5 vì phụ thuộc phân bố thí sinh thật đăng ký theo tổ hợp).',
  },
];
