/**
 * Điểm xét thưởng theo thành tích cá nhân (ĐXTCN), thang 30 — Bảng 2 mục 2 văn bản 1691/ĐHCNKT-ĐT
 * (`evidence.ts:hcmuteBonusEvidence`). Chỉ triển khai mục 2 (giải HSG cấp tỉnh/thành phố các môn
 * thuộc tổ hợp xét tuyển) + mục 3 (giải khuyến khích HSG quốc gia) — đây là 2 mục áp dụng chung
 * mọi ngành. Các mục 1 (Điểm thưởng cho diện tuyển thẳng không dùng quyền), 4-7 (giải KHKT/mỹ
 * thuật/thể thao/tay nghề theo ngành đặc thù) và Điểm xét thưởng nhóm trường (ĐXTT, Bảng 3, cần
 * tra Phụ lục 6/7/8 — danh sách trường chuyên/liên kết/ưu tiên hàng trăm dòng) CHƯA implement —
 * xem `knowledgeGaps.ts`. Thí sinh chỉ được cộng 1 thành tích cao nhất (không cộng dồn).
 */
export const HCMUTE_BONUS_PROVINCIAL_RANK_POINTS_30: Record<'nhat' | 'nhi' | 'ba', number> = {
  nhat: 1.2,
  nhi: 1.0,
  ba: 0.8,
};

export const HCMUTE_BONUS_NATIONAL_ENCOURAGEMENT_POINTS_30 = 1.5;

export const HCMUTE_BONUS_CAP_30 = 3.0;

export interface HcmuteBonusInput {
  /** Giải HSG THPT cấp tỉnh/thành phố (môn thuộc tổ hợp xét tuyển). */
  provincialRank?: 'nhat' | 'nhi' | 'ba';
  /** Giải khuyến khích kỳ thi chọn HSG quốc gia (môn/đề tài phù hợp chương trình đào tạo). */
  nationalEncouragement?: boolean;
}

export function calculateHcmuteBonus(input: HcmuteBonusInput): number {
  const candidates: number[] = [];
  if (input.provincialRank) candidates.push(HCMUTE_BONUS_PROVINCIAL_RANK_POINTS_30[input.provincialRank]);
  if (input.nationalEncouragement) candidates.push(HCMUTE_BONUS_NATIONAL_ENCOURAGEMENT_POINTS_30);
  if (candidates.length === 0) return 0;
  return Math.min(HCMUTE_BONUS_CAP_30, Math.max(...candidates));
}
