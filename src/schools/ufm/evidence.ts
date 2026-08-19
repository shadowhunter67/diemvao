import type { SourcedRule } from '../../core/evidence';

export const ufmFormulaEvidence = {
  value: {
    thptDescription:
      'tổng thô 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (thang 30), phạm vi chương trình Chuẩn — hệ số Toán×2 CHỈ áp dụng chương trình Tiếng Anh toàn phần (định hướng quốc tế), KHÔNG áp dụng chương trình Chuẩn, xác nhận verbatim 2026-08-19 (xem knowledgeGaps.ts)',
    dgnlDescription:
      'tổng điểm thô bài thi ĐGNL ĐHQG TP.HCM 2026 (thang 1200), đọc từ hồ sơ điểm dùng chung — CHỈ dùng để so ngưỡng đầu vào; "Điểm xét tuyển" chính thức (dùng xếp hạng trúng tuyển) theo văn bản gốc là "Điểm kết quả kỳ thi đánh giá năng lực quy đổi" sang thang 30 qua bảng bách phân vị Bộ GD-ĐT, CHƯA parse (xem knowledgeGaps.ts:ufm-final-score-conversion-unparsed) — module KHÔNG claim exact cho phương thức này.',
  },
  evidence: [
    {
      sourceId: 'ufm-quality-threshold-2026',
      location: '"tổng điểm 3 môn trong tổ hợp xét tuyển từ 16 điểm trở lên" (phương thức thi TN THPT) — đọc như tổng thô, không có hệ số môn nào trong câu ngưỡng.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'ufm-admission-plan-2026',
      location:
        'Trang 5 (mục 3.c, công thức Điểm xét tuyển phương thức 2/3/4/5) của `THONGTINTS2026-FINAL_compressed.pdf` — verbatim: "Đối với chương trình Tiếng Anh toàn phần (định hướng quốc tế): Điểm môn Toán sẽ được nhân hệ số 2 trong tổ hợp xét tuyển." Câu này lặp lại y hệt cho cả 3 phương thức 2/4/5, KHÔNG xuất hiện ở phần công thức chương trình Chuẩn.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-19',
      note: 'Đọc trực tiếp từ ảnh trang PDF chính thức tại login.ufm.edu.vn qua chrome-devtools screenshot (không qua OCR/mirror) — giải quyết dứt điểm knowledgeGaps.ts:ufm-math-coefficient-scope-conflicting theo hướng "chỉ TATP", khớp với diễn giải AN TOÀN đã chọn từ batch trước.',
    },
  ],
} satisfies SourcedRule<{ thptDescription: string; dgnlDescription: string }>;

/** Điểm cộng (b1/b2/b3, thang 30, tối đa 3,0) — verified trực tiếp qua screenshot trang 7 (mục 5.b)
 * của `THONGTINTS2026-FINAL_compressed.pdf` tại `login.ufm.edu.vn` (2026-08-19), khớp 100% với nội
 * dung đã đọc được qua mirror `giaoduc247.vn` ở batch trước — nay xác nhận qua domain gốc nên
 * `verification: 'verified'`, đóng `knowledgeGaps.ts:ufm-bonus-table-not-found`. */
export const ufmBonusEvidence = {
  value: {
    b1NationalAward30: { first: 3, second: 2, third: 1.5 },
    b2Cap30: 1.5,
    b2NationalEncouragement30: 1,
    b2GiftedSchool30: 0.75,
    b2GoodStudent3Years30: 0.75,
    b3Cap30: 1.5,
    totalCap30: 3,
  },
  evidence: [
    {
      sourceId: 'ufm-admission-plan-2026',
      location:
        'Trang 7 mục "5.b. Điểm cộng" của `THONGTINTS2026-FINAL_compressed.pdf`: "b1. Điểm thưởng do có thành tích các kỳ thi quốc gia (Tối đa 3 điểm): giải nhất/nhì/ba → 3,0/2,0/1,5." · "b2. Điểm xét thưởng (Tối đa 1,5 điểm): Nhóm 1 giải khuyến khích quốc gia +1,0; Nhóm 2 trường chuyên/năng khiếu +0,75; Nhóm 3 HSG 3 năm +0,75." · "b3. Điểm khuyến khích chứng chỉ Tiếng Anh (Tối đa 1,5 điểm), Bảng 1." · "Điểm cộng của mỗi thí sinh không vượt quá 10% mức điểm tối đa của thang điểm xét" (=3,0/30).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-19',
      note: 'Screenshot trực tiếp từ trình xem PDF Chrome tại login.ufm.edu.vn (không qua OCR) — cross-check khớp 100% với text đọc được qua mirror giaoduc247.vn ở batch trước, nay có domain gốc xác nhận trực tiếp.',
    },
  ],
} satisfies SourcedRule<{
  b1NationalAward30: { first: number; second: number; third: number };
  b2Cap30: number;
  b2NationalEncouragement30: number;
  b2GiftedSchool30: number;
  b2GoodStudent3Years30: number;
  b3Cap30: number;
  totalCap30: number;
}>;

/** Ngưỡng đảm bảo chất lượng đầu vào 2026 — 2 nhóm (chuẩn/Luật kinh tế) × 4 phương thức tính điểm
 * (không tính PT xét thẳng, không có công thức điểm), trích verbatim từ `ufm-quality-threshold-2026`
 * (10/7/2026). */
export const ufmThresholdEvidence = {
  value: {
    thpt30: { standard: 16, lawEconomics: 20 },
    hocba30: { standard: 18, lawEconomics: 18 },
    dgnl1200: { standard: 657, lawEconomics: 720 },
    vsat: { standard: 241, lawEconomics: 270 },
    lawEconomicsMathMinRaw: 6,
    lawEconomicsSubjectFloor: 1,
  },
  evidence: [
    {
      sourceId: 'ufm-quality-threshold-2026',
      location:
        '"Kỳ thi tốt nghiệp THPT (ngành thường): tổng điểm 3 môn từ 16 điểm trở lên." · "Học tập THPT: 18 điểm." · "ĐGNL: 657/1.200 điểm." · "V-SAT: 241 điểm trở lên." · Ngành Luật kinh tế: "THPT: tổng điểm 3 môn từ 20 điểm trở lên. Môn Toán: tối thiểu 6 điểm. Không môn nào dưới 1 điểm." · "Học bạ THPT: 18 điểm." · "ĐGNL: 720/1.200 điểm." · "V-SAT: 270 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-07-10',
      verifiedAt: '2026-08-18',
      note: 'Verbatim fetch 2026-08-18 xác nhận KHÔNG còn "sẽ công bố sau".',
    },
  ],
} satisfies SourcedRule<{
  thpt30: { standard: number; lawEconomics: number };
  hocba30: { standard: number; lawEconomics: number };
  dgnl1200: { standard: number; lawEconomics: number };
  vsat: { standard: number; lawEconomics: number };
  lawEconomicsMathMinRaw: number;
  lawEconomicsSubjectFloor: number;
}>;

/** Bảng điểm ưu tiên khu vực/đối tượng chuẩn quốc gia (Quy chế tuyển sinh Bộ GDĐT) — UFM KHÔNG tự
 * công bố bảng số riêng ("áp dụng điểm ưu tiên đối tượng, khu vực... theo quy định"), dùng chung
 * công thức cross-check với 7 trường khác trong repo. */
export const ufmPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    reductionThreshold30: 22.5,
    reductionDivisor30: 7.5,
  },
  evidence: [
    {
      sourceId: 'ufm-admission-plan-2026',
      location: '"...điểm ưu tiên đối tượng, khu vực và điểm cộng (nếu có) theo quy định" — UFM không tự công bố bảng số riêng, dùng bảng chuẩn quốc gia cross-check với 7 trường khác trong repo.',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Xem knowledgeGaps.ts:ufm-priority-table-not-ufm-specific — cross-checked, KHÔNG verified trực tiếp.',
    },
  ],
} satisfies SourcedRule<{ regionPoints30: Record<string, number>; categoryPoints30: Record<string, number>; reductionThreshold30: number; reductionDivisor30: number }>;
