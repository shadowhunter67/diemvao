import type { UelCutoff } from '../types/programs';

/**
 * Điểm chuẩn trúng tuyển UEL 2026, phương thức Xét tuyển Tổng hợp, thang 100, đã bao gồm điểm
 * cộng và điểm ưu tiên (đúng chú thích gốc trên bảng công bố). Nguồn: ảnh công bố chính thức
 * trên tuyensinh.uel.edu.vn ("Công bố điểm chuẩn đại học chính quy 2026") — đọc trực quan qua
 * ảnh full-resolution, đối chiếu số lượng (38/38 ngành) và khoảng điểm (65,01–90,01) khớp với
 * số liệu báo chí (VietnamNet, VnExpress) đã đăng cùng ngày công bố 9/8/2026.
 */
const SOURCE_2026 = {
  scoreScale: 100,
  sourceLabel: 'Công bố điểm chuẩn đại học chính quy 2026 — Trường Đại học Kinh tế - Luật, ĐHQG-HCM',
  sourceUrl: 'https://tuyensinh.uel.edu.vn/truong-dai-hoc-kinh-te-luat-cong-bo-ket-qua-tuyen-sinh-dai-hoc-chinh-quy-nam-2026/',
  publishedAt: '2026-08-09',
  accessedAt: '2026-08-11',
};

const IMAGE_SOURCE_NOTE = 'Đọc trực quan từ ảnh công bố chính thức, không phải text thuần.';

export const uelCutoffs: UelCutoff[] = [
  { year: 2026, programId: 'kinh-te', score: 74.78, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kinh-te-quan-ly-cong', score: 74.49, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kinh-te-so', score: 80.84, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kinh-te-quoc-te', score: 84.76, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'toan-kinh-te', score: 79.65, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'toan-kinh-te-ta', score: 67.22, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'toan-kinh-te-phan-tich-du-lieu', score: 82.61, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },

  { year: 2026, programId: 'quan-tri-kinh-doanh', score: 80.5, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'quan-tri-kinh-doanh-ta', score: 70.28, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'quan-tri-du-lich-lu-hanh', score: 69.55, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'marketing', score: 84.63, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'marketing-ta', score: 70.09, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'digital-marketing', score: 82.48, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kinh-doanh-quoc-te', score: 87.94, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kinh-doanh-quoc-te-ta', score: 82.66, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'logistics-quoc-te', score: 90.01, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'thuong-mai-dien-tu', score: 86.73, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'thuong-mai-dien-tu-ta', score: 78.36, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'tai-chinh-ngan-hang', score: 81.4, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'tai-chinh-ngan-hang-ta', score: 72.68, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'cong-nghe-tai-chinh', score: 82.54, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'cong-nghe-tai-chinh-coop', score: 73.15, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'ke-toan', score: 80.49, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'ke-toan-icaew-ta', score: 70.42, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'ke-toan-phan-tich-du-lieu', score: 79.91, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'kiem-toan', score: 85.29, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'quan-ly-cong', score: 71.81, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'he-thong-thong-tin-quan-ly', score: 86.46, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'he-thong-thong-tin-quan-ly-coop', score: 86.22, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'he-thong-thong-tin-quan-ly-ai', score: 84.44, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },

  { year: 2026, programId: 'luat-dan-su', score: 76.01, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-dan-su-ta', score: 69.42, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-tai-chinh-ngan-hang', score: 65.01, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-chinh-sach-cong', score: 65.54, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-cong-nghe', score: 71.65, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-kinh-doanh', score: 80.65, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-thuong-mai-quoc-te', score: 83.24, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'luat-thuong-mai-quoc-te-ta', score: 76.72, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
];
