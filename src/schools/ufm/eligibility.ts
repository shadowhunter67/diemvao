export interface UfmEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Nhóm ngành theo ngưỡng đảm bảo chất lượng — stable metadata do caller cung cấp trực tiếp (KHÔNG
 * suy từ tên hiển thị ngành, xem `knowledgeGaps.ts:ufm-program-catalog-not-imported`). */
export type UfmThresholdGroup = 'standard' | 'law-economics';

const THPT_THRESHOLD_30: Record<UfmThresholdGroup, number> = { standard: 16, 'law-economics': 20 };
const DGNL_THRESHOLD_1200: Record<UfmThresholdGroup, number> = { standard: 657, 'law-economics': 720 };
const VSAT_THRESHOLD: Record<UfmThresholdGroup, number> = { standard: 241, 'law-economics': 270 };
const HOCBA_THRESHOLD_30: Record<UfmThresholdGroup, number> = { standard: 18, 'law-economics': 18 };

const LAW_ECONOMICS_MATH_MIN_RAW = 6;
const LAW_ECONOMICS_SUBJECT_FLOOR = 1;

/** Xét kết quả thi TN THPT 2026, thang 30 — "ngành thường: tổng điểm 3 môn từ 16 điểm trở lên";
 * "Luật kinh tế: tổng điểm 3 môn từ 20 điểm trở lên. Môn Toán: tối thiểu 6 điểm (trước hệ số).
 * Không môn nào dưới 1 điểm." (10/7/2026). `mathRawScore`/`subjectRawScores` chỉ cần khi
 * `group === 'law-economics'` — bỏ trống thì 2 điều kiện phụ coi như CHƯA xác nhận (fail an toàn,
 * không suy đoán đạt). */
export function checkUfmThptThreshold(input: { total30: number; group: UfmThresholdGroup; mathRawScore?: number; subjectRawScores?: number[] }): UfmEligibilityResult {
  const threshold = THPT_THRESHOLD_30[input.group];
  const totalPass = input.total30 >= threshold;

  if (input.group === 'standard') {
    return { pass: totalPass, requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển ≥ ${threshold}/30 (chương trình Chuẩn)` };
  }

  const mathOk = input.mathRawScore !== undefined && input.mathRawScore >= LAW_ECONOMICS_MATH_MIN_RAW;
  const floorOk = input.subjectRawScores !== undefined && input.subjectRawScores.every((s) => s >= LAW_ECONOMICS_SUBJECT_FLOOR);
  return {
    pass: totalPass && mathOk && floorOk,
    requiredText: `Ngành Luật kinh tế: tổng điểm 3 môn ≥ ${threshold}/30 VÀ điểm Toán ≥ ${LAW_ECONOMICS_MATH_MIN_RAW} (trước hệ số) VÀ không môn nào < ${LAW_ECONOMICS_SUBJECT_FLOOR} điểm`,
  };
}

/** Xét kết quả ĐGNL ĐHQG TP.HCM 2026, thang 1200 — "ngành thường: 657/1.200"; "Luật kinh tế:
 * 720/1.200" (10/7/2026). */
export function checkUfmDgnlThreshold(dgnlScore1200: number, group: UfmThresholdGroup): UfmEligibilityResult {
  const threshold = DGNL_THRESHOLD_1200[group];
  return {
    pass: dgnlScore1200 >= threshold,
    requiredText: `Điểm thi ĐGNL ĐHQG TP.HCM 2026 ≥ ${threshold}/1200 (nhóm: ${group})`,
  };
}

/** Xét V-SAT 2026 — "ngành thường: 241 điểm trở lên"; "Luật kinh tế: 270 điểm" (10/7/2026). Thang
 * điểm tối đa: tổng 3 môn, mỗi môn tối đa 150, tổng tối đa 450 (verified 2026-08-19). Hàm này chỉ so
 * sánh trực tiếp điểm thô với ngưỡng công bố — "Điểm xét tuyển" chính thức (dùng để xếp hạng) là kết
 * quả quy đổi qua `conversionTable.ts`, không phải điểm thô này. */
export function checkUfmVsatThreshold(vsatScore: number, group: UfmThresholdGroup): UfmEligibilityResult {
  const threshold = VSAT_THRESHOLD[group];
  return {
    pass: vsatScore >= threshold,
    requiredText: `Điểm bài thi V-SAT 2026 ≥ ${threshold} (nhóm: ${group}, theo thang điểm chính thức V-SAT)`,
  };
}

/** Xét học bạ THPT — "ngành thường: 18 điểm"; "Luật kinh tế: 18 điểm" (giống nhau, không có tier
 * riêng cho phương thức này). */
export function checkUfmHocbaThreshold(transcriptTotal30: number, group: UfmThresholdGroup): UfmEligibilityResult {
  const threshold = HOCBA_THRESHOLD_30[group];
  return {
    pass: transcriptTotal30 >= threshold,
    requiredText: `Tổng điểm trung bình theo tổ hợp xét tuyển ≥ ${threshold}/30 (nhóm: ${group})`,
  };
}
