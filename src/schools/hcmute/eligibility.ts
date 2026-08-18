export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Stable programId dùng ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật (mục 3.1 văn bản
 * 1691/ĐHCNKT-ĐT) thay vì ngưỡng chung 15/30 — 'luat' còn thêm điều kiện Toán/Ngữ văn riêng
 * (`checkHcmuteLawMathOrLiteratureCondition`). Không dùng chung set với `formulaGroups.ts` vì đây
 * là phân loại theo NGƯỠNG ĐẦU VÀO, không phải theo công thức Điểm học lực (SP công nghệ/Luật vẫn
 * dùng công thức nhóm 'standard'). */
export const HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS = new Set(['su-pham-tieng-anh', 'su-pham-cong-nghe', 'luat']);

const GENERAL_THRESHOLD_30 = 15.0;
const TEACHER_LAW_THRESHOLD_30 = 18.0;
const TEACHER_LAW_GRADUATION_SCORE_MIN = 8.5;
const LAW_MATH_OR_LITERATURE_MIN_10 = 6.0;

/**
 * Ngưỡng đầu vào chung (mục 3.1 văn bản 1691/ĐHCNKT-ĐT, `evidence.ts:hcmuteEligibilityEvidence`)
 * — áp dụng mọi ngành TRỪ Sư phạm tiếng Anh, Sư phạm công nghệ, Luật, và Kỹ thuật thiết kế vi
 * mạch (3 nhóm này có ngưỡng riêng, xem các hàm bên dưới; riêng vi mạch dùng percentile toàn
 * quốc — CHƯA implement được, xem `knowledgeGaps.ts`).
 */
export function checkHcmuteGeneralThreshold(totalScore30: number): EligibilityResult {
  return {
    pass: totalScore30 >= GENERAL_THRESHOLD_30,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (không nhân hệ số) ≥ ${GENERAL_THRESHOLD_30}/30`,
  };
}

/**
 * Ngưỡng riêng Sư phạm tiếng Anh/Sư phạm công nghệ/Luật (mục 3.1, điều kiện chung 3 nhóm này):
 * kết quả học tập lớp 12 xếp loại Tốt (giỏi trở lên) VÀ (tổng 3 môn TN THPT ≥18/30 HOẶC điểm xét
 * tốt nghiệp THPT ≥8,5). `grade12Excellent` không có trong `ApplicantProfile` hiện tại (chỉ có
 * điểm số, không có xếp loại học lực) — caller phải tự cung cấp giá trị này.
 */
export function checkHcmuteTeacherOrLawThreshold(input: {
  grade12Excellent: boolean;
  totalScore30?: number;
  graduationScore10?: number;
}): EligibilityResult {
  const scoreCondition = (input.totalScore30 !== undefined && input.totalScore30 >= TEACHER_LAW_THRESHOLD_30) ||
    (input.graduationScore10 !== undefined && input.graduationScore10 >= TEACHER_LAW_GRADUATION_SCORE_MIN);
  return {
    pass: input.grade12Excellent && scoreCondition,
    requiredText: `Học lực lớp 12 xếp loại Tốt (giỏi trở lên) và (tổng 3 môn TN THPT ≥ ${TEACHER_LAW_THRESHOLD_30}/30 hoặc điểm xét TN THPT ≥ ${TEACHER_LAW_GRADUATION_SCORE_MIN})`,
  };
}

/** Điều kiện riêng thêm cho ngành Luật: điểm Toán hoặc Ngữ văn trong tổ hợp xét tuyển ≥ 6,0/10. */
export function checkHcmuteLawMathOrLiteratureCondition(mathOrLiteratureScore10: number): EligibilityResult {
  return {
    pass: mathOrLiteratureScore10 >= LAW_MATH_OR_LITERATURE_MIN_10,
    requiredText: `Điểm bài thi TN THPT môn Toán hoặc Ngữ văn trong tổ hợp xét tuyển ≥ ${LAW_MATH_OR_LITERATURE_MIN_10}/10 (điều kiện riêng ngành Luật)`,
  };
}
