/**
 * Điểm ưu tiên khu vực/đối tượng UEH 2026 — Phương thức Xét tuyển tích hợp, thang 100. Nguồn:
 * `ueh-ksa-ksv-info-2026`. Bảng mức điểm trùng chính sách ưu tiên chuẩn quốc gia (Thông tư 08),
 * quy đổi từ thang 30 sang thang 100 (×10/3): KV1 2.5 (7.5×10/3), ĐT1-3 6.67 (20×10/3)...
 * Công thức giảm dần áp dụng khi tổng điểm (chưa gồm ưu tiên) ≥75 — đúng nguyên văn nguồn.
 */
export type UehPriorityZone = 'kv1' | 'kv2nt' | 'kv2' | 'kv3';
export type UehPriorityObjectGroup = 'dt1-3' | 'dt4-6' | 'none';

export const UEH_PRIORITY_ZONE_POINTS: Record<UehPriorityZone, number> = {
  kv1: 2.5,
  kv2nt: 1.67,
  kv2: 0.83,
  kv3: 0,
};

export const UEH_PRIORITY_ZONE_LABELS: Record<UehPriorityZone, string> = {
  kv1: 'Khu vực 1 (KV1)',
  kv2nt: 'Khu vực 2 nông thôn (KV2-NT)',
  kv2: 'Khu vực 2 (KV2)',
  kv3: 'Khu vực 3 (KV3)',
};

export const UEH_PRIORITY_OBJECT_POINTS: Record<UehPriorityObjectGroup, number> = {
  'dt1-3': 6.67,
  'dt4-6': 3.33,
  none: 0,
};

export const UEH_PRIORITY_OBJECT_LABELS: Record<UehPriorityObjectGroup, string> = {
  'dt1-3': 'Đối tượng ưu tiên 1–3 (ĐT1-ĐT3)',
  'dt4-6': 'Đối tượng ưu tiên 4–6 (ĐT4-ĐT6)',
  none: 'Không thuộc đối tượng ưu tiên chính sách',
};

/** Ngưỡng tổng điểm (thang 100, đã gồm điểm cộng, chưa gồm ưu tiên) mà công thức giảm dần bắt
 * đầu áp dụng — dưới ngưỡng này hưởng trọn mức điểm ưu tiên. */
export const UEH_PRIORITY_REDUCTION_THRESHOLD = 75;

export interface UehPriorityResult {
  basePoints: number;
  received: number;
  reduced: boolean;
}

export function computeUehPriority(
  zone: UehPriorityZone,
  objectGroup: UehPriorityObjectGroup,
  totalBeforePriority: number
): UehPriorityResult {
  const basePoints = UEH_PRIORITY_ZONE_POINTS[zone] + UEH_PRIORITY_OBJECT_POINTS[objectGroup];
  if (basePoints === 0) {
    return { basePoints: 0, received: 0, reduced: false };
  }
  if (totalBeforePriority < UEH_PRIORITY_REDUCTION_THRESHOLD) {
    return { basePoints, received: basePoints, reduced: false };
  }
  const received = ((100 - totalBeforePriority) / 25) * basePoints;
  return { basePoints, received: Math.max(0, received), reduced: true };
}
