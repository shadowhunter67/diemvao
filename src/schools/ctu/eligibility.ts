/**
 * Ngưỡng đầu vào CTU 2026 (Đại học Cần Thơ, mã trường TCT). Nhóm ngành enum ổn định, không so
 * khớp substring tên ngành — cùng pattern `HubProgramGroup`/`VluThresholdGroup`. Danh mục ngành
 * đầy đủ → nhóm chưa import (`ctu-program-catalog-not-imported`); caller tự chọn group.
 *
 * - `standard`: mọi ngành trừ pháp luật, sư phạm, GDMN, GDTC.
 * - `law`: Luật, Luật Kinh tế (và các ngành pháp luật khác nếu có).
 * - `teacher`: các ngành sư phạm TRỪ Giáo dục Mầm non và Giáo dục Thể chất (2 ngành đó có công
 *   thức riêng, không model — `ctu-gdmn-gdtc-special-formula-not-modeled`).
 */
export type CtuProgramGroup = 'standard' | 'law' | 'teacher';

const GROUP_LABELS: Record<CtuProgramGroup, string> = {
  standard: 'các ngành khác (trừ pháp luật, sư phạm, Giáo dục Mầm non, Giáo dục Thể chất)',
  law: 'Luật, Luật Kinh tế (nhóm ngành pháp luật)',
  teacher: 'nhóm ngành đào tạo giáo viên (trừ Giáo dục Mầm non, Giáo dục Thể chất)',
};

export type CtuAcademicRank = 'trungbinh' | 'kha' | 'gioi' | 'tot';
/** Nguồn dùng từ "tốt" (không phải "giỏi") cho điều kiện thay thế — coi 'tot' và 'gioi' cùng đạt
 * ngưỡng "loại tốt" (thang đánh giá mới theo Thông tư 22/2021, "Tốt" thay cho "Giỏi" cũ). */
const RANK_MEETS_TOT: readonly CtuAcademicRank[] = ['gioi', 'tot'];

export const CTU_BASELINE_THRESHOLD_30 = 15;
export const CTU_SUBJECT_MIN_10 = 1;
export const CTU_ALT_PATH_TOTAL_THRESHOLD_30 = 18;
export const CTU_ALT_PATH_GRADUATION_THRESHOLD_10 = 8.5;

export interface CtuEligibilityResult {
  /** `undefined` = chưa đủ thông tin để kết luận. */
  pass: boolean | undefined;
  requiredText: string;
}

/** Điều kiện 1 (mục 2.1), áp dụng chung mọi ngành/phương thức: tổng 3 môn ≥15/30, không môn nào
 * ≤1,0. Đây là điều kiện CẦN — pass=true KHÔNG có nghĩa là "eligible", chỉ có nghĩa "chưa bị loại
 * bởi điều kiện 1"; điều kiện 2 (điểm sàn theo mã xét tuyển, mục 2.2.1) vẫn PDF-gated. */
export function checkCtuBaselineCondition(totalScore30: number, subjectScores: readonly number[]): CtuEligibilityResult {
  const noSubjectTooLow = subjectScores.every((score) => score > CTU_SUBJECT_MIN_10);
  return {
    pass: totalScore30 >= CTU_BASELINE_THRESHOLD_30 && noSubjectTooLow,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT 2026 ≥ ${CTU_BASELINE_THRESHOLD_30} (thang 30) VÀ không môn nào ≤ ${CTU_SUBJECT_MIN_10} điểm (điều kiện 1, áp dụng mọi ngành/phương thức) — đây là điều kiện CẦN, điểm sàn cụ thể theo mã xét tuyển (điều kiện 2) còn chờ đọc phụ lục PDF.`,
  };
}

export interface CtuAltPathInput {
  totalScore30?: number;
  academicRank12?: CtuAcademicRank;
  graduationScore10?: number;
}

/** Điều kiện thay thế (2.2.3(2) pháp luật / 2.2.4(2) sư phạm trừ GDTC), phương thức học bạ/V-SAT,
 * thí sinh tốt nghiệp THPT 2026: học lực lớp 12 loại tốt VÀ (tổng 3 môn thi TN THPT ≥18 HOẶC điểm
 * xét tốt nghiệp THPT ≥8,5). Nhóm `law` còn thêm điều kiện tổ hợp môn dùng điểm quy đổi (chưa có
 * bảng) — caller (`evaluate.ts`) tự hạ kết luận `eligible` xuống `unknown` cho nhóm `law`. */
export function checkCtuAltPathEligibility(input: CtuAltPathInput, group: CtuProgramGroup): CtuEligibilityResult {
  const label = GROUP_LABELS[group];
  if (input.academicRank12 === undefined) {
    return { pass: undefined, requiredText: `Cần xếp loại học lực cả năm lớp 12 để xét điều kiện thay thế (${label}).` };
  }
  const rankOk = RANK_MEETS_TOT.includes(input.academicRank12);
  if (!rankOk) {
    return { pass: false, requiredText: `Học lực lớp 12 chưa đạt loại Tốt/Giỏi — không đạt điều kiện thay thế (${label}).` };
  }
  const scorePass = input.totalScore30 !== undefined && input.totalScore30 >= CTU_ALT_PATH_TOTAL_THRESHOLD_30;
  const graduationPass = input.graduationScore10 !== undefined && input.graduationScore10 >= CTU_ALT_PATH_GRADUATION_THRESHOLD_10;
  if (input.totalScore30 === undefined && input.graduationScore10 === undefined) {
    return { pass: undefined, requiredText: `Cần tổng điểm 3 môn thi TN THPT 2026 hoặc điểm xét tốt nghiệp THPT để xét điều kiện thay thế (${label}).` };
  }
  return {
    pass: scorePass || graduationPass,
    requiredText: `Học lực lớp 12 loại Tốt/Giỏi VÀ (tổng 3 môn thi TN THPT 2026 ≥ ${CTU_ALT_PATH_TOTAL_THRESHOLD_30}/30 HOẶC điểm xét tốt nghiệp THPT ≥ ${CTU_ALT_PATH_GRADUATION_THRESHOLD_10}/10) — điều kiện thay thế (${label}), phương thức học bạ/V-SAT.`,
  };
}

export { GROUP_LABELS as CTU_PROGRAM_GROUP_LABELS };
