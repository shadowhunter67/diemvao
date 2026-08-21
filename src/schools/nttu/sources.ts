import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface NttuSource {
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
 * Nguồn đã xác minh cho NTTU (Trường Đại học Nguyễn Tất Thành, mã trường NTT) 2026 — research
 * 2026-08-21, browser thật (chrome-devtools, đọc trực tiếp `tuyensinh.ntt.edu.vn`, KHÔNG qua
 * mirror/tổng hợp bên thứ ba). Domain chính thức: `ntt.edu.vn`, chuyên trang tuyển sinh
 * `tuyensinh.ntt.edu.vn`.
 */
export const nttuSources: NttuSource[] = [
  {
    id: 'nttu-quality-threshold-2026',
    publisher: 'Trường Đại học Nguyễn Tất Thành (NTTU) — Hội đồng Tuyển sinh',
    title:
      'NTTU công bố điểm sàn xét tuyển đại học chính quy 2026 — bảng tra cứu điểm sàn nhanh (Học bạ | ĐGNL ĐHQG TP.HCM | ĐGNL ĐHQG Hà Nội) theo nhóm ngành: khối Sức khỏe (Y khoa/Răng-Hàm-Mặt/Y học cổ truyền-Dược học/Điều dưỡng-YHDP-KTXNYH-KTPHCN), khối Luật, và các ngành còn lại',
    url: 'https://tuyensinh.ntt.edu.vn/nttu-cong-bo-diem-san-xet-tuyen-dai-hoc-chinh-quy-2026-p921.html',
    accessedAt: '2026-08-21',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Đọc trực tiếp qua chrome-devtools (`document.body.innerText`) 2026-08-21. Trang KHÔNG có meta/time tag publish date đọc được qua DOM (đã kiểm tra `<meta>`/`<time>`, không có) — không đặt `publishedAt` để tránh suy đoán; đăng ký nguyện vọng bài viết ghi "từ ngày 02/07 đến 14/07" nên bài viết chắc chắn thuộc khoảng cuối 6/đầu 7/2026 nhưng không có ngày chính xác đọc được trực tiếp từ trang. Bảng điểm sàn (Học bạ|ĐGNL HCM|ĐGNL HN): Y khoa 23|650|85; Răng-Hàm-Mặt 23|600|75; Y học cổ truyền & Dược học 21|570|70 (3 nhóm trên cùng điều kiện đi kèm: học lực lớp 12 Tốt + tổng 3 môn TN THPT ≥20 HOẶC điểm xét tốt nghiệp ≥8.5); Điều dưỡng/Y học dự phòng/Kỹ thuật xét nghiệm y học/Kỹ thuật phục hồi chức năng 19|550|70 (điều kiện đi kèm: học lực lớp 12 Khá + tổng 3 môn ≥16.5 HOẶC điểm xét tốt nghiệp ≥6.5); Luật/Luật Kinh tế/Luật Kinh tế (Chuẩn quốc tế): học bạ từ 18 điểm, KHÔNG áp dụng điểm sàn ĐGNL (điều kiện đi kèm: học lực Tốt + tổng 3 môn ≥18 HOẶC điểm xét tốt nghiệp ≥8.5); Tất cả các ngành còn lại: 18|550|70. Chỉ dùng cột Học bạ trong batch này (xem `nttu-dgnl-methods-not-modeled` — cột ĐGNL HCM/HN có số liệu nhưng ngoài scope batch).',
  },
];
