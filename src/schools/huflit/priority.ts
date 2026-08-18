import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng — bảng CHUẨN QUỐC GIA (Quy chế tuyển sinh Bộ GDĐT), cross-checked
 * nội bộ với 5 trường khác trong repo dùng đúng công thức tỉ lệ 75%/25% này
 * (`evidence.ts`/`knowledgeGaps.ts:huflit-priority-table-not-huflit-specific`) — KHÔNG tìm được
 * trang HUFLIT tự công bố bảng số trực tiếp nên verification giữ `cross-checked`.
 */
export const HUFLIT_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const HUFLIT_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupHuflitStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (HUFLIT_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (HUFLIT_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/** PT1/PT2 (thang 30): ĐUT = MĐUT nếu tổng<22,5; nếu ≥22,5: ĐUT=[(30-tổng)/7,5]×MĐUT. */
export function calculateHuflitPriority30(input: { academicPlusBonus30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicPlusBonus30);
  if (cappedTotal < 22.5) return { effectivePriority30: input.standardPriority30, reduced: false };
  const effectivePriority30 = Math.max(0, round2(((30 - cappedTotal) / 7.5) * input.standardPriority30));
  return { effectivePriority30, reduced: true };
}

/** PT3/ĐGNL (thang 1200, cùng tỉ lệ 75%/25% quy đổi ×40): ĐUT = MĐUT nếu ĐGNL<900; nếu ≥900:
 * ĐUT=[(1200-ĐGNL)/300]×MĐUT. */
export function calculateHuflitPriority1200(input: { dgnlScore1200: number; standardPriority30: number }) {
  const standardPriority1200 = input.standardPriority30 * 40;
  if (standardPriority1200 === 0) return { effectivePriority1200: 0, reduced: false };
  const cappedScore = Math.min(1200, input.dgnlScore1200);
  if (cappedScore < 900) return { effectivePriority1200: standardPriority1200, reduced: false };
  const effectivePriority1200 = Math.max(0, round2(((1200 - cappedScore) / 300) * standardPriority1200));
  return { effectivePriority1200, reduced: true };
}
