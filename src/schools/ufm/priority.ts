import { round2 } from '../../core/round2';

/**
 * Điểm ưu tiên khu vực/đối tượng — bảng CHUẨN QUỐC GIA (Quy chế tuyển sinh Bộ GDĐT), cross-checked
 * nội bộ với 7 trường khác trong repo dùng đúng công thức tỉ lệ 75%/25% này
 * (`evidence.ts`/`knowledgeGaps.ts:ufm-priority-table-not-ufm-specific`) — KHÔNG tìm được trang UFM
 * tự công bố bảng số trực tiếp nên verification giữ `cross-checked`.
 */
export const UFM_PRIORITY_REGION_POINTS_30: Record<string, number> = {
  KV1: 0.75,
  'KV2-NT': 0.5,
  KV2: 0.25,
  KV3: 0,
};

export const UFM_PRIORITY_CATEGORY_POINTS_30: Record<string, number> = {
  UT1: 2,
  UT2: 1,
};

export function lookupUfmStandardPriority30(region: string | undefined, category: string | undefined): number {
  return (region ? (UFM_PRIORITY_REGION_POINTS_30[region] ?? 0) : 0) + (category ? (UFM_PRIORITY_CATEGORY_POINTS_30[category] ?? 0) : 0);
}

/** Dùng chung cho cả 4 phương thức (THPT dùng thẳng raw30; học bạ/ĐGNL/V-SAT dùng `y` đã quy đổi
 * qua bảng bách phân vị — mục 4 Thông báo 2639/TB-ĐHTCM xác nhận "Điểm xét tuyển" mọi phương thức
 * đều thang 30 nên chung 1 công thức giảm ưu tiên): ĐUT = MĐUT nếu tổng<22,5; nếu ≥22,5:
 * ĐUT=[(30-tổng)/7,5]×MĐUT. */
export function calculateUfmPriority30(input: { academicScore30: number; standardPriority30: number }) {
  if (input.standardPriority30 === 0) return { effectivePriority30: 0, reduced: false };
  const cappedTotal = Math.min(30, input.academicScore30);
  if (cappedTotal < 22.5) return { effectivePriority30: input.standardPriority30, reduced: false };
  const effectivePriority30 = Math.max(0, round2(((30 - cappedTotal) / 7.5) * input.standardPriority30));
  return { effectivePriority30, reduced: true };
}
