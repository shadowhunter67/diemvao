/**
 * Bảng điểm cộng UEH 2026 — Phương thức Xét tuyển tích hợp, Đối tượng 1 (thí sinh tốt nghiệp THPT
 * Việt Nam). Nguồn: `ueh-ksa-ksv-info-2026` (xem sources.ts) — bảng đầy đủ, không phải ví dụ minh
 * họa. Áp dụng chung cho cả mã KSA (TP.HCM) và KSV (Mekong – Vĩnh Long), trường tự nói "quy tắc
 * tương tự".
 *
 * "Điểm xét thưởng" (nhóm reward) lấy MAX trong nhóm (không cộng dồn nhiều tiêu chí reward), tối
 * đa 5.0. "Điểm khuyến khích" (nhóm encouragement) tối đa 5.0 riêng, cộng thêm vào reward. Tổng
 * điểm cộng tối đa 10.0 (10% thang 100) — hai giới hạn 5.0 riêng biệt đã tự đảm bảo tổng ≤10.
 */
export type UehBonusGroup = 'reward' | 'encouragement';

export interface UehBonusOption {
  id: string;
  label: string;
  points: number;
  group: UehBonusGroup;
}

export const UEH_BONUS_MAX_PER_GROUP = 5;
export const UEH_BONUS_MAX_TOTAL = 10;

/** Đối tượng 1 — thí sinh tốt nghiệp THPT Việt Nam. */
export const UEH_BONUS_DOMESTIC: UehBonusOption[] = [
  { id: 'hsg-tinh-nhat', label: 'Giải Nhất học sinh giỏi THPT cấp Tỉnh/TP', points: 5.0, group: 'reward' },
  { id: 'hsg-tinh-nhi', label: 'Giải Nhì học sinh giỏi THPT cấp Tỉnh/TP', points: 4.0, group: 'reward' },
  { id: 'hsg-tinh-ba', label: 'Giải Ba học sinh giỏi THPT cấp Tỉnh/TP', points: 3.0, group: 'reward' },
  { id: 'thpt-chuyen', label: 'Học 1–3 năm tại trường THPT Chuyên/Năng khiếu', points: 2.0, group: 'reward' },
  {
    id: 'ielts-6',
    label: 'Chứng chỉ tiếng Anh quốc tế còn thời hạn, tương đương IELTS Academic ≥6.0',
    points: 5.0,
    group: 'encouragement',
  },
];

export interface UehBonusResult {
  rewardPoints: number;
  encouragementPoints: number;
  total: number;
}

/** MAX trong từng nhóm rồi cộng 2 nhóm lại, cap ở `UEH_BONUS_MAX_TOTAL` (đã tự nhỏ hơn tổng 2 cap
 * nhóm nên không bao giờ chạm nhánh cap này trong dữ liệu hiện tại — vẫn giữ để an toàn nếu bảng
 * đổi). */
export function computeUehBonus(selectedIds: readonly string[], options: readonly UehBonusOption[] = UEH_BONUS_DOMESTIC): UehBonusResult {
  const selected = options.filter((option) => selectedIds.includes(option.id));
  const rewardPoints = Math.min(
    UEH_BONUS_MAX_PER_GROUP,
    selected.filter((option) => option.group === 'reward').reduce((max, option) => Math.max(max, option.points), 0)
  );
  const encouragementPoints = Math.min(
    UEH_BONUS_MAX_PER_GROUP,
    selected.filter((option) => option.group === 'encouragement').reduce((max, option) => Math.max(max, option.points), 0)
  );
  return {
    rewardPoints,
    encouragementPoints,
    total: Math.min(UEH_BONUS_MAX_TOTAL, rewardPoints + encouragementPoints),
  };
}
