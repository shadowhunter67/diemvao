import type { SourcedRule } from '../../core/evidence';

export const hutechFormulaEvidence = {
  value: {
    thptDescription: 'tổng điểm 3 môn thi tốt nghiệp THPT 2026 theo tổ hợp xét tuyển (thang 30)',
    dgnlDescription: 'tổng điểm bài thi ĐGNL ĐHQG TP.HCM 2026 (thang 1200), đọc từ hồ sơ điểm dùng chung',
  },
  evidence: [
    {
      sourceId: 'hutech-admission-plan-2026',
      location:
        'Mục "Phương thức xét tuyển": phương thức xét kết quả kỳ thi tốt nghiệp THPT 2026 dùng tổng điểm 3 môn theo tổ hợp; phương thức xét kết quả ĐGNL ĐHQG TP.HCM 2026 dùng trực tiếp kết quả kỳ thi (thang 1200).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ thptDescription: string; dgnlDescription: string }>;

/**
 * Ngưỡng đảm bảo chất lượng đầu vào 2026 — 4 nhóm ngành × 4 phương thức, trích verbatim từ
 * `hutech-quality-threshold-2026` (04/7/2026). Nhóm "pharmacy-law" (Dược, Luật, Luật kinh tế) CHỈ
 * xác nhận cho phương thức thi THPT — phương thức học bạ/ĐGNL/V-SAT không liệt kê riêng tier Luật
 * (xem `knowledgeGaps.ts`).
 */
export const hutechThresholdEvidence = {
  value: {
    thpt30: { medicine: 22, pharmacyLaw: 20, nursingLab: 18, standard: 15 },
    hocba30: { medicine: 23, pharmacy: 21, nursingLab: 19, standard: 18 },
    dgnl1200: { medicine: 650, pharmacy: 570, standard: 550 },
    vsat: { medicinePharmacy: 250, standard: 225 },
  },
  evidence: [
    {
      sourceId: 'hutech-quality-threshold-2026',
      location:
        '"Phương thức 1: Xét tuyển kết quả kỳ thi tốt nghiệp THPT 2026 — Y khoa: 22 điểm; Dược, Luật, Luật kinh tế: 20 điểm; Điều dưỡng, Kỹ thuật xét nghiệm y học: 18 điểm; Các ngành còn lại: 15 điểm." · "Phương thức 2: Xét tuyển học bạ THPT (6 học kỳ) — Y khoa: 23 điểm; Dược: 21 điểm; Điều dưỡng, Kỹ thuật xét nghiệm y học: 19 điểm; Các ngành còn lại: 18 điểm." · "Phương thức 3: Xét tuyển ĐGNL (ĐHQG TP.HCM) — Y: 650 điểm; Dược: 570 điểm; Các ngành còn lại: 550 điểm." · "Phương thức 4: Xét tuyển V-SAT — Y khoa, Dược: 250 điểm; Các ngành còn lại: 225 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-07-04',
      verifiedAt: '2026-08-18',
      note: 'Verbatim re-fetch 2026-08-18 xác nhận KHÔNG còn câu "sẽ công bố sau" — supersede mọi statement cũ dạng đó nếu có.',
    },
  ],
} satisfies SourcedRule<{
  thpt30: { medicine: number; pharmacyLaw: number; nursingLab: number; standard: number };
  hocba30: { medicine: number; pharmacy: number; nursingLab: number; standard: number };
  dgnl1200: { medicine: number; pharmacy: number; standard: number };
  vsat: { medicinePharmacy: number; standard: number };
}>;

/** Bảng điểm ưu tiên khu vực/đối tượng chuẩn quốc gia (Quy chế tuyển sinh Bộ GDĐT) — HUTECH KHÔNG
 * tự công bố bảng số riêng, dùng chung công thức cross-check với 6 trường khác trong repo (HCMUS/
 * UEL/IU/USSH/HCMUTE/TDTU/HUFLIT). */
export const hutechPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    reductionThreshold30: 22.5,
    reductionDivisor30: 7.5,
  },
  evidence: [
    {
      sourceId: 'hutech-admission-plan-2026',
      location: 'Rule điểm ưu tiên khu vực/đối tượng theo Quy chế tuyển sinh Bộ GDĐT — HUTECH không tự công bố bảng số riêng, dùng bảng chuẩn quốc gia cross-check với 6 trường khác trong repo.',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Xem knowledgeGaps.ts:hutech-priority-table-not-hutech-specific — cross-checked, KHÔNG verified trực tiếp.',
    },
  ],
} satisfies SourcedRule<{ regionPoints30: Record<string, number>; categoryPoints30: Record<string, number>; reductionThreshold30: number; reductionDivisor30: number }>;
