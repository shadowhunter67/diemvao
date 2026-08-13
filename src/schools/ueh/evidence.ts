import type { SourcedRule } from '../../core/evidence';
import { UEH_DGNL_TO_THPT_TABLE } from './dgnlConversion';

/** Provenance cho bảng quy đổi ĐGNL→THPT UEH — nguồn `ueh-conversion-table-2026` trong
 * `sources.ts`, đọc trực tiếp text (không phải ảnh), đây là bảng verified chi tiết nhất trong
 * toàn bộ các trường "researching" hiện có. */
export const uehDgnlConversionEvidence = {
  value: UEH_DGNL_TO_THPT_TABLE,
  evidence: [
    {
      sourceId: 'ueh-conversion-table-2026',
      sourceUrl:
        'https://tuyensinh.ueh.edu.vn/bai-viet/huong-dan-quy-doi-diem-giua-cac-ky-thi-trong-phuong-thuc-xet-tuyen-tich-hop-khoa-52-dai-hoc-chinh-quy-ueh-2026/',
      sourceTitle:
        'Hướng dẫn quy đổi điểm giữa các kỳ thi trong Phương thức xét tuyển tích hợp Khóa 52 UEH 2026 — bảng 12 khoảng quy đổi ĐGNL-HCM (thang 1200) sang điểm THPT tương đương (thang 30), nội suy tuyến tính trong từng khoảng.',
      verification: 'verified',
      effectiveYear: 2026,
      verifiedAt: '2026-08-11',
    },
  ],
} satisfies SourcedRule<typeof UEH_DGNL_TO_THPT_TABLE>;
