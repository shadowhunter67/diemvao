import type { VerificationLevel } from '../../core/trust';

export interface UelSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  verification: VerificationLevel;
  lastReviewedAt?: string;
}

/**
 * Nguồn đã xác minh cho UEL 2026 — research 2026-08-11 (xem docs/admission-research-2026.md).
 * Bảng điểm cộng chứng chỉ ngoại ngữ chi tiết ("Phụ lục 2") KHÔNG liệt kê ở đây vì chưa đọc được
 * dạng text/ảnh rõ (chỉ có mô tả gián tiếp qua báo chí) — xem UelExplorerPage.tsx phần blocked.
 */
export const uelSources: UelSource[] = [
  {
    id: 'uel-formula-2026',
    publisher: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
    title:
      'Thông tin tuyển sinh đại học chính quy 2026 — công thức Xét tuyển Tổng hợp (β1=55% ĐGNL, β2=35% THPT, β3=10% học bạ), ngưỡng đầu vào, điểm ưu tiên khu vực',
    url: 'https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/',
    accessedAt: '2026-08-11',
    verification: 'verified',
  },
  {
    id: 'uel-cutoffs-2026',
    publisher: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
    title: 'Công bố điểm chuẩn trúng tuyển đại học chính quy 2026, phương thức Xét tuyển Tổng hợp (38 ngành/chuyên ngành, thang 100)',
    url: 'https://tuyensinh.uel.edu.vn/truong-dai-hoc-kinh-te-luat-cong-bo-ket-qua-tuyen-sinh-dai-hoc-chinh-quy-nam-2026/',
    accessedAt: '2026-08-11',
    verification: 'verified',
  },
  {
    id: 'uel-priority-reduction-2026',
    publisher: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM',
    title:
      'Quy tắc giảm điểm ưu tiên khu vực/đối tượng khi tổng (điểm học lực + điểm cộng) ≥75/100: "(100 – Điểm học lực – Điểm cộng)/25 × Điểm ưu tiên quy đổi", làm tròn 0.01 — batch 6, unblock `priorityReduction.ts`',
    url: 'https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/',
    accessedAt: '2026-08-13',
    verification: 'verified',
  },
  {
    id: 'uel-bonus-language-cross-check',
    publisher: 'VnExpress (dẫn "Phụ lục 2" của UEL — chưa đọc được bảng gốc dạng text/ảnh rõ)',
    title: 'Điểm cộng chứng chỉ ngoại ngữ quốc tế UEL 2026 — biết khoảng 2–5/100 cho IELTS≥5.0 tương đương, chưa có bảng chi tiết theo mức',
    url: 'https://vnexpress.net/cong-thuc-tinh-diem-xet-tuyen-chi-tiet-cua-dai-hoc-kinh-te-luat-nam-2026-5041582-p3.html',
    accessedAt: '2026-08-11',
    verification: 'incomplete',
  },
];
