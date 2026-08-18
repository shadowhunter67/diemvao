import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { UsshDhlInput } from '../calculator';

/**
 * USSH 2026 không có official worked example (input→output) cho ĐHL1/ĐHL2/ĐHL3 — chỉ có công thức
 * nguyên văn từ PDF (`ussh-info-pdf-2026`) + bảng ưu tiên cross-checked (`ussh-scoring-clarification-2026`).
 * Tier C. 3 case dưới đây cố tình phủ cả 3 applicant type (ĐT1/ĐT2/ĐT3 — nhánh chọn công thức khác
 * hẳn nhau, xem `calculateUsshBestDhl`) VÀ cả 2 nhánh giảm/không giảm điểm ưu tiên.
 */
export const usshGoldenCases: GoldenAdmissionCase<
  UsshDhlInput & { priorityRegion?: string; priorityCategory?: string },
  { applicantType: 'DT1' | 'DT2' | 'DT3'; scoreBeforeBonusAndPriority: number; finalScore: number }
>[] = [
  {
    id: 'ussh-2026-dt1-priority-reduction-boundary',
    schoolId: 'ussh',
    methodId: 'ussh-integrated-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ussh-info-pdf-2026',
    sourceNote: 'ĐHL1 = 0.45×[THPT×100/30] + 0.45×[ĐGNL×100/1200] + 0.10×[HB×100/30] — nguyên văn PDF mục 2.2.2.',
    derivation: `
      thptRawTotal30=24 → ×100/30=80.00; dgnlRaw1200=960 → ×100/1200=80.00; transcriptTotal30=24 → ×100/30=80.00
      thptComponent=round2(0.45×80)=36.00; dgnlComponent=round2(0.45×80)=36.00; transcriptComponent=round2(0.1×80)=8.00
      scoreBeforeBonusAndPriority = 36.00+36.00+8.00 = 80.00 (bonus=0 do exact chỉ hỗ trợ ĐC=0)
      totalIncludingBonus = 80.00 (>= 75 → KÍCH HOẠT giảm ưu tiên)
      standardPriority: chỉ region KV1=2.5 (không category) → 2.5
      effectivePriority = round(((100-80)/25)×2.5×100)/100 = round(0.8×2.5×100)/100 = round(200)/100 = 2.00
      finalScore = round(min(100, 80.00+2.00)×100)/100 = 82.00
    `,
    boundaryNote: 'Applicant type branch DT1 (đủ cả 3 thành phần) + priority reduction threshold (75) vừa bị vượt.',
    input: { thptRawTotal30: 24, dgnlRaw1200: 960, transcriptTotal30: 24, priorityRegion: 'KV1' },
    expected: { applicantType: 'DT1', scoreBeforeBonusAndPriority: 80.0, finalScore: 82.0 },
  },
  {
    id: 'ussh-2026-dt2-no-priority',
    schoolId: 'ussh',
    methodId: 'ussh-integrated-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ussh-info-pdf-2026',
    sourceNote: 'ĐHL2 = 0.90×[THPT×100/30] + 0.10×[HB×100/30] — nhánh THPT+Học bạ, KHÔNG có ĐGNL.',
    derivation: `
      thptRawTotal30=24 → ×100/30=80.00; transcriptTotal30=24 → ×100/30=80.00 (không có dgnlRaw1200 → ĐT2)
      thptComponent=round2(0.9×80)=72.00; transcriptComponent=round2(0.1×80)=8.00
      scoreBeforeBonusAndPriority = 72.00+8.00 = 80.00
      totalIncludingBonus=80.00 (>=75) nhưng standardPriority=0 (không khai KV/ĐT) → effectivePriority=0 dù ở nhánh giảm
      finalScore = round(min(100, 80.00+0)×100)/100 = 80.00
    `,
    boundaryNote: 'Applicant type branch DT2 (không có ĐGNL) — công thức trọng số khác hẳn DT1 (0.90/0.10 thay vì 0.45/0.45/0.10).',
    input: { thptRawTotal30: 24, transcriptTotal30: 24 },
    expected: { applicantType: 'DT2', scoreBeforeBonusAndPriority: 80.0, finalScore: 80.0 },
  },
  {
    id: 'ussh-2026-dt3-no-reduction',
    schoolId: 'ussh',
    methodId: 'ussh-integrated-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ussh-info-pdf-2026',
    sourceNote: 'ĐHL3 = 0.90×[ĐGNL×100/1200] + 0.10×[HB×100/30] — nhánh ĐGNL+Học bạ, KHÔNG có THPT.',
    derivation: `
      dgnlRaw1200=600 → ×100/1200=50.00; transcriptTotal30=24 → ×100/30=80.00 (không có thptRawTotal30 → ĐT3)
      dgnlComponent=round2(0.9×50)=45.00; transcriptComponent=round2(0.1×80)=8.00
      scoreBeforeBonusAndPriority = 45.00+8.00 = 53.00 (< 75 → KHÔNG giảm ưu tiên)
      standardPriority: chỉ category UT2 → round(10/3×100)/100 = round(333.33...)/100 = 3.33
      effectivePriority = standardPriority = 3.33 (dưới ngưỡng, hưởng trọn)
      finalScore = round(min(100, 53.00+3.33)×100)/100 = 56.33
    `,
    boundaryNote: 'Applicant type branch DT3 (không có THPT) + control case: scoreBeforeBonusAndPriority (53) dưới ngưỡng giảm (75).',
    input: { dgnlRaw1200: 600, transcriptTotal30: 24, priorityCategory: 'UT2' },
    expected: { applicantType: 'DT3', scoreBeforeBonusAndPriority: 53.0, finalScore: 56.33 },
  },
];
