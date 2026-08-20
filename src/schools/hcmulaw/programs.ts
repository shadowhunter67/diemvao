import type { SubjectId } from '../../core/subjects';

/**
 * Mã ngành chính thức (Thông báo ngưỡng đầu vào 2026, mục 2.1 — cơ sở chính LPS, Tp.HCM) dùng làm
 * stable ID — KHÔNG dùng tên hiển thị để dispatch business rule (xem
 * docs/data-maintainer-guide.md mục "Nhập bảng lớn"). Phân hiệu Quảng Trị (LPQ, chỉ tuyển ngành
 * Luật) KHÔNG model riêng trong batch này — xem `knowledgeGaps.ts:hcmulaw-quang-tri-campus-not-modeled`.
 */
export type HcmulawProgramId =
  | '7220201' // Ngôn ngữ Anh (chuyên ngành tiếng Anh pháp lý)
  | '7220204' // Ngôn ngữ Trung Quốc
  | '7380101' // Luật
  | '7380109' // Luật thương mại quốc tế
  | '7340102' // Quản trị - Luật
  | '7340101' // Quản trị kinh doanh
  | '7340120' // Kinh doanh quốc tế
  | '7340201' // Tài chính - Ngân hàng
  | '7340205' // Công nghệ tài chính
  | '7310109' // Kinh tế số
  | '7340122'; // Thương mại điện tử

export interface HcmulawCombination {
  /** Mã tổ hợp chính thức của Bộ GD-ĐT dùng khi đăng ký (chỉ giữ biến thể dùng Tiếng Anh làm ngoại
   * ngữ — xem `knowledgeGaps.ts:hcmulaw-foreign-language-combinations-not-modeled` cho biến thể
   * Pháp/Nhật/Trung chưa model). */
  code: string;
  subjects: readonly [SubjectId, SubjectId, SubjectId];
}

export interface HcmulawProgram {
  id: HcmulawProgramId;
  name: string;
  /** Ngưỡng đầu vào (thang 30) — 1 giá trị DUY NHẤT áp dụng cho MỌI tổ hợp của ngành này (xác nhận
   * từ bảng gốc, xem `sources.ts:hcmulaw-quality-threshold-2026`). Với ngành Luật/Luật thương mại
   * quốc tế/Quản trị - Luật, ngưỡng này SO VỚI điểm thi + ưu tiên (không tính điểm cộng — nhưng
   * Phương thức 5 vốn không có điểm cộng nên không khác biệt trong phạm vi module này, xem
   * `evaluate.ts`). */
  threshold30: number;
  combinations: readonly HcmulawCombination[];
}

const ENGLISH_LAW_GROUP_COMBINATIONS: readonly HcmulawCombination[] = [
  { code: 'D01', subjects: ['literature', 'english', 'math'] },
  { code: 'X78', subjects: ['literature', 'english', 'civic-economic-law'] },
  { code: 'D11', subjects: ['literature', 'english', 'physics'] },
  { code: 'D12', subjects: ['literature', 'english', 'chemistry'] },
  { code: 'D14', subjects: ['literature', 'english', 'history'] },
  { code: 'D15', subjects: ['literature', 'english', 'geography'] },
  { code: 'X25', subjects: ['math', 'english', 'civic-economic-law'] },
  { code: 'A01', subjects: ['math', 'english', 'physics'] },
  { code: 'D07', subjects: ['math', 'english', 'chemistry'] },
  { code: 'D09', subjects: ['math', 'english', 'history'] },
  { code: 'D10', subjects: ['math', 'english', 'geography'] },
  { code: 'C00', subjects: ['literature', 'history', 'geography'] },
];

const ENGLISH_LANGUAGE_TRACK_COMBINATIONS: readonly HcmulawCombination[] = [
  { code: 'D01', subjects: ['literature', 'english', 'math'] },
  { code: 'D14', subjects: ['literature', 'english', 'history'] },
  { code: 'X78', subjects: ['literature', 'english', 'civic-economic-law'] },
  { code: 'D15', subjects: ['literature', 'english', 'geography'] },
  { code: 'D09', subjects: ['math', 'english', 'history'] },
  { code: 'X25', subjects: ['math', 'english', 'civic-economic-law'] },
  { code: 'D10', subjects: ['math', 'english', 'geography'] },
];

const INTERNATIONAL_TRADE_LAW_COMBINATIONS: readonly HcmulawCombination[] = [
  { code: 'D11', subjects: ['literature', 'english', 'physics'] },
  { code: 'D01', subjects: ['literature', 'english', 'math'] },
  { code: 'X78', subjects: ['literature', 'english', 'civic-economic-law'] },
  { code: 'D12', subjects: ['literature', 'english', 'chemistry'] },
  { code: 'A01', subjects: ['math', 'english', 'physics'] },
  { code: 'X25', subjects: ['math', 'english', 'civic-economic-law'] },
  { code: 'D07', subjects: ['math', 'english', 'chemistry'] },
];

const BUSINESS_LAW_COMBINATIONS: readonly HcmulawCombination[] = [
  { code: 'A01', subjects: ['math', 'english', 'physics'] },
  { code: 'D07', subjects: ['math', 'english', 'chemistry'] },
  { code: 'D01', subjects: ['math', 'english', 'literature'] },
  { code: 'X25', subjects: ['math', 'english', 'civic-economic-law'] },
  { code: 'X26', subjects: ['math', 'english', 'informatics'] },
  { code: 'D11', subjects: ['literature', 'english', 'physics'] },
  { code: 'D12', subjects: ['literature', 'english', 'chemistry'] },
  { code: 'X78', subjects: ['literature', 'english', 'civic-economic-law'] },
  { code: 'X79', subjects: ['literature', 'english', 'informatics'] },
  { code: 'A00', subjects: ['math', 'physics', 'chemistry'] },
];

const BUSINESS_COMBINATIONS: readonly HcmulawCombination[] = [
  { code: 'A01', subjects: ['math', 'english', 'physics'] },
  { code: 'D07', subjects: ['math', 'english', 'chemistry'] },
  { code: 'D01', subjects: ['math', 'english', 'literature'] },
  { code: 'X25', subjects: ['math', 'english', 'civic-economic-law'] },
  { code: 'X26', subjects: ['math', 'english', 'informatics'] },
  { code: 'A00', subjects: ['math', 'physics', 'chemistry'] },
];

/**
 * 11 ngành trụ sở chính (LPS) — threshold + combinations verified 2026-08-20 (xem `sources.ts`).
 * Combinations chỉ giữ biến thể Tiếng Anh (7/12 dòng gốc của ngành Luật có biến thể Pháp/Nhật/Trung
 * dùng CHUNG 1 mã tổ hợp cho nhiều ngoại ngữ khác nhau — module này chỉ hỗ trợ nhánh Tiếng Anh, xem
 * `knowledgeGaps.ts`).
 */
export const hcmulawPrograms: readonly HcmulawProgram[] = [
  { id: '7220201', name: 'Ngôn ngữ Anh (chuyên ngành tiếng Anh pháp lý)', threshold30: 17, combinations: ENGLISH_LANGUAGE_TRACK_COMBINATIONS },
  { id: '7220204', name: 'Ngôn ngữ Trung Quốc', threshold30: 16, combinations: ENGLISH_LANGUAGE_TRACK_COMBINATIONS },
  { id: '7380101', name: 'Luật', threshold30: 20, combinations: ENGLISH_LAW_GROUP_COMBINATIONS },
  { id: '7380109', name: 'Luật thương mại quốc tế', threshold30: 20, combinations: INTERNATIONAL_TRADE_LAW_COMBINATIONS },
  { id: '7340102', name: 'Quản trị - Luật', threshold30: 20, combinations: BUSINESS_LAW_COMBINATIONS },
  { id: '7340101', name: 'Quản trị kinh doanh', threshold30: 17, combinations: BUSINESS_COMBINATIONS },
  { id: '7340120', name: 'Kinh doanh quốc tế', threshold30: 17, combinations: BUSINESS_COMBINATIONS },
  { id: '7340201', name: 'Tài chính - Ngân hàng', threshold30: 17, combinations: BUSINESS_COMBINATIONS },
  { id: '7340205', name: 'Công nghệ tài chính', threshold30: 16, combinations: BUSINESS_COMBINATIONS },
  { id: '7310109', name: 'Kinh tế số', threshold30: 16, combinations: BUSINESS_COMBINATIONS },
  { id: '7340122', name: 'Thương mại điện tử', threshold30: 16, combinations: BUSINESS_COMBINATIONS },
];

export function findHcmulawProgram(programId: string | undefined): HcmulawProgram | undefined {
  return hcmulawPrograms.find((program) => program.id === programId);
}

export function findHcmulawCombination(program: HcmulawProgram, code: string | undefined): HcmulawCombination | undefined {
  return program.combinations.find((combination) => combination.code === code);
}

/** Ngành thuộc nhóm "Luật" (Luật/Luật thương mại quốc tế/Quản trị - Luật) — ngưỡng đầu vào KHÔNG
 * tính điểm cộng (điểm cộng thang 30 = 0 với Phương thức 5, xem `evaluate.ts`, nên trong phạm vi
 * module này 2 nhóm ngành không khác biệt về công thức, chỉ khác biệt ý nghĩa của ngưỡng). */
export const HCMULAW_LAW_PROGRAM_IDS: readonly HcmulawProgramId[] = ['7380101', '7380109', '7340102'];
