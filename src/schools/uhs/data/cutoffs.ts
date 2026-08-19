import type { ComparableCutoffRecord } from '../../../core/cutoffComparison';

/**
 * Điểm trúng tuyển UHS 2026, Phương thức 2 (Mã phương thức: 500 — "xét tuyển tổng hợp dựa trên
 * kết quả thi tốt nghiệp THPT năm tuyển sinh, kết quả thi ĐGNL do ĐHQG-HCM tổ chức năm tuyển
 * sinh và kết quả học tập cấp THPT"), thang 100, ĐÃ bao gồm điểm cộng và điểm ưu tiên theo quy
 * định (đúng chú thích gốc trên bảng công bố).
 *
 * Nguồn: bảng công bố chính thức của trường — người dùng cung cấp trực tiếp ảnh chụp bảng gốc
 * (Drive link trong `uhsSources['uhs-cutoffs-2026']` bị hạn chế quyền tải nên trước đó không đọc
 * được) — không phải suy đoán từ báo chí thứ cấp.
 *
 * Bảng gốc chỉ ghi "Y khoa" (không tách "Y khoa (đặt hàng)") — CHỈ gán cho `uhs-7720101` (Y khoa
 * chương trình chuẩn). KHÔNG gán cho `uhs-7720101DH` (đặt hàng, quota riêng 120) vì không có
 * bằng chứng 2 chương trình dùng chung 1 mốc điểm — xem `uhsKnowledgeGaps['uhs-cutoffs-2026']`.
 */
const SOURCE_2026 = {
  sourceLabel:
    'Điểm trúng tuyển năm 2026 theo phương thức xét tuyển tổng hợp (Mã phương thức: 500) — Trường Đại học Khoa học Sức khỏe, ĐHQG TP.HCM',
  sourceUrl: 'https://tuyensinh.uhsvnu.edu.vn/category.php?slug=diem-chuan',
  publishedAt: '2026-08-10',
  accessedAt: '2026-08-19',
};

export const uhsCutoffs: ComparableCutoffRecord[] = [
  { year: 2026, programId: 'uhs-7720101', methodId: '500', score: 82.6, scoreScale: 100, ...SOURCE_2026 },
  { year: 2026, programId: 'uhs-7720501', methodId: '500', score: 81.8, scoreScale: 100, ...SOURCE_2026 },
  { year: 2026, programId: 'uhs-7720201', methodId: '500', score: 73, scoreScale: 100, ...SOURCE_2026 },
  { year: 2026, programId: 'uhs-7720115', methodId: '500', score: 72.41, scoreScale: 100, ...SOURCE_2026 },
  { year: 2026, programId: 'uhs-7720301', methodId: '500', score: 67, scoreScale: 100, ...SOURCE_2026 },
];
