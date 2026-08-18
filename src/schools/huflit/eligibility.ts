export interface HuflitEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Ngành có ngưỡng riêng (cao hơn) theo Thông báo 09/7/2026 (`sources.ts:huflit-threshold-announcement-2026`)
 * — chỉ 2/23 ngành, dùng stable id thay vì display name. */
export const HUFLIT_LAW_PROGRAM_IDS = new Set(['luat', 'luat-kinh-te']);

const PT1_GENERAL_THRESHOLD_30 = 15.0;
const PT1_LAW_THRESHOLD_30 = 20.0;
const PT2_GENERAL_THRESHOLD_30 = 18.0;
const PT2_LAW_THRESHOLD_30 = 21.0;
const PT2_THPT_PREREQUISITE_30 = 15.0;
const PT3_GENERAL_THRESHOLD_1200 = 550;
const PT3_LAW_THRESHOLD_1200 = 720;

/** PT1 (thi THPT), thang 30 — "Điểm xét tuyển là tổng điểm của 3 môn thi tốt nghiệp THPT theo tổ
 * hợp 3 môn: 15 điểm. Riêng với ngành Luật và Luật kinh tế là 20 điểm." (09/7/2026). */
export function checkHuflitPt1Threshold(totalScore30: number, isLawProgram: boolean): HuflitEligibilityResult {
  const threshold = isLawProgram ? PT1_LAW_THRESHOLD_30 : PT1_GENERAL_THRESHOLD_30;
  return {
    pass: totalScore30 >= threshold,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (không nhân hệ số) ≥ ${threshold}/30${isLawProgram ? ' (ngành Luật/Luật kinh tế)' : ''}`,
  };
}

/** PT2 (học bạ), thang 30 — cần CẢ 2 điều kiện: (1) điểm thi TN THPT ≥15/30 (điều kiện PT1-kiểu,
 * theo trang 02/4/2026), (2) tổng TB 3 môn 3 năm ≥18/30 (21/30 với Luật/Luật kinh tế, theo trang
 * 09/7/2026). */
export function checkHuflitPt2Threshold(input: { thptTotal30: number; transcriptTotal30: number; isLawProgram: boolean }): HuflitEligibilityResult {
  const transcriptThreshold = input.isLawProgram ? PT2_LAW_THRESHOLD_30 : PT2_GENERAL_THRESHOLD_30;
  const thptOk = input.thptTotal30 >= PT2_THPT_PREREQUISITE_30;
  const transcriptOk = input.transcriptTotal30 >= transcriptThreshold;
  return {
    pass: thptOk && transcriptOk,
    requiredText: `Điểm thi TN THPT 2026 (tổ hợp dùng xét học bạ, hoặc Văn-Toán+1 môn) ≥ ${PT2_THPT_PREREQUISITE_30}/30 VÀ tổng điểm TB 3 môn (lớp 10/11/12) ≥ ${transcriptThreshold}/30${input.isLawProgram ? ' (ngành Luật/Luật kinh tế)' : ''}`,
  };
}

/** PT3 (ĐGNL ĐHQG-HCM), thang 1200 — 550 điểm (720 với Luật/Luật kinh tế). */
export function checkHuflitPt3Threshold(dgnlScore1200: number, isLawProgram: boolean): HuflitEligibilityResult {
  const threshold = isLawProgram ? PT3_LAW_THRESHOLD_1200 : PT3_GENERAL_THRESHOLD_1200;
  return {
    pass: dgnlScore1200 >= threshold,
    requiredText: `Điểm thi ĐGNL ĐHQG-HCM 2026 ≥ ${threshold}/1200${isLawProgram ? ' (ngành Luật/Luật kinh tế)' : ''}`,
  };
}
