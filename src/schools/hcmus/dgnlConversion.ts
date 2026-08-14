import { HCMUS_VACT_CONVERSION_TABLE } from './vactConversionTable';

/**
 * Quy đổi ĐGNL ĐHQG-HCM (thang 1200) sang thang THPT 30 theo bảng phân vị chính thức HCMUS 2026 —
 * nguồn `hcmus-vact-conversion-table-2026`. Đây LÀ "Điểm ĐGNL đã quy đổi sang thang 30" dùng trong
 * "ĐIỂM HỌC LỰC 2 = 0.8 × ĐIỂM ĐGNL + 0.2 × ĐIỂM HỌC BẠ" (xem `academicScore.ts`) — KHÔNG phải
 * linear `raw × 30 / 1200` (HCMUS cố tình dùng bảng phân vị thay vì tuyến tính đơn giản).
 *
 * Nội suy theo đúng công thức ảnh gốc: giả sử X1 > raw > X2 (2 mốc ĐGNL liền kề trong bảng, ứng
 * với A1/A2 THPT), `convertedTHPT = A2 + (A1 - A2) × (raw - X2) / (X1 - X2)`.
 *
 * Boundary policy (không suy đoán ngoài phạm vi bảng):
 * - raw ≥ 1139 ("<1%", mốc cao nhất bảng công bố) → clamp về 30. Có CĂN CỨ rõ ràng để clamp
 *   (không phải suy đoán): 30 LÀ trần của thang đích (thang THPT tối đa 30 điểm), nên bất kỳ điểm
 *   nào đạt ngưỡng phân vị cao nhất trở lên đều không thể quy đổi ra số lớn hơn trần thang đích.
 * - raw < 370 (mốc "100%", thấp nhất bảng công bố) → trả `null` (unavailable). KHÔNG có căn cứ
 *   tương tự để clamp về sàn — trường không công bố quy đổi cho vùng dưới 370, và 370 không phải
 *   sàn của thang ĐGNL gốc (thang ĐGNL 0-1200), nên clamp ở đây sẽ là suy đoán ngoài evidence.
 */
export interface HcmusVactConversionResult {
  thptScore: number;
  /** true nếu raw trùng đúng 1 mốc trong bảng (không cần nội suy). */
  exactBreakpoint: boolean;
  /** true nếu raw ≥ mốc cao nhất bảng (đã clamp về 30, có căn cứ trần thang đích). */
  clampedAtCeiling: boolean;
}

export function convertHcmusVactToThpt(rawVactScore: number): HcmusVactConversionResult | null {
  const table = HCMUS_VACT_CONVERSION_TABLE;
  const highest = table[0];
  const lowest = table[table.length - 1];

  if (rawVactScore >= highest.vactScore) {
    return { thptScore: 30, exactBreakpoint: rawVactScore === highest.vactScore, clampedAtCeiling: rawVactScore > highest.vactScore };
  }
  if (rawVactScore < lowest.vactScore) {
    return null;
  }

  const exact = table.find((row) => row.vactScore === rawVactScore);
  if (exact) {
    return { thptScore: exact.thptScore, exactBreakpoint: true, clampedAtCeiling: false };
  }

  // Bảng sort giảm dần theo vactScore (percentile tăng dần) — tìm cặp mốc liền kề X1 > raw > X2.
  for (let i = 0; i < table.length - 1; i++) {
    const upper = table[i];
    const lower = table[i + 1];
    if (upper.vactScore > rawVactScore && rawVactScore > lower.vactScore) {
      const x1 = upper.vactScore;
      const x2 = lower.vactScore;
      const a1 = upper.thptScore;
      const a2 = lower.thptScore;
      const converted = a2 + ((a1 - a2) * (rawVactScore - x2)) / (x1 - x2);
      return { thptScore: converted, exactBreakpoint: false, clampedAtCeiling: false };
    }
  }

  return null;
}
