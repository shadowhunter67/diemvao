import type { AdmissionCutoff } from '../types/programs';

/**
 * Điểm chuẩn "Xét tuyển Tổng hợp" HCMUT, thang 100. Mỗi batch dưới đây gắn với MỘT bài báo cụ
 * thể đã đối chiếu số liệu chéo (2+ nguồn độc lập cho các mốc cao nhất/thấp nhất) khớp với
 * công bố chính thức của Trường ĐH Bách khoa - ĐHQG TP.HCM. Không thể fetch trực tiếp trang
 * hcmut.edu.vn vì bảng điểm được nhúng dưới dạng ảnh (không đọc được bằng công cụ fetch text) —
 * xem README.md mục "Dữ liệu ngành/điểm chuẩn" để biết chi tiết cách đối chiếu.
 */

const SOURCE_2026_TIENPHONG = {
  sourceLabel:
    'Báo Tiền Phong, dẫn công bố điểm chuẩn chính thức của Trường Đại học Bách khoa - ĐHQG TP.HCM ngày 9/8/2026',
  sourceUrl: 'https://tienphong.vn/diem-chuan-dh-bach-khoa-tphcm-nhieu-nganh-cao-ngat-nguong-post1866428.tpo',
  accessedAt: '2026-08-09',
};

const SOURCE_2025_VNEXPRESS = {
  sourceLabel:
    'VnExpress, dẫn công bố điểm chuẩn chính thức của Trường Đại học Bách khoa - ĐHQG TP.HCM năm 2025',
  sourceUrl: 'https://vnexpress.net/diem-chuan-dai-hoc-bach-khoa-tp-hcm-hcmut-nam-2025-chi-tiet-nhat-4929202.html',
  accessedAt: '2026-08-09',
};

const SOURCE_2025_TUYENSINH247 = {
  sourceLabel:
    'Tuyensinh247, dẫn công bố điểm chuẩn chính thức của Trường Đại học Bách khoa - ĐHQG TP.HCM năm 2025',
  sourceUrl: 'https://diemthi.tuyensinh247.com/diem-chuan/dai-hoc-bach-khoa-hcm-QSB.html',
  accessedAt: '2026-08-09',
};

export const hcmutCutoffs: AdmissionCutoff[] = [
  // ===== 2026 — Chương trình tiêu chuẩn =====
  { year: 2026, programId: 'khoa-hoc-may-tinh', score: 85.45, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-may-tinh', score: 84.98, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'khoa-hoc-du-lieu', score: 84.97, method: 'combined', ...SOURCE_2026_TIENPHONG },
  {
    year: 2026,
    programId: 'nhom-dien-tu-vien-thong-tdh-tkvm',
    score: 84.29,
    method: 'combined',
    ...SOURCE_2026_TIENPHONG,
  },
  { year: 2026, programId: 'ky-thuat-ban-dan', score: 85.8, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-co-dien-tu', score: 84.36, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'vat-ly-ky-thuat', score: 82.01, method: 'combined', ...SOURCE_2026_TIENPHONG },
  {
    year: 2026,
    programId: 'logistics-he-thong-cong-nghiep',
    score: 82.4,
    method: 'combined',
    ...SOURCE_2026_TIENPHONG,
  },
  { year: 2026, programId: 'ky-thuat-hat-nhan', score: 80.61, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'quan-ly-cong-nghiep', score: 80.17, method: 'combined', ...SOURCE_2026_TIENPHONG },
  {
    year: 2026,
    programId: 'song-nganh-tau-thuy-hang-khong',
    score: 80.37,
    method: 'combined',
    ...SOURCE_2026_TIENPHONG,
  },
  { year: 2026, programId: 'kinh-te-tuan-hoan', score: 61.43, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'dia-ky-thuat-xay-dung', score: 64.37, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-dia-chat', score: 65.6, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'kinh-te-xay-dung', score: 69.35, method: 'combined', ...SOURCE_2026_TIENPHONG },
  {
    year: 2026,
    programId: 'xay-dung-quan-ly-du-an-xd-2026',
    score: 68.69,
    method: 'combined',
    ...SOURCE_2026_TIENPHONG,
  },

  // ===== 2026 — Chương trình tiếng Anh =====
  { year: 2026, programId: 'thiet-ke-vi-mach-ta', score: 85.51, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'khoa-hoc-may-tinh-ta', score: 84.23, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-co-dien-tu-ta', score: 82.14, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-may-tinh-ta', score: 81.54, method: 'combined', ...SOURCE_2026_TIENPHONG },
  { year: 2026, programId: 'ky-thuat-dau-khi-ta', score: 55.76, method: 'combined', ...SOURCE_2026_TIENPHONG },

  // ===== 2026 — Chương trình tiên tiến / chuyển tiếp quốc tế =====
  {
    year: 2026,
    programId: 'ky-thuat-dien-dien-tu-tien-tien',
    score: 83.27,
    method: 'combined',
    note: 'Chương trình Tiên tiến, tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },
  {
    year: 2026,
    programId: 'tri-tue-nhan-tao-sydney',
    score: 73.21,
    method: 'combined',
    note: 'Chương trình liên kết quốc tế (Đại học Sydney), tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },
  {
    year: 2026,
    programId: 'cong-nghe-thong-tin-sydney',
    score: 70.18,
    method: 'combined',
    note: 'Chương trình liên kết quốc tế (Đại học Sydney), tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },
  {
    year: 2026,
    programId: 'ky-thuat-co-khi-chuyen-tiep-my-uc',
    score: 82.42,
    method: 'combined',
    note: 'Chương trình chuyển tiếp quốc tế (Mỹ/Úc), tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },
  {
    year: 2026,
    programId: 'ky-thuat-hang-khong-chuyen-tiep-uc',
    score: 78.91,
    method: 'combined',
    note: 'Chương trình chuyển tiếp quốc tế (Úc), tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },
  {
    year: 2026,
    programId: 'khoa-hoc-may-tinh-chuyen-tiep-uc-nz',
    score: 70.84,
    method: 'combined',
    note: 'Chương trình chuyển tiếp quốc tế (Úc/New Zealand), tiêu chí xét tuyển có thể khác chuẩn 3 thành phần của phương thức Tổng hợp thường.',
    ...SOURCE_2026_TIENPHONG,
  },

  // ===== 2025 =====
  { year: 2025, programId: 'khoa-hoc-may-tinh', score: 85.41, method: 'combined', ...SOURCE_2025_VNEXPRESS },
  {
    year: 2025,
    programId: 'xay-dung-quan-ly-xd-2025',
    score: 55.05,
    method: 'combined',
    ...SOURCE_2025_VNEXPRESS,
  },
  { year: 2025, programId: 'ky-thuat-may-tinh', score: 82.91, method: 'combined', ...SOURCE_2025_TUYENSINH247 },
  {
    year: 2025,
    programId: 'nhom-dien-tu-vien-thong-tdh-tkvm',
    score: 80.77,
    method: 'combined',
    ...SOURCE_2025_TUYENSINH247,
  },
  { year: 2025, programId: 'ky-thuat-co-khi', score: 75.43, method: 'combined', ...SOURCE_2025_TUYENSINH247 },
  { year: 2025, programId: 'khoa-hoc-du-lieu', score: 83.85, method: 'combined', ...SOURCE_2025_TUYENSINH247 },
];
