import { VACT_TOTAL_RANGE } from '../../core/vactProfile';

/**
 * Batch 5, workstream N — UEL đã công bố công thức quy đổi ĐGNL → thang 100 ĐẦY ĐỦ, đơn giản hơn
 * UEH (không phải bảng nội suy 12 khoảng): "ĐGNL quy đổi thang 100 = điểm bài thi ĐGNL × 100/1200"
 * (xem `UelExplorerPage.tsx` mục "Công thức đã biết", docs/admission-research-2026.md#uel).
 * Trả về `null` nếu điểm ngoài thang ĐGNL hợp lệ (`VACT_TOTAL_RANGE`, dùng chung với
 * `core/vactProfile.ts` vì cùng 1 kỳ thi — không duplicate range riêng UEL).
 */
export function convertDgnlToScale100(dgnlScore: number): number | null {
  if (dgnlScore < VACT_TOTAL_RANGE.min || dgnlScore > VACT_TOTAL_RANGE.max) return null;
  return (dgnlScore * 100) / 1200;
}
