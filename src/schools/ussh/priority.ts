/**
 * Bảng điểm ưu tiên khu vực/đối tượng GỐC (trước khi giảm theo `priorityReduction.ts`) — USSH
 * 2026. Nguồn `ussh-info-pdf-2026`/`ussh-scoring-clarification-2026` (mục 5c) chỉ nói "Thí sinh
 * được hưởng chính sách ưu tiên khu vực, đối tượng thực hiện theo quy chế tuyển sinh hiện hành"
 * + "Mức điểm ưu tiên khu vực, đối tượng (đã quy đổi về thang điểm 100)" — KHÔNG in lại bảng số cụ
 * thể. Bảng gốc theo quy chế tuyển sinh hiện hành của Bộ GDĐT (Thông tư quy chế tuyển sinh đại học
 * hiện hành) định nghĩa TRÊN THANG 30: KV1=0.75, KV2-NT=0.5, KV2=0.25, KV3=0; UT1=2, UT2=1 — CÙNG
 * bảng hằng số quốc gia đã dùng cho HCMUS (`schools/hcmus/priority.ts`, thang 30 không quy đổi vì
 * HCMUS tính trên thang 30). Quy đổi sang thang 100 dùng ĐÚNG công thức ×100/30 mà CHÍNH PDF USSH
 * đã công bố tường minh cho MỌI thành phần khác trong cùng công thức (THPT, ĐGNL, HB đều nhân
 * 100/30 hoặc 100/1200) — không phải suy đoán công thức mới, chỉ áp dụng lại quy tắc quy đổi đã
 * verified trong cùng nguồn. Vì bảng gốc không được USSH tự in lại bằng số cụ thể trên thang 100,
 * verification ở mức 'cross-checked' (không phải 'verified' trực tiếp từ USSH).
 */
export const USSH_PRIORITY_REGION_POINTS_100: Record<string, number> = {
  KV1: 2.5,
  'KV2-NT': 5 / 3,
  KV2: 5 / 6,
  KV3: 0,
};

export const USSH_PRIORITY_CATEGORY_POINTS_100: Record<string, number> = {
  UT1: 20 / 3,
  UT2: 10 / 3,
};

export function lookupUsshStandardPriority(region: string | undefined, category: string | undefined): number {
  const regionPoints = region ? (USSH_PRIORITY_REGION_POINTS_100[region] ?? 0) : 0;
  const categoryPoints = category ? (USSH_PRIORITY_CATEGORY_POINTS_100[category] ?? 0) : 0;
  return Math.round((regionPoints + categoryPoints) * 100) / 100;
}
