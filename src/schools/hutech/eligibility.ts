export interface HutechEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Nhóm ngành theo ngưỡng đảm bảo chất lượng — stable metadata do caller cung cấp trực tiếp (KHÔNG
 * suy từ tên hiển thị ngành, xem `knowledgeGaps.ts:hutech-program-catalog-not-imported`). */
export type HutechThresholdGroup = 'medicine' | 'pharmacy' | 'pharmacy-law' | 'nursing-lab' | 'standard';

const THPT_THRESHOLD_30: Record<HutechThresholdGroup, number> = {
  medicine: 22,
  pharmacy: 20,
  'pharmacy-law': 20,
  'nursing-lab': 18,
  standard: 15,
};

const DGNL_THRESHOLD_1200: Record<HutechThresholdGroup, number> = {
  medicine: 650,
  pharmacy: 570,
  'pharmacy-law': 570,
  'nursing-lab': 550,
  standard: 550,
};

/** Xét kết quả thi TN THPT 2026, thang 30 — "Y khoa: 22 điểm; Dược, Luật, Luật kinh tế: 20 điểm;
 * Điều dưỡng, Kỹ thuật xét nghiệm y học: 18 điểm; Các ngành còn lại: 15 điểm" (04/7/2026). */
export function checkHutechThptThreshold(totalScore30: number, group: HutechThresholdGroup): HutechEligibilityResult {
  const threshold = THPT_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= threshold,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (không nhân hệ số) ≥ ${threshold}/30 (nhóm ngành: ${group})`,
  };
}

/** Xét kết quả ĐGNL ĐHQG TP.HCM 2026, thang 1200 — "Y: 650 điểm; Dược: 570 điểm; Các ngành còn lại:
 * 550 điểm" (04/7/2026). Không có tier riêng cho Điều dưỡng/KTXNYH/Luật trong nguồn — mặc định
 * `standard` (570 dùng chung với `pharmacy` cho an toàn vì nguồn không tách riêng). */
export function checkHutechDgnlThreshold(dgnlScore1200: number, group: HutechThresholdGroup): HutechEligibilityResult {
  const threshold = DGNL_THRESHOLD_1200[group];
  return {
    pass: dgnlScore1200 >= threshold,
    requiredText: `Điểm thi ĐGNL ĐHQG TP.HCM 2026 ≥ ${threshold}/1200 (nhóm ngành: ${group})`,
  };
}

/** Xét kết quả V-SAT 2026 — "Y khoa, Dược: 250 điểm; Các ngành còn lại: 225 điểm" (04/7/2026).
 * Thang điểm tối đa bài thi V-SAT CHƯA xác định rõ ràng (xem
 * `knowledgeGaps.ts:hutech-vsat-scale-conflicting`) — hàm này chỉ so sánh trực tiếp điểm thô người
 * dùng nhập với ngưỡng công bố, KHÔNG lắp ráp thành điểm xét tuyển cuối. */
export function checkHutechVsatThreshold(vsatScore: number, group: HutechThresholdGroup): HutechEligibilityResult {
  const threshold = group === 'medicine' || group === 'pharmacy' || group === 'pharmacy-law' ? 250 : 225;
  return {
    pass: vsatScore >= threshold,
    requiredText: `Điểm bài thi V-SAT 2026 ≥ ${threshold} (nhóm ngành: ${group}, theo thang điểm chính thức V-SAT)`,
  };
}

/** Xét học bạ THPT 6 học kỳ — "Y khoa: 23 điểm; Dược: 21 điểm; Điều dưỡng, Kỹ thuật xét nghiệm y
 * học: 19 điểm; Các ngành còn lại: 18 điểm" (04/7/2026). Xuất khẩu để test/document công thức
 * ngưỡng, nhưng `evaluate.ts` KHÔNG gọi hàm này cho kết quả `exact` (xem
 * `knowledgeGaps.ts:hutech-hocba-semester-granularity-gap` — dữ liệu hồ sơ dùng chung không đủ chi
 * tiết theo học kỳ để tính đúng "TB 3 môn của 6 học kỳ"). */
export function checkHutechHocbaThreshold(transcriptTotal30: number, group: HutechThresholdGroup): HutechEligibilityResult {
  const threshold = group === 'medicine' ? 23 : group === 'pharmacy' || group === 'pharmacy-law' ? 21 : group === 'nursing-lab' ? 19 : 18;
  return {
    pass: transcriptTotal30 >= threshold,
    requiredText: `Tổng điểm TB 3 môn theo tổ hợp của 6 học kỳ (lớp 10/11/12) ≥ ${threshold}/30 (nhóm ngành: ${group})`,
  };
}
