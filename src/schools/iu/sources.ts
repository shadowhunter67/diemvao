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
  {
    id: 'iu-admission-info-2026',
    publisher: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
    title:
      'THÔNG TIN TUYỂN SINH ĐẠI HỌC NĂM 2026 (ban hành kèm Quyết định số 428/QĐ-ĐHQT ngày 20/4/2026) — nguồn đầy đủ nhất: công thức tổng quát Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên, bảng công thức Điểm học lực cho 3 nhóm đối tượng (Mục 2.b), bảng quy đổi chứng chỉ ngoại ngữ sang điểm Tiếng Anh THPT, Điểm cộng (Khoản 5.a: điểm thưởng/điểm xét thưởng/điểm khuyến khích, cap 10), Chính sách ưu tiên + công thức giảm điểm ưu tiên (Khoản 7), đọc qua trình duyệt thật (accordion JS, 10 mục)',
    url: 'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-tin-tuyen-sinh-dai-hoc-nam-2026/',
    accessedAt: '2026-08-14',
    publishedAt: '2026-02-15',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'iu-hs-coefficients-update-2026',
    publisher: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
    title:
      'Thông báo về việc cập nhật một số nội dung của Phương thức xét tuyển tổng hợp (Phương thức 2) — cụ thể hóa 5 hệ số quy đổi Hs1-Hs5 dùng khi thiếu thành phần điểm học lực (03/08/2026), xác nhận lại k1=40%/k2=50%/k3=10%',
    url: 'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-bao-ve-viec-cap-nhat-mot-so-noi-dung-cua-phuong-thuc-xet-tuyen-tong-hop-phuong-thuc-2/',
    accessedAt: '2026-08-14',
    publishedAt: '2026-08-03',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'iu-cutoffs-method2-2026',
    publisher: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
    title:
      'THÔNG BÁO Mức điểm trúng tuyển vào các ngành theo phương thức Xét tuyển tổng hợp năm 2026 (Phương thức 2) — 24 ngành do ĐHQT cấp bằng + 14 chương trình liên kết quốc tế, thang điểm 100, đã bao gồm điểm cộng + điểm ưu tiên',
    url: 'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-bao-muc-diem-trung-tuyen-vao-cac-nganh-theo-phuong-thuc-xet-tuyen-tong-hop-nam-2026-phuong-thuc-2/',
    accessedAt: '2026-08-14',
    publishedAt: '2026-08-10',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
