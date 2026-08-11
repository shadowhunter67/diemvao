/**
 * Bảng quy đổi điểm ĐGNL-HCM (thang 1200) sang điểm tương đương thi tốt nghiệp THPT (thang 30),
 * nguồn: tuyensinh.ueh.edu.vn "Hướng dẫn quy đổi điểm giữa các kỳ thi trong Phương thức xét
 * tuyển tích hợp Khóa 52 ĐH chính quy UEH 2026" — bảng 12 khoảng, verified (đọc trực tiếp từ
 * trang, không phải ảnh). Trường tự nói dùng "phương pháp nội suy tuyến tính" NỘI BỘ từng
 * khoảng — hàm dưới đây implement đúng cách đó, không suy đoán khác đi.
 */
export interface DgnlConversionRange {
  dgnlMin: number;
  dgnlMax: number;
  thptMin: number;
  thptMax: number;
}

export const UEH_DGNL_TO_THPT_TABLE: DgnlConversionRange[] = [
  { dgnlMin: 450, dgnlMax: 500, thptMin: 15.0, thptMax: 16.15 },
  { dgnlMin: 500, dgnlMax: 550, thptMin: 16.15, thptMax: 17.2 },
  { dgnlMin: 550, dgnlMax: 600, thptMin: 17.2, thptMax: 18.1 },
  { dgnlMin: 600, dgnlMax: 650, thptMin: 18.1, thptMax: 18.85 },
  { dgnlMin: 650, dgnlMax: 700, thptMin: 18.85, thptMax: 19.61 },
  { dgnlMin: 700, dgnlMax: 740, thptMin: 19.61, thptMax: 20.55 },
  { dgnlMin: 740, dgnlMax: 780, thptMin: 20.55, thptMax: 21.15 },
  { dgnlMin: 780, dgnlMax: 835, thptMin: 21.15, thptMax: 22.15 },
  { dgnlMin: 835, dgnlMax: 900, thptMin: 22.15, thptMax: 24.0 },
  { dgnlMin: 900, dgnlMax: 945, thptMin: 24.0, thptMax: 25.3 },
  { dgnlMin: 945, dgnlMax: 980, thptMin: 25.3, thptMax: 27.08 },
  { dgnlMin: 980, dgnlMax: 1200, thptMin: 27.08, thptMax: 30.0 },
];

/**
 * Quy đổi điểm ĐGNL-HCM sang thang điểm tốt nghiệp THPT tương đương (thang 30), nội suy tuyến
 * tính trong đúng khoảng chứa điểm. Trả về `null` nếu điểm nằm ngoài khoảng bảng công bố
 * (450–1200) — KHÔNG ngoại suy ra ngoài bảng vì trường không công bố công thức cho vùng đó.
 */
export function convertDgnlToThpt(dgnlScore: number): number | null {
  if (dgnlScore < 450 || dgnlScore > 1200) return null;

  const range = UEH_DGNL_TO_THPT_TABLE.find((r) => dgnlScore > r.dgnlMin && dgnlScore <= r.dgnlMax);
  if (!range) {
    // Đúng điểm biên dưới cùng (450) — bảng dùng "<" ở đầu dưới, khớp mốc 450 vào khoảng đầu tiên.
    if (dgnlScore === 450) return UEH_DGNL_TO_THPT_TABLE[0].thptMin;
    return null;
  }

  const ratio = (dgnlScore - range.dgnlMin) / (range.dgnlMax - range.dgnlMin);
  return range.thptMin + ratio * (range.thptMax - range.thptMin);
}
