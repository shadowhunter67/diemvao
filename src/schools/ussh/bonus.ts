/**
 * Điểm cộng (ĐC) USSH 2026 — nguồn `ussh-info-pdf-2026` (mục 5b, trang 8-9). Biết được TRẦN theo
 * từng nhóm thành tích và công thức giảm gần trần, nhưng KHÔNG biết mức cộng cụ thể cho từng tiêu
 * chí trong nhóm — nguyên văn: "Chi tiết về mức cộng điểm của từng nhóm sẽ được Hội đồng tuyển
 * sinh xem xét trong quá trình xử lý nguyện vọng và công bố cùng với kết quả xét tuyển." Đây là
 * gap CẤU TRÚC (do trường chủ động để ngỏ, không phải ảnh/PDF đọc thiếu) — không suy đoán số.
 *
 * Hệ quả: UniscoreVN chỉ hỗ trợ chính xác cho THÍ SINH KHÔNG CÓ thành tích được cộng điểm (ĐC=0,
 * một applicant scope hợp lệ theo "supported-scope exactness") — thí sinh CÓ thành tích thuộc bất
 * kỳ nhóm nào thì UniscoreVN không tính được số ĐC cụ thể, giữ ở trạng thái blocked riêng cho
 * trường hợp đó (không mặc định 0).
 */
export const USSH_BONUS_MAX_TOTAL_100 = 10;
export const USSH_BONUS_GROUP_CAPS_100 = {
  group1: 3,
  group2: 4,
  group3: 3,
} as const;

export interface UsshBonusResult {
  /** true nếu thí sinh khai báo KHÔNG có thành tích thuộc bất kỳ nhóm nào — ĐC=0 tính được chính xác. */
  supported: boolean;
  awardedPoints100: number;
}

/** `hasAnyBonusAchievement`: thí sinh có thuộc ÍT NHẤT 1 trong 3 nhóm thành tích hay không.
 * `undefined`/`false` -> ĐC=0 (supported, exact). `true` -> mức cộng cụ thể chưa xác định được. */
export function calculateUsshBonus(hasAnyBonusAchievement: boolean | undefined): UsshBonusResult {
  if (hasAnyBonusAchievement) {
    return { supported: false, awardedPoints100: 0 };
  }
  return { supported: true, awardedPoints100: 0 };
}
