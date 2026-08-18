/**
 * Điểm học lực HLy.1 — phương thức kết hợp (mã 500), công thức (1) "Điểm TN THPT độc lập" (Bảng
 * 4 văn bản 1691/ĐHCNKT-ĐT, `evidence.ts:hcmuteAcademicFormulaEvidence`). Đây là công thức DUY
 * NHẤT trong 3 công thức tính điểm học lực (HLy.1/HLy.2/HLy.3) không phụ thuộc hệ số tương quan
 * a/b — 2 hệ số này đã được công bố chính thức 07/7/2026 (a=0,8, b=0,8, xem
 * `HCMUTE_CORRELATION_A`/`HCMUTE_CORRELATION_B` bên dưới và `knowledgeGaps.ts`), HLy.2/HLy.3 giờ
 * tính được bằng các hàm bên dưới. Vì ĐHL thật (dùng công thức có tổng điểm cao nhất) có thể lớn
 * hơn HLy.1 nếu HLy.2/HLy.3 vượt trội, hàm này KHÔNG được coi là ĐHL cuối cùng khi đứng riêng —
 * dùng `calculateHcmuteHlyMax` để lấy HLy.max thật.
 *
 * Công thức: HLy.1 = [(MT1×2 + MT2 + MT3) / 4] × 3, thang 30. Môn chính (MT1, nhân hệ số 2) là
 * Toán, trừ tổ hợp xét ngành Tâm lý học giáo dục/Luật thì môn chính là Ngữ văn.
 *
 * Không làm tròn về 2 chữ số ở bước này — Phụ lục 4 (ví dụ minh họa chính thức) hiển thị HLy với
 * 3 chữ số thập phân (vd 26,025); chỉ Điểm xét tuyển (ĐXT) cuối cùng mới làm tròn 2 chữ số. Làm
 * tròn 3 chữ số chỉ để khử sai số dấu phẩy động, không phải quy tắc làm tròn nghiệp vụ.
 */
export interface HcmuteThptOnlyInput {
  mainSubjectScore: number;
  subject2Score: number;
  subject3Score: number;
}

export function calculateHcmuteAcademicScoreThptOnly(input: HcmuteThptOnlyInput): number {
  const { mainSubjectScore, subject2Score, subject3Score } = input;
  const raw = standardWeightedRaw(mainSubjectScore, subject2Score, subject3Score);
  return round3(raw);
}

/**
 * HLy.2/HLy.3 (kết hợp học bạ/ĐGNL) — Thông báo số 2092/TB-ĐHCNKT ngày 07/7/2026
 * (`evidence.ts:hcmuteCorrelationCoefficientsEvidence`/`hcmuteHly2Evidence`/`hcmuteHly3Evidence`):
 * hệ số tương quan a=0,8 (THPT/Học bạ) và b=0,8 (THPT/ĐGNL), áp dụng ở 3 nhóm ngành khác nhau
 * (`formulaGroups.ts`). Mỗi nhóm có số môn/hệ số môn chính/ước số ĐGNL riêng — KHÔNG dùng chung 1
 * hàm generic để tránh nhầm nhóm; mỗi hàm dưới đây khớp trực tiếp 1 dòng công thức trong văn bản.
 */
export const HCMUTE_CORRELATION_A = 0.8;
export const HCMUTE_CORRELATION_B = 0.8;

function round3(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 1000) / 1000;
}

function standardWeightedRaw(mainSubjectScore: number, subject2Score: number, subject3Score: number): number {
  return ((mainSubjectScore * 2 + subject2Score + subject3Score) / 4) * 3;
}

/** Nhóm 'standard' — mọi ngành trừ Ngôn ngữ Anh/SP tiếng Anh và Kiến trúc/Kiến trúc Nội thất/Thiết
 * kế đồ họa/Thiết kế thời trang. HLy.1 dùng `calculateHcmuteAcademicScoreThptOnly` ở trên. */
export function calculateHcmuteHly2Standard(input: {
  thpt: HcmuteThptOnlyInput;
  transcript: HcmuteThptOnlyInput;
  dxtt30: number;
}): number {
  const thptComponent = HCMUTE_CORRELATION_A * standardWeightedRaw(input.thpt.mainSubjectScore, input.thpt.subject2Score, input.thpt.subject3Score);
  const transcriptComponent =
    (1 - HCMUTE_CORRELATION_A) * standardWeightedRaw(input.transcript.mainSubjectScore, input.transcript.subject2Score, input.transcript.subject3Score);
  return round3(thptComponent + transcriptComponent + input.dxtt30);
}

export function calculateHcmuteHly3Standard(input: { thpt: HcmuteThptOnlyInput; dgnlRawScore: number }): number {
  const thptComponent = HCMUTE_CORRELATION_B * standardWeightedRaw(input.thpt.mainSubjectScore, input.thpt.subject2Score, input.thpt.subject3Score);
  return round3(thptComponent + (1 - HCMUTE_CORRELATION_B) * (input.dgnlRawScore / 40));
}

/** Nhóm 'english' — Ngôn ngữ Anh, Sư phạm tiếng Anh: 3 môn CỘNG TRỰC TIẾP, không nhân hệ số môn
 * chính, không có bước chia 4 nhân 3 (đã ở thang 30 do mỗi môn thang 10). */
export interface HcmuteEnglishThptInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

function englishRaw(input: HcmuteEnglishThptInput): number {
  return input.subject1Score + input.subject2Score + input.subject3Score;
}

export function calculateHcmuteHly1English(input: HcmuteEnglishThptInput): number {
  return round3(englishRaw(input));
}

export function calculateHcmuteHly2English(input: {
  thpt: HcmuteEnglishThptInput;
  transcript: HcmuteEnglishThptInput;
  dxtt30: number;
}): number {
  return round3(HCMUTE_CORRELATION_A * englishRaw(input.thpt) + (1 - HCMUTE_CORRELATION_A) * englishRaw(input.transcript) + input.dxtt30);
}

export function calculateHcmuteHly3English(input: { thpt: HcmuteEnglishThptInput; dgnlRawScore: number }): number {
  return round3(HCMUTE_CORRELATION_B * englishRaw(input.thpt) + (1 - HCMUTE_CORRELATION_B) * (input.dgnlRawScore / 40));
}

/** Nhóm 'design-architecture' — Kiến trúc/Kiến trúc Nội thất/Thiết kế đồ họa/Thiết kế thời trang:
 * chỉ 2 môn THPT (không nhân hệ số) CỘNG điểm thi Năng khiếu (M_NK, cộng trực tiếp mọi nhánh); ước
 * số ĐGNL riêng là 60 (khác 40 ở 2 nhóm còn lại). */
export interface HcmuteDesignThptInput {
  subject1Score: number;
  subject2Score: number;
}

function designRaw(input: HcmuteDesignThptInput): number {
  return input.subject1Score + input.subject2Score;
}

export function calculateHcmuteHly1Design(input: HcmuteDesignThptInput & { aptitudeScore: number }): number {
  return round3(designRaw(input) + input.aptitudeScore);
}

export function calculateHcmuteHly2Design(input: {
  thpt: HcmuteDesignThptInput;
  transcript: HcmuteDesignThptInput;
  dxtt30: number;
  aptitudeScore: number;
}): number {
  return round3(
    HCMUTE_CORRELATION_A * designRaw(input.thpt) + (1 - HCMUTE_CORRELATION_A) * designRaw(input.transcript) + input.dxtt30 + input.aptitudeScore
  );
}

export function calculateHcmuteHly3Design(input: { thpt: HcmuteDesignThptInput; dgnlRawScore: number; aptitudeScore: number }): number {
  return round3(HCMUTE_CORRELATION_B * designRaw(input.thpt) + (1 - HCMUTE_CORRELATION_B) * (input.dgnlRawScore / 60) + input.aptitudeScore);
}

export type HcmuteHlyBranchWinner = 'HLy.1' | 'HLy.2' | 'HLy.3';

/** HLy.max = max{HLy.1, HLy.2, HLy.3} — nhánh nào không tính được (không thuộc phạm vi thí sinh,
 * vd không khai học bạ/ĐGNL) truyền `undefined`, KHÔNG truyền 0 (0 là một điểm hợp lệ, có thể làm
 * sai kết quả max nếu 1 nhánh thật sự âm — không xảy ra trong domain này nhưng giữ đúng semantics
 * missing≠0 xuyên suốt codebase). */
export function calculateHcmuteHlyMax(branches: { hly1: number; hly2?: number; hly3?: number }): { value: number; winner: HcmuteHlyBranchWinner } {
  let winner: HcmuteHlyBranchWinner = 'HLy.1';
  let value = branches.hly1;
  if (branches.hly2 !== undefined && branches.hly2 > value) {
    value = branches.hly2;
    winner = 'HLy.2';
  }
  if (branches.hly3 !== undefined && branches.hly3 > value) {
    value = branches.hly3;
    winner = 'HLy.3';
  }
  return { value: round3(value), winner };
}
