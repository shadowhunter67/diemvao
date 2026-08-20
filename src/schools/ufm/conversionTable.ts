import { round2 } from '../../core/round2';

/**
 * "Khung quy đổi tương đương điểm" (mục 3, Thông báo 2639/TB-ĐHTCM, 10/7/2026) — bảng bách phân vị
 * (percentile band) dùng để quy đổi điểm thô của phương thức học bạ/ĐGNL/V-SAT sang thang điểm
 * tương đương thi TN THPT 2026 (thang 30), TRƯỚC khi cộng điểm ưu tiên/điểm cộng (mục 4). Transcribe
 * trực tiếp từ ảnh PDF gốc (chrome-devtools screenshot tại `login.ufm.edu.vn`, có dấu/chữ ký,
 * verified 2026-08-20) — mỗi dòng đã đối chiếu với ảnh gốc, KHÔNG suy diễn/nội suy thêm dòng.
 */
export interface UfmConversionBand {
  readonly min: number;
  readonly max: number;
  /** true nếu biên dưới BAO GỒM giá trị `min` (`≥`); false nếu LOẠI TRỪ (`>`) — theo đúng ký hiệu
   * gốc văn bản cho TỪNG khoảng, KHÔNG suy đoán một quy ước chung cho cả bảng. Bảng học bạ/ĐGNL
   * dùng `≥` cho mọi khoảng (các khoảng cách nhau 0,01 nên không chồng biên); bảng V-SAT dùng `>`
   * cho biên trong (khoảng 1-5, tránh đếm trùng biên chia sẻ) và `≥` cho khoảng thấp nhất (khoảng
   * 6 — sàn tuyệt đối, không có khoảng nào bên dưới để chồng biên). */
  readonly minInclusive: boolean;
  readonly thpt30Min: number;
  readonly thpt30Max: number;
}

export type UfmConversionTable = readonly UfmConversionBand[];

/** Mục 3.1 — học bạ (thang điểm 30) ↔ thi TN THPT 2026 (thang 30). */
export const UFM_HOCBA_CONVERSION_TABLE: UfmConversionTable = [
  { min: 28.65, max: 30.0, minInclusive: true, thpt30Min: 25.75, thpt30Max: 30.0 },
  { min: 27.15, max: 28.64, minInclusive: true, thpt30Min: 24.25, thpt30Max: 25.74 },
  { min: 25.95, max: 27.14, minInclusive: true, thpt30Min: 23.25, thpt30Max: 24.24 },
  { min: 24.15, max: 25.94, minInclusive: true, thpt30Min: 21.75, thpt30Max: 23.24 },
  { min: 20.15, max: 24.14, minInclusive: true, thpt30Min: 18.05, thpt30Max: 21.74 },
  { min: 18.0, max: 20.14, minInclusive: true, thpt30Min: 16.0, thpt30Max: 18.04 },
];

/** Mục 3.2 — ĐGNL ĐHQG-HCM 2026 (thang điểm 1200) ↔ thi TN THPT 2026 (thang 30). Khoảng 1 chỉ phủ
 * tới 1139 (điểm cao nhất thực tế của kỳ thi, không phải trần lý thuyết 1200) — điểm >1139 được xử
 * lý riêng ở `convertUfmScoreToThpt30` (kẹp về 30, xem comment ở đó). */
export const UFM_DGNL_CONVERSION_TABLE: UfmConversionTable = [
  { min: 1027, max: 1139, minInclusive: true, thpt30Min: 26.75, thpt30Max: 30.0 },
  { min: 967, max: 1026, minInclusive: true, thpt30Min: 24.85, thpt30Max: 26.74 },
  { min: 928, max: 966, minInclusive: true, thpt30Min: 23.75, thpt30Max: 24.84 },
  { min: 874, max: 927, minInclusive: true, thpt30Min: 22.1, thpt30Max: 23.74 },
  { min: 749, max: 873, minInclusive: true, thpt30Min: 18.55, thpt30Max: 22.09 },
  { min: 657, max: 748, minInclusive: true, thpt30Min: 16.0, thpt30Max: 18.54 },
];

/** Mục 3.3 — V-SAT 2026 (thang điểm 450) ↔ thi TN THPT 2026 (thang 30). Khoảng 1-5 dùng biên dưới
 * LOẠI TRỪ (`>`) vì các khoảng chia sẻ đúng 1 giá trị biên (vd 409,5 vừa là min Khoảng1 vừa là max
 * Khoảng2) — bản gốc dùng `<` để tránh chồng lấn; Khoảng 6 (sàn tuyệt đối = ngưỡng đầu vào 241) dùng
 * biên dưới BAO GỒM (`≥`) vì không có khoảng nào bên dưới để chồng biên. */
export const UFM_VSAT_CONVERSION_TABLE: UfmConversionTable = [
  { min: 409.5, max: 450, minInclusive: false, thpt30Min: 27.25, thpt30Max: 30.0 },
  { min: 377.5, max: 409.5, minInclusive: false, thpt30Min: 25.1, thpt30Max: 27.25 },
  { min: 356.5, max: 377.5, minInclusive: false, thpt30Min: 23.75, thpt30Max: 25.1 },
  { min: 329.4, max: 356.5, minInclusive: false, thpt30Min: 22.0, thpt30Max: 23.75 },
  { min: 272, max: 329.4, minInclusive: false, thpt30Min: 18.25, thpt30Max: 22.0 },
  { min: 241, max: 272, minInclusive: true, thpt30Min: 16.0, thpt30Max: 18.25 },
];

export function findUfmConversionBand(table: UfmConversionTable, x: number): UfmConversionBand | undefined {
  return table.find((band) => (band.minInclusive ? x >= band.min : x > band.min) && x <= band.max);
}

/**
 * Nội suy tuyến tính trong khoảng (mục 3.4, verbatim): y = c + (x-a)(d-c)/(b-a), làm tròn 2 chữ số
 * thập phân — verified khớp 100% ví dụ minh họa chính thức (V-SAT x=360,00 → y=23,98).
 *
 * `x` vượt trần khoảng cao nhất (chỉ xảy ra với bảng ĐGNL, xem comment ở
 * `UFM_DGNL_CONVERSION_TABLE`) được KẸP về `y` = trần khoảng cao nhất (=30, trần tuyệt đối thang
 * điểm) — đây là hệ quả bắt buộc của tính đơn điệu (điểm thô cao hơn không thể quy đổi ra điểm thấp
 * hơn) + trần 30 đã có sẵn ở khoảng cao nhất, KHÔNG phải suy diễn công thức mới. `x` dưới sàn khoảng
 * thấp nhất (hoặc rơi đúng vào biên loại trừ, vd V-SAT x=241 xét trong bảng vẫn hợp lệ vì Khoảng 6
 * bao gồm biên đó) trả về `undefined` — trường hợp dưới sàn thật sự đã bị loại bởi ngưỡng đảm bảo
 * chất lượng đầu vào trước khi gọi hàm này (`checkUfm*Threshold`), nên không cần suy đoán.
 */
export function convertUfmScoreToThpt30(x: number, table: UfmConversionTable): number | undefined {
  const lowestBand = table[table.length - 1];
  const highestBand = table[0];
  const lowestFloor = lowestBand.minInclusive ? lowestBand.min : lowestBand.min + Number.EPSILON;
  if (x < lowestFloor) return undefined;

  const clampedX = Math.min(x, highestBand.max);
  const band = findUfmConversionBand(table, clampedX);
  if (!band) return undefined;

  const { min: a, max: b, thpt30Min: c, thpt30Max: d } = band;
  if (a === b) return round2(c);
  return round2(c + ((clampedX - a) * (d - c)) / (b - a));
}
