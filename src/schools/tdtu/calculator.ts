/**
 * Điểm năng lực — PT1, Đối tượng 1.1 (học sinh lớp 12 tốt nghiệp THPT 2026), thang 100 —
 * `sources.ts:tdtu-admission-plan-2026`: "Điểm năng lực = Điểm năng lực THPT×75% + Điểm quá trình
 * THPT×25%"; "Điểm năng lực THPT = (Điểm môn 1 + Điểm môn 2 + Điểm môn 3×2)×2.5"; "Điểm quá trình
 * THPT = (Điểm TB 6HK môn 1 + Điểm TB 6HK môn 2 + Điểm TB 6HK môn 3×2)×2.5". "Môn 3" = môn chính
 * (đánh dấu ×2 trong tổ hợp, vị trí hiển thị trong tổ hợp không cố định — vd "Toán*2, Ngữ văn,
 * Tiếng Anh" hay "Ngữ văn*2, Vật lí, Tiếng Anh") — modeled ở đây là `mainSubjectScore`, KHÔNG phụ
 * thuộc thứ tự hiển thị tổ hợp.
 */
export interface TdtuThreeSubjectInput {
  mainSubjectScore: number;
  subject2Score: number;
  subject3Score: number;
}

function round2(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

function competencyComponentRaw(input: TdtuThreeSubjectInput): number {
  return (input.subject2Score + input.subject3Score + input.mainSubjectScore * 2) * 2.5;
}

export function calculateTdtuThptCompetency(input: TdtuThreeSubjectInput): number {
  return round2(competencyComponentRaw(input));
}

export function calculateTdtuProcessCompetency(input: TdtuThreeSubjectInput): number {
  return round2(competencyComponentRaw(input));
}

/** Điểm năng lực (Đối tượng 1.1) = Điểm năng lực THPT×0,75 + Điểm quá trình THPT×0,25, thang 100. */
export function calculateTdtuCompetencyObject11(input: { thpt: TdtuThreeSubjectInput; transcript: TdtuThreeSubjectInput }): number {
  const thptCompetency = competencyComponentRaw(input.thpt);
  const processCompetency = competencyComponentRaw(input.transcript);
  return round2(thptCompetency * 0.75 + processCompetency * 0.25);
}

/**
 * Điểm xét tuyển PT1 (thang 100) = Điểm năng lực + Điểm cộng + Điểm ưu tiên, làm tròn 2 chữ số,
 * kẹp tối đa 100 (`sources.ts:tdtu-admission-plan-2026`).
 */
export function calculateTdtuPt1FinalScore(input: { competency100: number; bonus100: number; priority100: number }): number {
  return round2(Math.min(100, input.competency100 + input.bonus100 + input.priority100));
}

/**
 * Điểm xét tuyển PT2/ĐGNL (thang 1200) = Tổng điểm ĐGNL + Điểm ưu tiên, làm tròn 2 chữ số
 * (`sources.ts:tdtu-admission-plan-2026`) — KHÔNG có thành phần Điểm cộng (chỉ PT1 mới có).
 */
export function calculateTdtuPt2FinalScore(input: { dgnlScore1200: number; priority1200: number }): number {
  return round2(input.dgnlScore1200 + input.priority1200);
}
