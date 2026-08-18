export interface TdtuEligibilityResult {
  pass: boolean;
  requiredText: string;
}

const GENERAL_THRESHOLD_30 = 15.0;

/**
 * Ngưỡng chung PT1 (`sources.ts:tdtu-pl2-programs-pt1-2026`, xuất hiện lặp lại ở đa số trong 119
 * dòng ngành đã đọc): "Tổng điểm thi THPT 2026 của 3 môn trong tổ hợp xét tuyển PT1 (không nhân
 * hệ số) hoặc điểm 3 môn (Toán + Văn + môn khác) ≥ 15/30 (áp dụng với thí sinh tốt nghiệp năm
 * 2026) và đạt ngưỡng điểm đầu vào do TDTU quy định." — hàm này CHỈ kiểm tra vế đầu (ngưỡng
 * Bộ GDĐT chung); vế sau "ngưỡng điểm đầu vào do TDTU quy định" là ngưỡng RIÊNG THEO NGÀNH,
 * UniscoreVN chưa có dữ liệu (`knowledgeGaps.ts:tdtu-program-catalog-not-imported`) nên đạt ngưỡng
 * chung KHÔNG đồng nghĩa "eligible" — chỉ loại được trường hợp chắc chắn KHÔNG đạt.
 */
export function checkTdtuGeneralThreshold(totalScore30: number): TdtuEligibilityResult {
  return {
    pass: totalScore30 >= GENERAL_THRESHOLD_30,
    requiredText: `Tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển PT1 (không nhân hệ số) ≥ ${GENERAL_THRESHOLD_30}/30 (Bộ GDĐT) — CÒN CẦN đạt ngưỡng điểm đầu vào riêng theo ngành do TDTU quy định (chưa có dữ liệu, xem knowledgeGaps.ts)`,
  };
}
