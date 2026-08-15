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
  /**
   * Nguồn mới research 2026-08-15 — PDF "Thông tin tuyển sinh năm 2026" (Đề án tuyển sinh chính
   * thức, 36 trang, có text layer đọc trực tiếp qua chrome-devtools, KHÔNG phải ảnh scan) dẫn từ
   * thông báo chính thức trên hcmussh.edu.vn (mục "5. Địa chỉ công khai quy chế tuyển sinh, đề
   * án"). Nội dung khớp NGUYÊN VĂN với thông báo `ussh-scoring-clarification-2026` bên dưới — 2
   * nguồn độc lập cùng công bố công thức ĐHL1/ĐHL2/ĐHL3 KHÔNG chứa α1/α2 (α chỉ dùng để quy đổi
   * độ lệch tổ hợp khi trường XÁC ĐỊNH ĐIỂM CHUẨN/tương đương ngưỡng giữa đối tượng 2 và 3, không
   * dùng để tính ĐHL của một thí sinh cụ thể — xem trang 4 PDF, mục 3). Đây là nguồn thay thế cho
   * ảnh infographic `ussh-scoring-principles-2026` trước đây (infographic hiển thị "THPT + α2"
   * nhưng PDF chính thức đầy đủ hơn không có α trong công thức ĐHL).
   */
  {
    id: 'ussh-info-pdf-2026',
    publisher: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    title:
      'PDF "Thông tin tuyển sinh năm 2026" (Đề án tuyển sinh, QSX_Thong tin tuyen sinh 2026-theo QC-CAP NHAT_30_6_V1.pdf, 36 trang) — mục 2.2: công thức ĐXT=w1THPT+w2ĐGNL+w3HB (w1=w2=45%,w3=10%); mục 2.2.2: ĐHL1/ĐHL2(90/10 THPT+HB)/ĐHL3(90/10 ĐGNL+HB); mục 3b: quy tắc quy đổi thang 100 (×100/30, ×100/1200); mục 5b: bảng điểm cộng theo Nhóm 1(≤3)/Nhóm 2(≤4)/Nhóm 3(còn lại), tổng ≤10, chi tiết mức cộng "công bố cùng kết quả xét tuyển"; mục 5c: công thức giảm điểm ưu tiên khi tổng ≥75.',
    url: 'https://hcmussh.edu.vn/news/item/44214',
    accessedAt: '2026-08-15',
    publishedAt: '2026-05-30',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'ussh-scoring-clarification-2026',
    publisher: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    title:
      'Thông báo "Một số lưu ý quan trọng về việc xét tuyển đại học chính quy năm 2026 của Nhà trường" — nhắc lại nguyên văn công thức ĐXT/ĐHL1/ĐHL2/ĐHL3 (w1=w2=45%,w3=10% cho ĐT1; 90/10 cho ĐT2/ĐT3), quy tắc quy đổi thang 100, và giải thích rõ hệ số quy đổi α chỉ dùng để quy đổi độ lệch điểm giữa các tổ hợp khi trường xác định điểm trúng tuyển, KHÔNG xuất hiện trong công thức tính điểm của thí sinh.',
    url: 'https://hcmussh.edu.vn/news/item/44211',
    accessedAt: '2026-08-15',
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
