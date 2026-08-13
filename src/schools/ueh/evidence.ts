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
      location: 'Bảng 12 khoảng quy đổi ĐGNL-HCM sang điểm THPT tương đương',
      verification: 'verified',
      effectiveYear: 2026,
      verifiedAt: '2026-08-11',
    },
  ],
} satisfies SourcedRule<typeof UEH_DGNL_TO_THPT_TABLE>;
