import { round2 } from '../../core/round2';

/**
 * "Điểm học lực" (ĐHL) 3 đối tượng xét tuyển USSH 2026 — công thức lấy NGUYÊN VĂN từ PDF chính
 * thức `ussh-info-pdf-2026` (mục 2.2.2, trang 3-4), xác nhận độc lập lần 2 bởi thông báo
 * `ussh-scoring-clarification-2026` (xem `sources.ts`). Cả 2 nguồn đều KHÔNG chứa α trong công
 * thức ĐHL:
 *
 *   ĐHL1 = 0.45×[THPT×100/30] + 0.45×[ĐGNL×100/1200] + 0.10×[HB×100/30]   (đủ 3 thành phần)
 *   ĐHL2 = 0.90×[THPT×100/30] + 0.10×[HB×100/30]                          (chỉ có THPT + HB)
 *   ĐHL3 = 0.90×[ĐGNL×100/1200] + 0.10×[HB×100/30]                        (chỉ có ĐGNL + HB)
 *
 * Batch trước (re-audit 2026-08-13/14) dùng ảnh infographic hiển thị "THPT + α2" cho ĐT1/ĐT2 và
 * kết luận blocked vì không rõ vai trò α1/α2. PDF chính thức (nguồn văn bản, không phải ảnh, đọc
 * trực tiếp qua text layer) là bản đầy đủ hơn: mục 3b của CHÍNH PDF này giải thích rõ — hệ số quy
 * đổi α CHỈ dùng để "quy đổi độ lệch điểm ngưỡng đầu vào và điểm trúng tuyển giữa các tổ hợp"
 * (trường dùng nội bộ khi xác định điểm chuẩn/ngưỡng cho đối tượng 2 và 3 theo từng tổ hợp), KHÔNG
 * xuất hiện trong công thức ĐHL của một thí sinh cụ thể — "Điểm lệch giữa các tổ hợp được phân
 * tích, xử lý trong quá trình xử lý nguyện vọng của thí sinh" (PDF trang 5). Vì vậy ĐHL1/ĐHL2/ĐHL3
 * tính được ĐẦY ĐỦ cho một thí sinh mà KHÔNG cần biết giá trị α — α chỉ ảnh hưởng cách trường tự
 * xếp hạng/thiết lập điểm chuẩn nội bộ giữa các tổ hợp, không phải input của phép tính điểm cá
 * nhân.
 *
 * Vẫn CHƯA phải điểm xét tuyển cuối cùng — thiếu 2 phần: Điểm cộng (mức cộng theo Nhóm thành tích
 * cụ thể CHƯA công bố, chỉ có mức trần theo nhóm — xem `bonus.ts`) và Điểm ưu tiên (bảng gốc theo
 * khu vực/đối tượng suy từ quy chế quốc gia thang 30, quy đổi ×100/30 — xem `priority.ts`).
 */
export interface UsshDhlInput {
  /** Điểm thi TN THPT theo tổ hợp xét tuyển, thang 30. */
  thptRawTotal30?: number;
  /** Điểm ĐGNL ĐHQG-HCM, thang 1200 (giá trị cao nhất 2 lần thi). */
  dgnlRaw1200?: number;
  /** Điểm học bạ 3 năm theo tổ hợp xét tuyển, thang 30. */
  transcriptTotal30?: number;
}

export type UsshApplicantType = 'DT1' | 'DT2' | 'DT3';

export interface UsshDhlResult {
  applicantType: UsshApplicantType;
  /** ĐHL trước Điểm cộng/Điểm ưu tiên, thang 100. */
  scoreBeforeBonusAndPriority: number;
  thptComponent?: number;
  dgnlComponent?: number;
  transcriptComponent?: number;
}

const SCALE_100 = 100;
const RAW_SCALE_30 = 30;
const RAW_SCALE_1200 = 1200;

function toScale100(raw: number, rawScale: number): number {
  return (raw * SCALE_100) / rawScale;
}

/** ĐHL1 — đủ 3 thành phần (0.45 THPT + 0.45 ĐGNL + 0.10 Học bạ). */
export function calculateUsshDhl1Score(input: { thptRawTotal30: number; dgnlRaw1200: number; transcriptTotal30: number }): UsshDhlResult {
  const thptComponent = round2(0.45 * toScale100(input.thptRawTotal30, RAW_SCALE_30));
  const dgnlComponent = round2(0.45 * toScale100(input.dgnlRaw1200, RAW_SCALE_1200));
  const transcriptComponent = round2(0.1 * toScale100(input.transcriptTotal30, RAW_SCALE_30));
  return {
    applicantType: 'DT1',
    thptComponent,
    dgnlComponent,
    transcriptComponent,
    scoreBeforeBonusAndPriority: round2(thptComponent + dgnlComponent + transcriptComponent),
  };
}

/** ĐHL2 — chỉ THPT + Học bạ (0.90 THPT + 0.10 Học bạ). */
export function calculateUsshDhl2Score(input: { thptRawTotal30: number; transcriptTotal30: number }): UsshDhlResult {
  const thptComponent = round2(0.9 * toScale100(input.thptRawTotal30, RAW_SCALE_30));
  const transcriptComponent = round2(0.1 * toScale100(input.transcriptTotal30, RAW_SCALE_30));
  return {
    applicantType: 'DT2',
    thptComponent,
    transcriptComponent,
    scoreBeforeBonusAndPriority: round2(thptComponent + transcriptComponent),
  };
}

/** ĐHL3 — chỉ ĐGNL + Học bạ (0.90 ĐGNL + 0.10 Học bạ). Giữ tên hàm cũ `calculateUsshDt3Score` làm
 * alias để không phá vỡ chỗ gọi đã có (UsshPage.tsx, test cũ). */
export function calculateUsshDhl3Score(input: { dgnlRaw1200: number; transcriptTotal30: number }): UsshDhlResult {
  const dgnlComponent = round2(0.9 * toScale100(input.dgnlRaw1200, RAW_SCALE_1200));
  const transcriptComponent = round2(0.1 * toScale100(input.transcriptTotal30, RAW_SCALE_30));
  return {
    applicantType: 'DT3',
    dgnlComponent,
    transcriptComponent,
    scoreBeforeBonusAndPriority: round2(dgnlComponent + transcriptComponent),
  };
}

/** @deprecated Giữ lại cho tương thích ngược — dùng `calculateUsshDhl3Score`. Cùng công thức. */
export interface UsshDt3Input {
  dgnlRaw1200: number;
  transcriptTotal30: number;
}
export interface UsshDt3Result {
  scoreBeforeBonusAndPriority: number;
  dgnlComponent: number;
  transcriptComponent: number;
}
export function calculateUsshDt3Score(input: UsshDt3Input): UsshDt3Result {
  const result = calculateUsshDhl3Score(input);
  return {
    scoreBeforeBonusAndPriority: result.scoreBeforeBonusAndPriority,
    dgnlComponent: result.dgnlComponent ?? 0,
    transcriptComponent: result.transcriptComponent ?? 0,
  };
}

/**
 * Chọn đối tượng xét tuyển ĐÚNG THEO nguyên tắc "Max" của trường: ưu tiên ĐT1 nếu đủ 3 thành phần,
 * nếu không thì ĐT2 (THPT+HB) hoặc ĐT3 (ĐGNL+HB) tùy thành phần nào có sẵn. Không tự suy đoán khi
 * thiếu Học bạ (Học bạ bắt buộc ở cả 3 đối tượng theo PDF).
 */
export function calculateUsshBestDhl(input: UsshDhlInput): UsshDhlResult | null {
  if (input.transcriptTotal30 === undefined) return null;
  if (input.thptRawTotal30 !== undefined && input.dgnlRaw1200 !== undefined) {
    return calculateUsshDhl1Score({ thptRawTotal30: input.thptRawTotal30, dgnlRaw1200: input.dgnlRaw1200, transcriptTotal30: input.transcriptTotal30 });
  }
  if (input.thptRawTotal30 !== undefined) {
    return calculateUsshDhl2Score({ thptRawTotal30: input.thptRawTotal30, transcriptTotal30: input.transcriptTotal30 });
  }
  if (input.dgnlRaw1200 !== undefined) {
    return calculateUsshDhl3Score({ dgnlRaw1200: input.dgnlRaw1200, transcriptTotal30: input.transcriptTotal30 });
  }
  return null;
}
