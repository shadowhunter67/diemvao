import type { UitCutoff } from '../types/programs';

/**
 * Điểm chuẩn trúng tuyển UIT 2026, phương thức Xét tuyển Tổng hợp, thang 100, đã bao gồm điểm
 * cộng và điểm ưu tiên (đúng chú thích gốc trên bảng công bố). Nguồn: ảnh công bố chính thức
 * trên tuyensinh.uit.edu.vn — không phải text, đọc trực quan qua screenshot (đã đối chiếu lại
 * 2 lần độc lập để tránh đọc nhầm số/mã ngành).
 */
const SOURCE_2026 = {
  scoreScale: 100,
  sourceLabel:
    '[2026] Thông báo điểm trúng tuyển theo phương thức xét tuyển tổng hợp — Trường Đại học Công nghệ Thông tin, ĐHQG-HCM',
  sourceUrl:
    'https://tuyensinh.uit.edu.vn/2026-thong-bao-diem-trung-tuyen-theo-phuong-thuc-xet-tuyen-tong-hop',
  publishedAt: '2026-08-09',
  accessedAt: '2026-08-10',
};

const IMAGE_SOURCE_NOTE = 'Đọc trực quan từ ảnh công bố chính thức, không phải text thuần.';

export const uitCutoffs: UitCutoff[] = [
  { year: 2026, programId: 'truyen-thong-da-phuong-tien', score: 82.2, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'thuong-mai-dien-tu', score: 79.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'khoa-hoc-du-lieu', score: 91.7, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'khoa-hoc-du-lieu-ta', score: 85.5, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'khoa-hoc-may-tinh', score: 88.5, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'khoa-hoc-may-tinh-ta', score: 85.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  {
    year: 2026,
    programId: 'mang-may-tinh-va-truyen-thong-du-lieu',
    score: 78.3,
    note: IMAGE_SOURCE_NOTE,
    ...SOURCE_2026,
  },
  { year: 2026, programId: 'ky-thuat-phan-mem', score: 81.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'ky-thuat-phan-mem-ta', score: 76.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'he-thong-thong-tin', score: 80.8, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'he-thong-thong-tin-tt', score: 78.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'ky-thuat-may-tinh', score: 84.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'tri-tue-nhan-tao', score: 100.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'cong-nghe-thong-tin', score: 84.2, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'cong-nghe-thong-tin-viet-nhat', score: 80.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'an-toan-thong-tin', score: 88.7, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'an-toan-thong-tin-ta', score: 77.5, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'thiet-ke-vi-mach', score: 90.5, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
  { year: 2026, programId: 'thiet-ke-vi-mach-ta', score: 80.0, note: IMAGE_SOURCE_NOTE, ...SOURCE_2026 },
];
