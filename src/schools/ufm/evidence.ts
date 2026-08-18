import type { SourcedRule } from '../../core/evidence';

export const ufmFormulaEvidence = {
  value: {
    thptDescription: 'tổng thô 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (thang 30), phạm vi chương trình Chuẩn — KHÔNG áp dụng chương trình Tiếng Anh toàn phần (hệ số Toán×2 chưa xác nhận rõ ràng, xem knowledgeGaps.ts)',
    dgnlDescription: 'tổng điểm bài thi ĐGNL ĐHQG TP.HCM 2026 (thang 1200), đọc từ hồ sơ điểm dùng chung',
  },
  evidence: [
    {
      sourceId: 'ufm-quality-threshold-2026',
      location: '"tổng điểm 3 môn trong tổ hợp xét tuyển từ 16 điểm trở lên" (phương thức thi TN THPT) — đọc như tổng thô, không có hệ số môn nào trong câu ngưỡng.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ thptDescription: string; dgnlDescription: string }>;

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
