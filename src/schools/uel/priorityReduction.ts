/**
 * Batch 6, workstream T/U — quy tắc giảm điểm ưu tiên khu vực/đối tượng khi tổng điểm cao, đọc
 * TRỰC TIẾP từ trang tuyển sinh chính thức UEL (`https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/`,
 * fetch 2026-08-13): nguyên văn "(100 – [Điểm học lực] – [Điểm cộng])/25 × [Điểm ưu tiên quy đổi],
 * làm tròn đến 0.01", áp dụng khi tổng điểm học lực + điểm cộng ≥ 75. Cùng cấu trúc công thức
 * (ngưỡng 75, chia 25) với `schools/hcmut/config/admission-2026.ts` (`reductionThreshold: 75,
 * reductionDivisor: 25`) — đây là quy định chung Bộ GD&ĐT áp cho thang 100, không phải trùng hợp.
 *
 * Đây là 1 trong 2 khoảng trống batch 5 từng liệt kê (`knowledgeGaps.ts`) — batch 6 đã unblock
 * phần này. Phần còn lại (bảng điểm cộng ngoại ngữ đầy đủ theo từng mức) VẪN thiếu — chỉ có 1-2
 * điểm dữ liệu rời rạc, không đủ dựng bảng an toàn (xem `knowledgeGaps.ts`) — nên `exactCalculator`
 * vẫn `false`. Hàm này là 1 tool ĐỘC LẬP, đúng dữ liệu đã verified, không phải một phần của exact
 * calculator.
 */
export interface PriorityReductionInput {
  /** Điểm học lực + điểm cộng đã cộng sẵn (thang 100). */
  academicPlusBonus: number;
  /** Điểm ưu tiên khu vực/đối tượng theo bảng quy đổi thang 100 (chưa giảm). */
  standardPriority: number;
}

export interface PriorityReductionResult {
  effectivePriority: number;
  reduced: boolean;
}

export const REDUCTION_THRESHOLD = 75;
export const REDUCTION_DIVISOR = 25;
const SCALE_MAX = 100;

export function calculateUelEffectivePriority(input: PriorityReductionInput): PriorityReductionResult {
  if (input.academicPlusBonus < REDUCTION_THRESHOLD) {
    return { effectivePriority: input.standardPriority, reduced: false };
  }
  const effectivePriority =
    Math.round((((SCALE_MAX - input.academicPlusBonus) / REDUCTION_DIVISOR) * input.standardPriority) * 100) / 100;
  return { effectivePriority, reduced: true };
}
