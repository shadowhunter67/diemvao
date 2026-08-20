import { findUmpProgram } from './programs';

export interface UmpEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Xét kết quả thi TN THPT 2026 — "tổng điểm 03 môn thi kỳ thi tốt nghiệp THPT... theo tổ hợp xét
 * tuyển... phải bằng hoặc trên mức điểm tối thiểu ngưỡng đảm bảo chất lượng đầu vào" (Thông báo
 * 2415/TB-ĐHYD mục 6.2.1), ngưỡng cụ thể theo ngành từ Thông báo 2983/TB-ĐHYD — ÁP DỤNG CHUNG cho
 * mọi tổ hợp của ngành đó (không phân biệt tổ hợp, không tính điểm cộng — dùng tổng thô 3 môn). */
export function checkUmpThreshold(programId: string | undefined, total30: number): UmpEligibilityResult {
  const program = findUmpProgram(programId);
  if (!program) {
    return { pass: false, requiredText: 'Chưa xác định ngành xét tuyển — không tra được ngưỡng đầu vào.' };
  }
  return {
    pass: total30 >= program.threshold30,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (không tính điểm cộng) ≥ ${program.threshold30}/30 (ngành: ${program.name})`,
  };
}
