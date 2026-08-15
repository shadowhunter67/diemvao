/**
 * Điểm ưu tiên khu vực/đối tượng IU 2026, nguồn `iu-admission-info-2026` Khoản 7 — "thí sinh
 * được hưởng mức điểm ưu tiên khu vực, ưu tiên đối tượng theo thang điểm 100": KV1=2.5,
 * KV2-NT=1.67, KV2=0.83, KV3=0; UT1 (đối tượng 01-03)=6.66, UT2 (đối tượng 04-06)=3.33.
 *
 * Các số này khớp CHÍNH XÁC với bảng ưu tiên chuẩn Bộ GD&ĐT thang 30 (KV1=0.75/KV2-NT=0.5/
 * KV2=0.25/KV3=0, UT1=+2.0/UT2=+1.0) nhân hệ số (100/30)=3.333...: 0.75×10/3=2.5,
 * 0.5×10/3=1.666...≈1.67, 0.25×10/3=0.8333...≈0.83, 2.0×10/3=6.666...≈6.66, 1.0×10/3=3.333...≈3.33
 * — xác nhận đây đúng là bảng chuẩn quy đổi thang 100, không phải bảng riêng của IU.
 *
 * `ApplicantProfile.priority.region`/`category` lưu mã ('KV1', 'UT1'...) — dùng thẳng, không
 * cần UI nhập lại riêng cho IU.
 */
export const IU_PRIORITY_REGION_POINTS_100: Record<string, number> = {
  KV1: 2.5,
  'KV2-NT': 1.67,
  KV2: 0.83,
  KV3: 0,
};

export const IU_PRIORITY_CATEGORY_POINTS_100: Record<string, number> = {
  UT1: 6.66,
  UT2: 3.33,
};

/** Điểm ưu tiên khu vực + đối tượng CHƯA giảm (trước khi áp công thức giảm ở `priorityReduction.ts`).
 * Mã không nhận diện được (hoặc bỏ trống) coi như 0 — không suy đoán. */
export function lookupIuStandardPriority(region: string | undefined, category: string | undefined): number {
  const regionPoints = region !== undefined ? (IU_PRIORITY_REGION_POINTS_100[region] ?? 0) : 0;
  const categoryPoints = category !== undefined ? (IU_PRIORITY_CATEGORY_POINTS_100[category] ?? 0) : 0;
  return regionPoints + categoryPoints;
}
