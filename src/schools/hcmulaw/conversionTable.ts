import { round2 } from '../../core/round2';
import type { SubjectId } from '../../core/subjects';

/**
 * "Khung quy đổi điểm thi V-SAT và điểm thi tốt nghiệp THPT năm 2026 theo các mốc phân vị" (mục
 * 2.2, Thông báo 9/7/2026 — `ts.hcmulaw.edu.vn`) — bảng percentile-band RIÊNG CHO TỪNG MÔN THI (khác
 * UFM quy đổi theo TỔ HỢP/phương thức) — mỗi môn V-SAT (thang 150) quy đổi độc lập sang điểm tương
 * đương thi TN THPT (thang 10) trước khi cộng 3 môn thành "điểm tổ hợp môn". Transcribe trực tiếp từ
 * 7 ảnh PNG gốc (`tuyensinh.hcmulaw.edu.vn/upload/images/2026/SÀN + QUY ĐỔI/<môn>.png`), đọc qua
 * chrome-devtools, verified 2026-08-20 — mỗi dòng đối chiếu 2 lần với ảnh gốc.
 */
export interface HcmulawVsatBand {
  readonly min: number;
  readonly max: number;
  readonly thpt10Min: number;
  readonly thpt10Max: number;
}

/** Biên dưới mọi khoảng đều LOẠI TRỪ (`a < x ≤ b`, verbatim công thức gốc) — thống nhất cho cả 7
 * bảng, không có khoảng nào dùng `≥` (khác V-SAT UFM có 1 khoảng ngoại lệ). */
export type HcmulawVsatTable = readonly HcmulawVsatBand[];

const TOAN: HcmulawVsatTable = [
  { min: 144, max: 150, thpt10Min: 9.5, thpt10Max: 10 },
  { min: 140.5, max: 144, thpt10Min: 9.5, thpt10Max: 9.5 },
  { min: 136.5, max: 140.5, thpt10Min: 9, thpt10Max: 9.5 },
  { min: 129.5, max: 136.5, thpt10Min: 9, thpt10Max: 9 },
  { min: 122.5, max: 129.5, thpt10Min: 8.5, thpt10Max: 9 },
  { min: 113, max: 122.5, thpt10Min: 8.25, thpt10Max: 8.5 },
  { min: 105.5, max: 113, thpt10Min: 7.75, thpt10Max: 8.25 },
  { min: 98.5, max: 105.5, thpt10Min: 7.5, thpt10Max: 7.75 },
  { min: 92.5, max: 98.5, thpt10Min: 7.25, thpt10Max: 7.5 },
  { min: 86, max: 92.5, thpt10Min: 6.75, thpt10Max: 7.25 },
  { min: 79, max: 86, thpt10Min: 6.25, thpt10Max: 6.75 },
  { min: 71.5, max: 79, thpt10Min: 5.75, thpt10Max: 6.25 },
  { min: 61, max: 71.5, thpt10Min: 5, thpt10Max: 5.75 },
  { min: 0, max: 61, thpt10Min: 0, thpt10Max: 5 },
];

const NGU_VAN: HcmulawVsatTable = [
  { min: 133.5, max: 150, thpt10Min: 9, thpt10Max: 10 },
  { min: 131.5, max: 133.5, thpt10Min: 9, thpt10Max: 9 },
  { min: 129, max: 131.5, thpt10Min: 8.75, thpt10Max: 9 },
  { min: 125, max: 129, thpt10Min: 8.5, thpt10Max: 8.75 },
  { min: 121.5, max: 125, thpt10Min: 8.25, thpt10Max: 8.5 },
  { min: 116.5, max: 121.5, thpt10Min: 8, thpt10Max: 8.25 },
  { min: 113, max: 116.5, thpt10Min: 7.75, thpt10Max: 8 },
  { min: 109.5, max: 113, thpt10Min: 7.5, thpt10Max: 7.75 },
  { min: 106, max: 109.5, thpt10Min: 7.25, thpt10Max: 7.5 },
  { min: 102.5, max: 106, thpt10Min: 7, thpt10Max: 7.25 },
  { min: 98.5, max: 102.5, thpt10Min: 6.75, thpt10Max: 7 },
  { min: 93.5, max: 98.5, thpt10Min: 6.25, thpt10Max: 6.75 },
  { min: 87, max: 93.5, thpt10Min: 5.75, thpt10Max: 6.25 },
  { min: 0, max: 87, thpt10Min: 0, thpt10Max: 5.75 },
];

const TIENG_ANH: HcmulawVsatTable = [
  { min: 142, max: 150, thpt10Min: 9.25, thpt10Max: 10 },
  { min: 138, max: 142, thpt10Min: 8.75, thpt10Max: 9.25 },
  { min: 135, max: 138, thpt10Min: 8.5, thpt10Max: 8.75 },
  { min: 129, max: 135, thpt10Min: 7.75, thpt10Max: 8.5 },
  { min: 121.5, max: 129, thpt10Min: 7.25, thpt10Max: 7.75 },
  { min: 112.9, max: 121.5, thpt10Min: 6.5, thpt10Max: 7.25 },
  { min: 105.5, max: 112.9, thpt10Min: 5.75, thpt10Max: 6.5 },
  { min: 99, max: 105.5, thpt10Min: 5.5, thpt10Max: 5.75 },
  { min: 92.5, max: 99, thpt10Min: 5, thpt10Max: 5.5 },
  { min: 86, max: 92.5, thpt10Min: 4.75, thpt10Max: 5 },
  { min: 78.5, max: 86, thpt10Min: 4.25, thpt10Max: 4.75 },
  { min: 70, max: 78.5, thpt10Min: 3.75, thpt10Max: 4.25 },
  { min: 59.5, max: 70, thpt10Min: 3.25, thpt10Max: 3.75 },
  { min: 0, max: 59.5, thpt10Min: 0, thpt10Max: 3.25 },
];

const VAT_LY: HcmulawVsatTable = [
  { min: 135, max: 150, thpt10Min: 9.25, thpt10Max: 10 },
  { min: 131, max: 135, thpt10Min: 9, thpt10Max: 9.25 },
  { min: 126.5, max: 131, thpt10Min: 8.75, thpt10Max: 9 },
  { min: 119, max: 126.5, thpt10Min: 8.35, thpt10Max: 8.75 },
  { min: 112.5, max: 119, thpt10Min: 8, thpt10Max: 8.35 },
  { min: 103.5, max: 112.5, thpt10Min: 7.25, thpt10Max: 8 },
  { min: 97.5, max: 103.5, thpt10Min: 6.75, thpt10Max: 7.25 },
  { min: 92, max: 97.5, thpt10Min: 6.25, thpt10Max: 6.75 },
  { min: 87, max: 92, thpt10Min: 6, thpt10Max: 6.25 },
  { min: 82, max: 87, thpt10Min: 5.5, thpt10Max: 6 },
  { min: 76.5, max: 82, thpt10Min: 5, thpt10Max: 5.5 },
  { min: 70, max: 76.5, thpt10Min: 4.35, thpt10Max: 5 },
  { min: 61.5, max: 70, thpt10Min: 3.75, thpt10Max: 4.35 },
  { min: 0, max: 61.5, thpt10Min: 0, thpt10Max: 3.75 },
];

const HOA_HOC: HcmulawVsatTable = [
  { min: 140, max: 150, thpt10Min: 9.5, thpt10Max: 10 },
  { min: 136.5, max: 140, thpt10Min: 9.25, thpt10Max: 9.5 },
  { min: 132, max: 136.5, thpt10Min: 9.25, thpt10Max: 9.25 },
  { min: 125, max: 132, thpt10Min: 8.75, thpt10Max: 9.25 },
  { min: 117, max: 125, thpt10Min: 8.5, thpt10Max: 8.75 },
  { min: 107, max: 117, thpt10Min: 8, thpt10Max: 8.5 },
  { min: 99, max: 107, thpt10Min: 7.75, thpt10Max: 8 },
  { min: 92.5, max: 99, thpt10Min: 7.35, thpt10Max: 7.75 },
  { min: 86, max: 92.5, thpt10Min: 7, thpt10Max: 7.35 },
  { min: 80, max: 86, thpt10Min: 6.6, thpt10Max: 7 },
  { min: 73, max: 80, thpt10Min: 6.1, thpt10Max: 6.6 },
  { min: 66, max: 73, thpt10Min: 5.5, thpt10Max: 6.1 },
  { min: 57, max: 66, thpt10Min: 4.75, thpt10Max: 5.5 },
  { min: 0, max: 57, thpt10Min: 0, thpt10Max: 4.75 },
];

const LICH_SU: HcmulawVsatTable = [
  { min: 141, max: 150, thpt10Min: 10, thpt10Max: 10 },
  { min: 138, max: 141, thpt10Min: 10, thpt10Max: 10 },
  { min: 136.5, max: 138, thpt10Min: 9.75, thpt10Max: 10 },
  { min: 131, max: 136.5, thpt10Min: 9.5, thpt10Max: 9.75 },
  { min: 126, max: 131, thpt10Min: 9.25, thpt10Max: 9.5 },
  { min: 119, max: 126, thpt10Min: 8.75, thpt10Max: 9.25 },
  { min: 113, max: 119, thpt10Min: 8.5, thpt10Max: 8.75 },
  { min: 108, max: 113, thpt10Min: 8.1, thpt10Max: 8.5 },
  { min: 103, max: 108, thpt10Min: 7.75, thpt10Max: 8.1 },
  { min: 97.5, max: 103, thpt10Min: 7.35, thpt10Max: 7.75 },
  { min: 91.5, max: 97.5, thpt10Min: 7, thpt10Max: 7.35 },
  { min: 85, max: 91.5, thpt10Min: 6.5, thpt10Max: 7 },
  { min: 75, max: 85, thpt10Min: 5.75, thpt10Max: 6.5 },
  { min: 0, max: 75, thpt10Min: 0, thpt10Max: 5.75 },
];

const DIA_LY: HcmulawVsatTable = [
  { min: 135, max: 150, thpt10Min: 9.5, thpt10Max: 10 },
  { min: 134, max: 135, thpt10Min: 9, thpt10Max: 9.5 },
  { min: 130.5, max: 134, thpt10Min: 8.75, thpt10Max: 9 },
  { min: 125, max: 130.5, thpt10Min: 8.5, thpt10Max: 8.75 },
  { min: 119.5, max: 125, thpt10Min: 8.25, thpt10Max: 8.5 },
  { min: 112, max: 119.5, thpt10Min: 7.75, thpt10Max: 8.25 },
  { min: 105.5, max: 112, thpt10Min: 7.25, thpt10Max: 7.75 },
  { min: 100.5, max: 105.5, thpt10Min: 7, thpt10Max: 7.25 },
  { min: 95.5, max: 100.5, thpt10Min: 6.5, thpt10Max: 7 },
  { min: 90.5, max: 95.5, thpt10Min: 6.25, thpt10Max: 6.5 },
  { min: 84.5, max: 90.5, thpt10Min: 5.75, thpt10Max: 6.25 },
  { min: 77.5, max: 84.5, thpt10Min: 5.35, thpt10Max: 5.75 },
  { min: 68, max: 77.5, thpt10Min: 4.6, thpt10Max: 5.35 },
  { min: 0, max: 68, thpt10Min: 0, thpt10Max: 4.6 },
];

/** `SubjectId` chưa có "Giáo dục Kinh tế và Pháp luật"/"Tin học"/"Công nghệ" trong bảng gốc (HCMULAW
 * chỉ công bố 7 môn Toán/Văn/Anh/Lý/Hóa/Sử/Địa) — môn nào không có bảng thì `undefined`, caller phải
 * tự xử lý (không suy đoán quy đổi cho môn thiếu bảng). */
const TABLES_BY_SUBJECT: Partial<Record<SubjectId, HcmulawVsatTable>> = {
  math: TOAN,
  literature: NGU_VAN,
  english: TIENG_ANH,
  physics: VAT_LY,
  chemistry: HOA_HOC,
  history: LICH_SU,
  geography: DIA_LY,
};

export function getHcmulawVsatTable(subjectId: SubjectId): HcmulawVsatTable | undefined {
  return TABLES_BY_SUBJECT[subjectId];
}

function findBand(table: HcmulawVsatTable, x: number): HcmulawVsatBand | undefined {
  return table.find((band) => x > band.min && x <= band.max);
}

/**
 * Nội suy tuyến tính (mục 2.2.a, verbatim): "phương pháp bách phân vị, kết hợp phép nội suy tuyến
 * tính" — công thức y = c + (x-a)(d-c)/(b-a) (giống mẫu UFM/hình thức chung của phương pháp bách
 * phân vị, xác nhận độc lập qua ví dụ minh họa trang V-SAT.png: x=125, khoảng 10% Toán (a=122.5
 * b=129.5 c=8.5 d=9.0) → y=8.68). `x` vượt trần bảng (150, = thang điểm tối đa V-SAT) không xảy ra
 * (150 đã là trần tuyệt đối, band cao nhất phủ tới 150). `x` = 0 chính xác (biên loại trừ) trả về
 * `undefined` — trường hợp lý thuyết, không có evidence xử lý.
 */
export function convertHcmulawVsatSubjectScore(subjectId: SubjectId, x: number): number | undefined {
  const table = getHcmulawVsatTable(subjectId);
  if (!table) return undefined;
  const band = findBand(table, x);
  if (!band) return undefined;
  const { min: a, max: b, thpt10Min: c, thpt10Max: d } = band;
  if (a === b || c === d) return round2(c);
  return round2(c + ((x - a) * (d - c)) / (b - a));
}
