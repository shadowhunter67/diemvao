import type { SourcedRule } from '../../core/evidence';
import { UEH_DGNL_TO_THPT_TABLE } from './dgnlConversion';
import { UEH_BONUS_DOMESTIC } from './bonus';
import { UEH_PRIORITY_OBJECT_POINTS, UEH_PRIORITY_ZONE_POINTS } from './priority';

/** Provenance cho bảng quy đổi ĐGNL→THPT UEH — nguồn `ueh-conversion-table-2026` trong
 * `sources.ts`, đọc trực tiếp text (không phải ảnh). */
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

/** Re-audit 2026-08-13: nguồn `ueh-ksa-ksv-info-2026` công bố worked example đầy đủ chỉ rõ hệ số
 * quy đổi cuối cùng (×100/30 cho điểm thi, ×10 cho học bạ) trước khi nhân 60%/40% — đây chính là
 * "ueh-final-conversion-step" từng bị coi là gap, nay đã resolved (xem `docs/CHANGELOG.md`). */
export const uehFinalConversionEvidence = {
  value: { examCoefficient: 100 / 30, transcriptCoefficient: 10 },
  evidence: [
    {
      sourceId: 'ueh-conversion-table-2026',
      location: 'Ví dụ tính điểm hoàn chỉnh: [(25.55×100)/30]×0.6=51.10 + (8.6×10)×0.4=34.40 → 90.50 (kèm 5.0 điểm cộng)',
      verification: 'verified',
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ examCoefficient: number; transcriptCoefficient: number }>;

export const uehBonusEvidence = {
  value: UEH_BONUS_DOMESTIC,
  evidence: [
    {
      sourceId: 'ueh-ksa-ksv-info-2026',
      location: 'Bảng điểm xét thưởng/điểm khuyến khích Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam), Phương thức xét tuyển tích hợp',
      verification: 'verified',
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<typeof UEH_BONUS_DOMESTIC>;

export const uehPriorityEvidence = {
  value: { zone: UEH_PRIORITY_ZONE_POINTS, object: UEH_PRIORITY_OBJECT_POINTS },
  evidence: [
    {
      sourceId: 'ueh-ksa-ksv-info-2026',
      location: 'Bảng điểm ưu tiên khu vực/đối tượng thang 100 + công thức giảm dần khi tổng điểm ≥75',
      verification: 'verified',
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ zone: typeof UEH_PRIORITY_ZONE_POINTS; object: typeof UEH_PRIORITY_OBJECT_POINTS }>;
