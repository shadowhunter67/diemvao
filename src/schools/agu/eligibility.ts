import { AGU_LAW_EXTRA_CONDITION, AGU_PROGRAM_THRESHOLDS_2026, type AguProgramThreshold } from './data/thresholds';

export interface EligibilityResult {
  pass: boolean;
  /** Mô tả ngưỡng đã áp dụng, để UI trích dẫn thay vì tự diễn giải. */
  requiredText: string;
}

export function findAguProgramThreshold(programCode: string): AguProgramThreshold | undefined {
  return AGU_PROGRAM_THRESHOLDS_2026.find((program) => program.programCode === programCode);
}

/** Ngưỡng đăng ký xét tuyển THPT — điểm gốc, CHƯA cộng điểm cộng/điểm ưu tiên (đúng như "Lưu ý"
 * cuối bảng ngưỡng trong thông báo chính thức). */
export function checkAguThptThreshold(totalScore30: number, programCode: string): EligibilityResult {
  const program = findAguProgramThreshold(programCode);
  if (!program) {
    return { pass: false, requiredText: 'Không tìm thấy ngành trong danh sách ngưỡng AGU 2026.' };
  }
  return {
    pass: totalScore30 >= program.thptMin,
    requiredText: `THPT ≥ ${program.thptMin} (thang 30, chưa cộng điểm cộng/ưu tiên) cho ngành ${program.name}`,
  };
}

/** Ngưỡng ĐGNL — null nghĩa là thông báo không quy định ngưỡng ĐGNL riêng cho ngành này (vd Luật). */
export function checkAguDgnlThreshold(totalScore1200: number, programCode: string): EligibilityResult {
  const program = findAguProgramThreshold(programCode);
  if (!program) {
    return { pass: false, requiredText: 'Không tìm thấy ngành trong danh sách ngưỡng AGU 2026.' };
  }
  if (program.dgnlMin === null) {
    return { pass: false, requiredText: `Thông báo chính thức không quy định ngưỡng ĐGNL cho ngành ${program.name}.` };
  }
  return {
    pass: totalScore1200 >= program.dgnlMin,
    requiredText: `ĐGNL ≥ ${program.dgnlMin} (thang 1200) cho ngành ${program.name}`,
  };
}

/** Điều kiện riêng ngành Luật: tổng điểm xét tuyển (thang 100, đã gồm điểm cộng/ưu tiên) ≥ 60 VÀ
 * điểm Toán hoặc Ngữ văn trong tổ hợp xét tuyển ≥ 60% thang điểm tối đa. */
export function checkAguLawExtraCondition(
  totalScore100: number,
  mathOrLiteraturePercent: number
): EligibilityResult {
  const { minTotalScore100, minMathOrLiteraturePercent } = AGU_LAW_EXTRA_CONDITION;
  return {
    pass: totalScore100 >= minTotalScore100 && mathOrLiteraturePercent >= minMathOrLiteraturePercent,
    requiredText: `Tổng điểm xét tuyển ≥ ${minTotalScore100}/100 và điểm Toán hoặc Ngữ văn ≥ ${minMathOrLiteraturePercent}% thang điểm tối đa (ngành Luật)`,
  };
}
