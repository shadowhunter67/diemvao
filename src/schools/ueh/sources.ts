import type { SourceLifecycle } from '../../core/freshness';
import type { VerificationLevel } from '../../core/trust';

export interface UehSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  lastReviewedAt?: string;
}

export const uehSources: UehSource[] = [
  {
    id: 'ueh-formula-2026',
    publisher: 'Trường Đại học Kinh tế TP.HCM',
    title: 'Thông tin tuyển sinh Đại học chính quy Khóa 52 năm 2026 — công thức Xét tuyển tích hợp (60% điểm thi quy đổi + 40% học bạ quy đổi, thang 100)',
    url: 'https://tuyensinh.ueh.edu.vn/bai-viet/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-khoa-52-nam-2026/',
    accessedAt: '2026-08-11',
    verification: 'verified',
  },
  {
    id: 'ueh-conversion-table-2026',
    publisher: 'Trường Đại học Kinh tế TP.HCM',
    title: 'Hướng dẫn quy đổi điểm giữa các kỳ thi trong Phương thức xét tuyển tích hợp Khóa 52 — bảng 12 khoảng quy đổi ĐGNL-HCM sang điểm THPT, công thức học bạ (ĐTB10×1+ĐTB11×2+ĐTB12×3)/6',
    url: 'https://tuyensinh.ueh.edu.vn/bai-viet/huong-dan-quy-doi-diem-giua-cac-ky-thi-trong-phuong-thuc-xet-tuyen-tich-hop-khoa-52-dai-hoc-chinh-quy-ueh-2026/',
    accessedAt: '2026-08-11',
    verification: 'verified',
  },
  {
    id: 'ueh-threshold-2026',
    publisher: 'Trường Đại học Kinh tế TP.HCM',
    title: 'Ngưỡng đảm bảo chất lượng đầu vào Phương thức xét tuyển tích hợp 2026: KSA (TP.HCM) ≥65/100, KSV (UEH Mekong – Vĩnh Long) ≥60/100, chưa gồm ưu tiên/điểm cộng',
    url: 'https://tuyensinh.ueh.edu.vn/bai-viet/ueh-cong-bo-nguong-dam-bao-chat-luong-dau-vao-quy-doi-diem-giua-cac-ky-thi-va-ra-mat-cong-cu-ho-tro-tinh-diem-trong-phuong-thuc-xet-tuyen-tich-hop-khoa-52-dai-hoc-chinh-quy-nam-2026/',
    accessedAt: '2026-08-11',
    verification: 'verified',
  },
  {
    id: 'ueh-cutoffs-2026',
    publisher: 'Trường Đại học Kinh tế TP.HCM',
    title: 'UEH công bố kết quả xét tuyển Khóa 52 — Đại học chính quy năm 2026 (97 chương trình: 82 KSA + 15 KSV, thang 100)',
    url: 'https://tuyensinh.ueh.edu.vn/bai-viet/ueh-cong-bo-ket-qua-xet-tuyen-khoa-52-dai-hoc-chinh-quy-nam-2026-gia-tang-co-hoi-hoc-tap-quoc-te/',
    accessedAt: '2026-08-11',
    // Đọc qua công cụ fetch/tóm tắt tự động (bảng HTML dài 97 dòng), KHÔNG đối chiếu thủ công 2
    // lần độc lập như cách HCMUT/UIT/UEL đọc ảnh gốc — hạ 1 mức so với 'verified'.
    verification: 'cross-checked',
  },
];
