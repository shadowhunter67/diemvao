import type { SourcedRule } from '../../core/evidence';

export const huflitFormulaEvidence = {
  value: { pt1Description: 'tổng thô 3 môn thi THPT', pt2Description: 'tổng thô TB 3 môn 3 năm (10/11/12)' },
  evidence: [
    {
      sourceId: 'huflit-admission-plan-2026',
      location:
        'Mục 2 "Phương thức xét tuyển": "Phương thức 1... Điểm xét tuyển là tổng điểm của 3 môn thi tốt nghiệp THPT theo tổ hợp 3 môn."; "Phương thức 2... Điểm xét tuyển là tổng điểm trung bình 3 môn theo tổ hợp xét tuyển của 3 năm học (lớp 10, lớp 11 và lớp 12)."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ pt1Description: string; pt2Description: string }>;

export const huflitThresholdEvidence = {
  value: { pt1General30: 15, pt1Law30: 20, pt2General30: 18, pt2Law30: 21, pt2ThptPrerequisite30: 15, pt3General1200: 550, pt3Law1200: 720 },
  evidence: [
    {
      sourceId: 'huflit-threshold-announcement-2026',
      location:
        '"Phương thức 1... 15 điểm. Riêng với ngành Luật và Luật kinh tế là 20 điểm."; "Phương thức 2... 18 điểm. Riêng với ngành Luật và Luật kinh tế là 21 điểm."; "Phương thức 3... 550 điểm. Riêng với ngành Luật và Luật kinh tế là 720 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-07-09',
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'huflit-admission-plan-2026',
      location: 'Mục 4 "Điều kiện xét tuyển", Phương thức 2: "Có điểm thi tốt nghiệp THPT từ 15 điểm trở lên... Tổng điểm trung bình của 3 môn... đạt từ 18 điểm trở lên."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ pt1General30: number; pt1Law30: number; pt2General30: number; pt2Law30: number; pt2ThptPrerequisite30: number; pt3General1200: number; pt3Law1200: number }>;

export const huflitPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    reductionThreshold30: 22.5,
    reductionDivisor30: 7.5,
  },
  evidence: [
    {
      sourceId: 'huflit-admission-plan-2026',
      location: 'Rule điểm ưu tiên khu vực/đối tượng theo Quy chế tuyển sinh Bộ GDĐT — HUFLIT không tự công bố bảng số riêng, dùng bảng chuẩn quốc gia cross-check với 5 trường khác trong repo.',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Xem knowledgeGaps.ts:huflit-priority-table-not-huflit-specific — cross-checked, KHÔNG verified trực tiếp.',
    },
  ],
} satisfies SourcedRule<{ regionPoints30: Record<string, number>; categoryPoints30: Record<string, number>; reductionThreshold30: number; reductionDivisor30: number }>;
