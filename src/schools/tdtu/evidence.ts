import type { SourcedRule } from '../../core/evidence';

export const tdtuCompetencyFormulaEvidence = {
  value: { thptWeight: 0.75, processWeight: 0.25, mainSubjectWeight: 2, scaleFactor: 2.5 },
  evidence: [
    {
      sourceId: 'tdtu-admission-plan-2026',
      location:
        'Mục 1.1, Đối tượng 1.1: "Điểm năng lực = Điểm năng lực THPT×75% + Điểm quá trình THPT×25%"; "Điểm năng lực THPT = (Điểm môn 1 + Điểm môn 2 + Điểm môn 3×2)×2.5"; "Điểm quá trình THPT = (Điểm TB 6HK môn 1 + Điểm TB 6HK môn 2 + Điểm TB 6HK môn 3×2)×2.5"',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ thptWeight: number; processWeight: number; mainSubjectWeight: number; scaleFactor: number }>;

export const tdtuBonusEvidence = {
  value: { thuongCap100: 10, xetThuongCap100: 5, totalCap100: 10 },
  evidence: [
    {
      sourceId: 'tdtu-admission-plan-2026',
      location: 'Mục 1.1.d: "Điểm cộng = Điểm thưởng + Điểm xét thưởng"; "Điểm cộng được tính theo thang điểm 100 và tối đa được 10 điểm"',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'tdtu-pl6-bonus-award-2026',
      location: 'Phụ lục 6 — bảng 6 mục (HSG QG/QT, KHKT QG/QT, thể thao đội tuyển QG, mỹ thuật QT, tay nghề ASEAN/QT), điểm 10/8/6 theo hạng, trần 10',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'tdtu-pl7-merit-award-2026',
      location:
        'Phụ lục 7 — bảng 7 mục (HSG tỉnh/thành, hạnh kiểm tốt 3 năm, khuyến khích HSG QG, khuyến khích KHKT QG, thể thao QG, mỹ thuật toàn quốc, tay nghề ASEAN/QT), trần 5, lưu ý mục 1&3 chỉ cộng cao nhất',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ thuongCap100: number; xetThuongCap100: number; totalCap100: number }>;

export const tdtuPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    pt1ReductionThreshold100: 75,
    pt1ReductionDivisor: 25,
    pt2ReductionThreshold1200: 900,
    pt2ReductionDivisor: 300,
  },
  evidence: [
    {
      sourceId: 'tdtu-pl5-priority-2026',
      location: 'Bảng điểm ưu tiên khu vực/đối tượng thang 30/100/1200 — KV1=0,75/KV2NT=0,5/KV2=0,25/KV3=0; ĐT01-03=2, ĐT04-06=1 (thang 30)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'tdtu-admission-plan-2026',
      location:
        'PT1: "(Năng lực+Cộng)≥75: ĐUT=[(100-Năng lực-Cộng)/25]×(KV+ĐT)"; PT2: "ĐGNL≥900: ĐUT=[(1200-Tổng ĐGNL)/300]×(KV+ĐT)"',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{
  regionPoints30: Record<string, number>;
  categoryPoints30: Record<string, number>;
  pt1ReductionThreshold100: number;
  pt1ReductionDivisor: number;
  pt2ReductionThreshold1200: number;
  pt2ReductionDivisor: number;
}>;

export const tdtuGeneralThresholdEvidence = {
  value: { generalThreshold30: 15.0 },
  evidence: [
    {
      sourceId: 'tdtu-pl2-programs-pt1-2026',
      location:
        'Cột "Ngưỡng đầu vào 2026" — lặp lại ở đa số 119 dòng ngành: "Tổng điểm thi THPT 2026 của 3 môn trong tổ hợp xét tuyển PT1 (không nhân hệ số) hoặc điểm 3 môn (Toán + Văn + môn khác) ≥ 15/30 (áp dụng với thí sinh tốt nghiệp năm 2026) và đạt ngưỡng điểm đầu vào do TDTU quy định."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Một số ngành (Luật, Dược học, Kiểm toán...) dùng ngưỡng riêng 3-nhánh OR khác — xem knowledgeGaps.ts:tdtu-law-pharmacy-alt-threshold.',
    },
  ],
} satisfies SourcedRule<{ generalThreshold30: number }>;
