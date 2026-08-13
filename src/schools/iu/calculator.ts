import { round2 } from '../../core/round2';

/**
 * Điểm học lực IU 2026 — Phương thức 2, thí sinh tốt nghiệp THPT 2026 (đối tượng 1.1/1.2 trong
 * nguồn). Nguồn `iu-method2-2026`: `Điểm học lực = k1*THPT + k2*ĐGNL + k3*Học bạ`, k1=40%,
 * k2=50%, k3=10%. Không có ĐGNL 2026 → thay bằng `Hs3*THPT` (Hs3=0.83), đúng công thức 1.2.
 */
export const IU_K1_THPT = 0.4;
export const IU_K2_DGNL = 0.5;
export const IU_K3_TRANSCRIPT = 0.1;
export const IU_HS3_THPT_TO_DGNL = 0.83;

export interface IuAcademicScoreInput {
  /** Tổng 3 môn tổ hợp thi tốt nghiệp THPT 2026, thang 30. */
  thptRawTotal30: number;
  /** Điểm ĐGNL ĐHQG-HCM 2026, thang 1200 — undefined nếu thí sinh không có/không dùng. */
  dgnlRaw1200?: number;
  /** Tổng ĐTB 3 năm (lớp 10,11,12) theo tổ hợp xét tuyển, thang 30 (mỗi môn lấy TB 3 năm). */
  transcriptTotal30: number;
}

export interface IuAcademicScoreResult {
  thptScaled100: number;
  dgnlScaled100?: number;
  transcriptScaled100: number;
  /** true khi dùng công thức thay thế Hs3*THPT (không có ĐGNL 2026) thay vì ĐGNL thật. */
  usedDgnlSubstitute: boolean;
  academicScore: number;
}

export function calculateIuAcademicScore(input: IuAcademicScoreInput): IuAcademicScoreResult {
  const thptScaled100 = round2((input.thptRawTotal30 / 30) * 100);
  const transcriptScaled100 = round2((input.transcriptTotal30 / 30) * 100);

  if (input.dgnlRaw1200 !== undefined) {
    const dgnlScaled100 = round2((input.dgnlRaw1200 / 1200) * 100);
    const academicScore = round2(IU_K1_THPT * thptScaled100 + IU_K2_DGNL * dgnlScaled100 + IU_K3_TRANSCRIPT * transcriptScaled100);
    return { thptScaled100, dgnlScaled100, transcriptScaled100, usedDgnlSubstitute: false, academicScore };
  }

  const dgnlSubstitute = round2(IU_HS3_THPT_TO_DGNL * thptScaled100);
  const academicScore = round2(IU_K1_THPT * thptScaled100 + IU_K2_DGNL * dgnlSubstitute + IU_K3_TRANSCRIPT * transcriptScaled100);
  return { thptScaled100, transcriptScaled100, usedDgnlSubstitute: true, academicScore };
}
