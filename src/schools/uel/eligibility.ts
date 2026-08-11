import { UEL_THPT_QUY_DOI_THRESHOLD } from './data/thresholds';

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

/**
 * `thptRawTotal30`: tổng điểm 3 môn thi tốt nghiệp THPT theo tổ hợp xét tuyển, thang 30 (chưa
 * quy đổi). Hàm tự quy đổi sang thang 100 (×100/30, đúng công thức UEL công bố) rồi so ngưỡng.
 */
export function checkThptThreshold(thptRawTotal30: number): EligibilityResult {
  const quyDoi = (thptRawTotal30 * 100) / 30;
  return {
    pass: quyDoi >= UEL_THPT_QUY_DOI_THRESHOLD,
    requiredText: `Tổng 3 môn THPT theo tổ hợp (thang 30) quy đổi thang 100 ≥ ${UEL_THPT_QUY_DOI_THRESHOLD}`,
  };
}
