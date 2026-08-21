import type { SourcedRule } from '../../core/evidence';

/** Điều kiện 1 (mục 2.1) — áp dụng chung mọi ngành, mọi phương thức, thí sinh tốt nghiệp THPT
 * 2026 (trừ các đối tượng miễn trừ ở footnote [1]): tổng điểm 3 môn thi TN THPT theo tổ hợp xét
 * tuyển ≥ 15,0/30, không môn nào ≤ 1,0. Đây là điều kiện CẦN, chưa phải điều kiện ĐỦ — điều kiện 2
 * (điểm sàn theo mã xét tuyển cụ thể) nằm trong phụ lục PDF ảnh chưa đọc được. */
export const ctuBaselineConditionEvidence = {
  value: { totalThreshold30: 15, subjectMinScore10: 1 },
  evidence: [
    {
      sourceId: 'ctu-quality-threshold-2026',
      location:
        'Mục 2.1 — "Thí sinh tốt nghiệp THPT (hoặc tương đương) từ năm 2026 trở về trước và có tổng điểm 3 môn trong Kỳ thi tốt nghiệp THPT năm 2026 theo tổ hợp xét tuyển... đạt từ 15,0 điểm"; mục 2.2.1 — "không có môn nào từ 1,0 điểm trở xuống".',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Điều kiện cần, KHÔNG phải điều kiện đủ — điểm sàn cụ thể theo mã xét tuyển (điều kiện 2, mục 2.2.1) nằm trong phụ lục PDF ảnh chưa đọc được (`ctu-per-major-threshold-pdf-unparsed`).',
    },
  ],
} satisfies SourcedRule<{ totalThreshold30: number; subjectMinScore10: number }>;

/** Điều kiện thay thế (2.2.3(2) pháp luật / 2.2.4(2) sư phạm trừ GDTC), phương thức học bạ/V-SAT,
 * thí sinh tốt nghiệp THPT 2026: học lực lớp 12 loại tốt VÀ (tổng 3 môn thi TN THPT ≥18/30 HOẶC
 * điểm xét tốt nghiệp THPT ≥8,5/10). Riêng nhóm pháp luật còn thêm điều kiện tổ hợp môn dùng điểm
 * V-SAT/học bạ quy đổi (chưa có bảng — `ctu-law-combo-conversion-unparsed`), nên nhóm pháp luật
 * chỉ có thể kết luận `ineligible`/`unknown`, KHÔNG kết luận `eligible` từ evidence này một mình. */
export const ctuAltPathEvidence = {
  value: { totalScoreAltPath30: 18, graduationScoreAltPath10: 8.5 },
  evidence: [
    {
      sourceId: 'ctu-quality-threshold-2026',
      location:
        'Mục 2.2.3(2) — pháp luật: "Học lực cả năm lớp 12 loại tốt và tổng điểm 3 môn trong Kỳ thi tốt nghiệp THPT năm 2026... từ 18,0 điểm trở lên hoặc điểm xét tốt nghiệp THPT từ 8,5 điểm trở lên". Mục 2.2.4(2) — sư phạm (trừ GDTC): cùng ngưỡng 18,0/8,5, thêm điều kiện năng khiếu riêng ngành Giáo dục Mầm non (không model — GDMN bị loại khỏi phạm vi batch này).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Nhóm pháp luật (2.2.3) còn điều kiện tổ hợp môn dùng điểm V-SAT/học bạ quy đổi — chưa có bảng quy đổi, không tự suy bằng điểm thi TN THPT thô.',
    },
  ],
} satisfies SourcedRule<{ totalScoreAltPath30: number; graduationScoreAltPath10: number }>;
