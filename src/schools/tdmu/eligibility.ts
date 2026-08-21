/**
 * Ngưỡng đầu vào TDMU 2026 (Trường Đại học Thủ Dầu Một). Nhóm ngành enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `HubProgramGroup`/`CtuProgramGroup`. Danh mục ngành đầy đủ →
 * nhóm chưa import (`tdmu-program-catalog-not-imported`); caller tự chọn group.
 *
 * - `standard`: 45 ngành khác Luật và nhóm sư phạm.
 * - `law`: ngành Luật (7380101).
 * - `teacher`: 4 ngành sư phạm (Giáo dục Tiểu học, Giáo dục Mầm non, Sư phạm Ngữ văn, Sư phạm
 *   Lịch sử, Sư phạm Toán) — CHỈ dùng phương thức thi TN THPT theo nguồn, không có ngưỡng học
 *   bạ/ĐGNL công bố (2 phương thức đó evaluator trả `unknown` cho nhóm này).
 */
export type TdmuProgramGroup = 'standard' | 'law' | 'teacher';

const GROUP_LABELS: Record<TdmuProgramGroup, string> = {
  standard: '45 ngành khác (trừ Luật và nhóm sư phạm)',
  law: 'ngành Luật (7380101)',
  teacher: 'nhóm ngành sư phạm (Giáo dục Tiểu học, Giáo dục Mầm non, Sư phạm Ngữ văn, Sư phạm Lịch sử, Sư phạm Toán)',
};

export const TDMU_THPT_EXAM_THRESHOLD_30: Record<TdmuProgramGroup, number> = { standard: 15, law: 20, teacher: 20 };
export const TDMU_TRANSCRIPT_THRESHOLD_30: Record<'standard' | 'law', number> = { standard: 16.5, law: 21.5 };
export const TDMU_VACT_THRESHOLD_1200: Record<'standard' | 'law', number> = { standard: 600, law: 750 };

export interface TdmuEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Phương thức thi TN THPT 2026 — điểm thô, không cần quy đổi, áp dụng cả 3 nhóm. */
export function checkTdmuThptExamThreshold(totalScore30: number, group: TdmuProgramGroup): TdmuEligibilityResult {
  const threshold = TDMU_THPT_EXAM_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= threshold,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển ≥ ${threshold} (thang 30) — áp dụng ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức học bạ — điểm trung bình 3 môn tổ hợp qua 6 học kỳ (lớp 10/11/12), thang 30. Chỉ
 * áp dụng nhóm `standard`/`law` (nhóm `teacher` chỉ dùng phương thức thi TN THPT theo nguồn). */
export function checkTdmuTranscriptThreshold(totalScore30: number, group: 'standard' | 'law'): TdmuEligibilityResult {
  const threshold = TDMU_TRANSCRIPT_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= threshold,
    requiredText: `Điểm trung bình 3 môn tổ hợp xét tuyển (cả năm lớp 10, 11 và 12) ≥ ${threshold} (thang 30) — áp dụng ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức ĐGNL ĐHQG-HCM — điểm thô thang 1200, khớp trực tiếp `ApplicantProfile.exams.vact.total`.
 * Chỉ áp dụng nhóm `standard`/`law`. */
export function checkTdmuVactThreshold(vactTotal1200: number, group: 'standard' | 'law'): TdmuEligibilityResult {
  const threshold = TDMU_VACT_THRESHOLD_1200[group];
  return {
    pass: vactTotal1200 >= threshold,
    requiredText: `Điểm thi ĐGNL ĐHQG-HCM ≥ ${threshold} (thang 1200) — áp dụng ${GROUP_LABELS[group]}.`,
  };
}

export { GROUP_LABELS as TDMU_PROGRAM_GROUP_LABELS };
