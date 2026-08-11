import type { NotPublishedCheck } from '../core/admissionHistory';

/**
 * Xác nhận CHỦ ĐỘNG (đã kiểm tra nguồn chính thức, không phải suy đoán từ im lặng) rằng một
 * trường chưa công bố cutoff năm đó — xem `core/admissionHistory.ts` (NotPublishedCheck,
 * getCutoffAvailability) để hiểu vì sao đây là type riêng, không trộn vào cutoff array từng
 * trường. Sống ở `src/data/` (không phải `schools/<id>/`) vì có thể ghi nhận cho trường CHƯA có
 * module implement (như USSH — chỉ có research, chưa có `schools/ussh/`).
 */
export const notPublishedCutoffChecks: NotPublishedCheck[] = [
  {
    schoolId: 'ussh',
    year: 2026,
    checkedAt: '2026-08-11',
    sourceUrl: 'https://hcmussh.edu.vn/bai-viet/cong-bo-thong-tin-tuyen-sinh-nam-2026-cua-truong-dh-khxh-nv-dhqg-hcm',
    notes:
      'Trang thông tin tuyển sinh 2026 chính thức không có bảng điểm chuẩn — theo kế hoạch chung Bộ GD&ĐT/tìm kiếm tổng hợp, trường dự kiến công bố trước 17h 2026-08-13. Cần đối chiếu lại sau ngày đó (xem docs/admission-research-2026.md).',
  },
];
