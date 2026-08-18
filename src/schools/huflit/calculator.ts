/**
 * PT1 — "Điểm xét tuyển là tổng điểm của 3 môn thi tốt nghiệp THPT theo tổ hợp 3 môn" — tổng thô,
 * KHÔNG nhân hệ số môn nào (`sources.ts:huflit-admission-plan-2026`).
 */
export interface HuflitThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

function round2(raw: number): number {
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

export function calculateHuflitPt1RawScore(input: HuflitThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** PT2 — "tổng điểm trung bình 3 môn theo tổ hợp xét tuyển của 3 năm học (lớp 10/11/12)" — cùng
 * dạng tổng thô, áp cho điểm TB (không phải điểm thi). */
export function calculateHuflitPt2RawScore(input: HuflitThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** Điểm xét tuyển cuối (PT1/PT2, thang 30) = Điểm học lực (raw) + Điểm cộng (bonus, có thể 0 nếu
 * không có thành tích) + Điểm ưu tiên — kẹp 30. */
export function calculateHuflitFinalScore30(input: { raw30: number; bonus30: number; priority30: number }): number {
  return round2(Math.min(30, input.raw30 + input.bonus30 + input.priority30));
}

/** Điểm xét tuyển PT3/ĐGNL (thang 1200) = Tổng điểm ĐGNL + Điểm ưu tiên. */
export function calculateHuflitPt3FinalScore(input: { dgnlScore1200: number; priority1200: number }): number {
  return round2(input.dgnlScore1200 + input.priority1200);
}
