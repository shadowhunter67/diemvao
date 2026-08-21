/**
 * Ngưỡng đảm bảo chất lượng đầu vào HUIT 2026 theo NHÓM NGÀNH (enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `VluThresholdGroup`/`HubProgramGroup`). Chỉ 2 nhóm có nguồn:
 * Luật & Luật kinh tế / các ngành còn lại (danh mục ngành đầy đủ chưa import, xem knowledgeGaps).
 */
export type HuitThresholdGroup = 'standard' | 'law';

const GROUP_LABELS: Record<HuitThresholdGroup, string> = {
  standard: 'các ngành còn lại (ngoài Luật, Luật kinh tế)',
  law: 'Luật, Luật kinh tế',
};

/** Phương thức 1 (thi TN THPT 2026) — thang 30. */
const THPT_EXAM_THRESHOLD_30: Record<HuitThresholdGroup, number> = { standard: 16, law: 20 };

/** Phương thức 2 (xét kết quả học tập THPT — học bạ) — thang 30, phương pháp tính chưa nêu rõ
 * (xem `huit-transcript-methodology-unpublished`), người dùng tự cung cấp tổng điểm. */
const TRANSCRIPT_THRESHOLD_30: Record<HuitThresholdGroup, number> = { standard: 20, law: 20 };

export interface HuitEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Phương thức 1: Xét kết quả thi TN THPT 2026. `totalScore30` = tổng 3 môn tổ hợp, CHƯA cộng
 * điểm ưu tiên/điểm cộng. */
export function checkHuitThptExamThreshold(totalScore30: number, group: HuitThresholdGroup): HuitEligibilityResult {
  const min = THPT_EXAM_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT ≥ ${min} (thang 30, chưa cộng điểm ưu tiên/điểm cộng) — nhóm ngành ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức 2: Xét kết quả học tập THPT (học bạ). `totalScore30` do người dùng tự cung cấp —
 * nguồn không nêu rõ cách tính (theo năm hay theo học kỳ), xem `huit-transcript-methodology-unpublished`. */
export function checkHuitTranscriptThreshold(totalScore30: number, group: HuitThresholdGroup): HuitEligibilityResult {
  const min = TRANSCRIPT_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm học tập THPT theo tổ hợp xét tuyển ≥ ${min} (thang 30) — nhóm ngành ${GROUP_LABELS[group]}. Nguồn không nêu rõ tính theo năm lớp 12 hay theo học kỳ, cần thí sinh tự đối chiếu bảng điểm sàn chính thức.`,
  };
}

export { GROUP_LABELS as HUIT_THRESHOLD_GROUP_LABELS };
