import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-13 (evidence mới: 2 ảnh infographic official user cung cấp — công thức "Cách
 * tính điểm xét tuyển" + bảng quy đổi phân vị ĐGNL↔THPT). Đã UNBLOCK: `hcmus-dgnl-threshold-image`
 * (gap cũ — nay có cả công thức lẫn bảng quy đổi đầy đủ, xem `academicScore.ts`/
 * `dgnlConversion.ts`) và phần trọng số "Điểm học lực" của `hcmus-method2-weights` cũ (tách thành
 * 2 gap hẹp hơn bên dưới vì phần "Điểm cộng"/"Điểm ưu tiên" của công thức tổng vẫn CHƯA có evidence
 * — ảnh chỉ cho công thức Điểm học lực, không cho biết Điểm cộng/Điểm ưu tiên tính thế nào).
 *
 * Gap MỚI: bảng "NGƯỠNG ĐẢM BẢO CHẤT LƯỢNG — PHƯƠNG THỨC XÉT TUYỂN TỔNG HỢP 2026" (39 dòng
 * ngành/mã ngành/chỉ tiêu/ngưỡng) được đặc tả trong yêu cầu nhưng ảnh thực tế KHÔNG được cung cấp
 * trong lượt này (chỉ nhận 6/7 ảnh) — UniscoreVN KHÔNG dựng registry 39 ngành từ text mô tả, chỉ
 * ghi nhận đây là evidence còn thiếu.
 */
export const hcmusKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmus-bonus-table',
    label: 'Bảng "Điểm cộng" (thành phần thứ 2 trong công thức Điểm xét tuyển = Điểm học lực + Điểm cộng + Điểm ưu tiên) — chưa có evidence',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hcmus-priority-formula',
    label: 'Công thức "Điểm ưu tiên" khu vực/đối tượng cho Phương thức 2 — chưa có evidence',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hcmus-program-threshold-table-39',
    label:
      'Bảng "Ngưỡng đảm bảo chất lượng — Phương thức xét tuyển tổng hợp 2026" (39 dòng ngành/mã ngành/chỉ tiêu/ngưỡng thang 30-100) — ảnh chưa được cung cấp, KHÔNG dựng registry từ mô tả text',
    status: 'incomplete',
    scoreAffecting: false,
  },
  {
    id: 'hcmus-semiconductor-percentile',
    label:
      'Điều kiện ngành Thiết kế vi mạch (Toán top 20% quốc gia, tổng điểm top 25% quốc gia) cần bảng bách phân vị quốc gia UniscoreVN không có nguồn để tra',
    status: 'incomplete',
  },
];
