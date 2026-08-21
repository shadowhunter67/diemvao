/**
 * Ngưỡng điểm sàn HSU 2026 theo NHÓM NGÀNH (enum ổn định, không so khớp substring tên ngành —
 * cùng pattern `VluThresholdGroup`/`HuitThresholdGroup`). Danh mục ngành đầy đủ chưa import
 * (`hsu-program-catalog-not-imported`); caller tự chọn group.
 */
export type HsuThresholdGroup = 'standard' | 'law';

const GROUP_LABELS: Record<HsuThresholdGroup, string> = {
  standard: 'các ngành ngoài khối Pháp luật',
  law: 'khối ngành Pháp luật (Luật, Luật Hình sự và Tố tụng hình sự, Luật Kinh tế, Luật Kinh doanh số, Luật Thương mại quốc tế)',
};

/** Phương thức thi TN THPT 2026 — thang 30 (nguồn: `hsu-quality-threshold-2026` cho standard,
 * `hsu-law-threshold-2026` cho law). */
const THPT_EXAM_THRESHOLD_30: Record<HsuThresholdGroup, number> = { standard: 15, law: 20 };

/** Phương thức học bạ (tổ hợp 3 môn, 6 học kỳ) — thang 30. Chỉ có ngưỡng nhóm `standard`; nhóm
 * `law` chưa công bố (xem `hsu-law-non-thpt-threshold-unpublished`). */
const TRANSCRIPT_THRESHOLD_30: Partial<Record<HsuThresholdGroup, number>> = { standard: 18 };

export interface HsuEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Phương thức thi TN THPT 2026. `totalScore30` = tổng 3 môn tổ hợp, chưa cộng điểm ưu tiên/cộng. */
export function checkHsuThptExamThreshold(totalScore30: number, group: HsuThresholdGroup): HsuEligibilityResult {
  const min = THPT_EXAM_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT ≥ ${min} (thang 30, chưa cộng điểm ưu tiên/điểm cộng) — nhóm ngành ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức học bạ (tổ hợp 3 môn, trung bình 6 học kỳ). `totalScore30` do người dùng tự cung
 * cấp (xem `hsu-transcript-methodology-unpublished`). `undefined` nếu nhóm `law` (chưa công bố). */
export function checkHsuTranscriptThreshold(totalScore30: number, group: HsuThresholdGroup): HsuEligibilityResult | undefined {
  const min = TRANSCRIPT_THRESHOLD_30[group];
  if (min === undefined) return undefined;
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm học bạ theo tổ hợp 3 môn (trung bình 6 học kỳ) ≥ ${min} (thang 30) — nhóm ngành ${GROUP_LABELS[group]}.`,
  };
}

export { GROUP_LABELS as HSU_THRESHOLD_GROUP_LABELS };
