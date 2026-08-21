import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HiuSource {
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
 * Nguồn đã xác minh cho Đại học Quốc tế Hồng Bàng (HIU) 2026 — đọc trực tiếp qua browser thật.
 * Domain chính thức: `hiu.vn`, `tuyensinh.hiu.vn`/`xettuyen.hiu.vn` (cổng đăng ký).
 */
export const hiuSources: HiuSource[] = [
  {
    id: 'hiu-quality-threshold-2026',
    publisher: 'Trung tâm Tuyển sinh và Truyền thông — Trường Đại học Quốc tế Hồng Bàng (HIU)',
    title: 'Trường Đại học Quốc tế Hồng Bàng công bố điểm sàn xét tuyển 2026',
    url: 'https://hiu.vn/tin-tuc/truong-dai-hoc-quoc-te-hong-bang-cong-bo-diem-san-xet-tuyen-2026/',
    accessedAt: '2026-08-21',
    publishedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Bài đăng chính thức của trường (biên tập bởi Trung tâm Tuyển sinh và Truyền thông HIU, phát ngôn viên: ông Ngô Trí Dũng — Giám đốc Trung tâm), đọc trực tiếp qua browser thật, "Cập nhật lần cuối vào 10/08/2026", cho 43 ngành/chương trình đào tạo. Nội dung: (1) thi TN THPT — 15/30 phần lớn ngành (điểm thô, không cần quy đổi); nhóm pháp luật (Luật, Luật Kinh tế) và nhóm sức khỏe có cấp phép hành nghề (Y khoa, Y học cổ truyền, Răng Hàm Mặt, Dược học, Kỹ thuật xét nghiệm y học, Kỹ thuật hình ảnh y học, Kỹ thuật phục hồi chức năng, Kỹ thuật Y sinh, Điều dưỡng, Hộ sinh) áp dụng "ngưỡng đảm bảo chất lượng đầu vào do Bộ Giáo dục và Đào tạo quy định" — bài viết KHÔNG nêu con số cụ thể; nhóm Kỹ thuật Y sinh/Công nghệ thẩm mỹ/Dinh dưỡng/Y tế công cộng vẫn 15/30. (2) Kết hợp thi TN THPT + học bạ lớp 12 — 16/30 phần lớn ngành, KHÔNG có công thức trọng số cụ thể (chỉ nêu ngưỡng). (3) ĐGNL ĐHQG-HCM (thang 1200, điểm thô — khớp `ApplicantProfile.exams.vact.total`): 650 phần lớn ngành; 700 (Y khoa, Răng Hàm Mặt, Luật, Luật Kinh tế); 675 (Y học cổ truyền, Dược học).',
  },
];
