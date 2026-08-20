import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng — bảng CHUẨN QUỐC GIA (Quy chế tuyển sinh của Bộ GD-ĐT, dẫn chiếu
 * verbatim "Điểm ưu tiên (theo khu vực và/hoặc theo đối tượng chính sách): được xác định theo Quy
 * chế tuyển sinh của Bộ Giáo dục và Đào tạo" — HCMULAW không tự công bố bảng số riêng). Cross-checked
 * nội bộ với các trường khác trong repo dùng cùng công thức tỉ lệ 75%/25% + ngưỡng giảm 22,5/30
 * (UFM/HCMUT/...) — xem `evidence.ts:hcmulawPriorityEvidence`.
 */
export const HCMULAW_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const HCMULAW_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupHcmulawStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (HCMULAW_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (HCMULAW_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/** Thang 30: ĐUT = MĐUT nếu tổng điểm học lực < 22,5; nếu ≥ 22,5: ĐUT = [(30 - tổng)/7,5] × MĐUT
 * (công thức giảm điểm ưu tiên chuẩn quốc gia, cross-checked với 7+ trường khác trong repo dùng
 * thang 30). */
export function calculateHcmulawPriority30(input: { academicScore30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicScore30);
  if (cappedTotal < 22.5) return { effectivePriority30: input.standardPriority30, reduced: false };
  const effectivePriority30 = Math.max(0, round2(((30 - cappedTotal) / 7.5) * input.standardPriority30));
  return { effectivePriority30, reduced: true };
}
