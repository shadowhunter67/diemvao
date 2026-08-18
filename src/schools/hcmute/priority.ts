import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng HCMUTE 2026, thang 30 — Phụ lục 1/2 đính kèm văn bản
 * 1691/ĐHCNKT-ĐT (`sources.ts:hcmute-priority-appendix-2026`, `verification: 'verified'`, trực
 * tiếp từ văn bản chính thức đã ký, không phải cross-check). Nhóm đối tượng 01-03 = ƯT1 (2,00
 * điểm), 04-06 = ƯT2 (1,00 điểm) — khớp đúng cấu trúc bảng ưu tiên chuẩn quốc gia Bộ GDĐT.
 */
export const HCMUTE_PRIORITY_REDUCTION_THRESHOLD_30 = 22.5;
export const HCMUTE_PRIORITY_REDUCTION_DIVISOR_30 = 7.5;

export const HCMUTE_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const HCMUTE_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupHcmuteStandardPriority(region: string | undefined, category: string | undefined): number {
  return (region ? (HCMUTE_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (HCMUTE_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/**
 * Điểm ưu tiên (ĐUT). Nếu (ĐHL + ĐC) < 22,50: ĐUT = mức điểm ưu tiên đầy đủ (MĐUT), không giảm.
 * Nếu (ĐHL + ĐC) ≥ 22,50: ĐUT = [(30,00 – (ĐHL + ĐC))/7,50] × MĐUT, làm tròn 2 chữ số thập phân.
 * Tổng (ĐHL + ĐC) vượt quá 30,00 được kẹp về 30,00 trước khi áp dụng công thức (theo lưu ý văn
 * bản gốc).
 */
export function calculateHcmuteEffectivePriority(input: { academicPlusBonus30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicPlusBonus30);
  if (cappedTotal < HCMUTE_PRIORITY_REDUCTION_THRESHOLD_30) {
    return { effectivePriority30: input.standardPriority30, reduced: false };
  }
  const effectivePriority30 = Math.max(
    0,
    round2(((30 - cappedTotal) / HCMUTE_PRIORITY_REDUCTION_DIVISOR_30) * input.standardPriority30)
  );
  return { effectivePriority30, reduced: true };
}
