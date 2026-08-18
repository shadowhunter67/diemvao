import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { IuAcademicScoreInput } from '../calculator';
import type { IuTotalBonusInput } from '../bonus';

/**
 * IU 2026 (Phương thức 2, đối tượng "Thí sinh tốt nghiệp THPT 2026") không có official worked
 * example — chỉ có công thức + hằng số verified từ `iu-admission-info-2026`/`sources.ts` (đọc
 * 2026-08-14): k1=0.4 (THPT), k2=0.5 (ĐGNL), k3=0.1 (học bạ), Hs3=0.83 (thay thế khi không có
 * ĐGNL 2026), bonus cap 10, priority reduction ngưỡng 75/25. Tier C.
 */
export const iuGoldenCases: GoldenAdmissionCase<
  { academic: IuAcademicScoreInput; bonus: IuTotalBonusInput; priorityRegion?: string; priorityCategory?: string },
  { academicScore: number; bonusTotal: number; bonusCapped: boolean; priorityEffective: number; finalScore: number }
>[] = [
  {
    id: 'iu-2026-formula-derived-with-dgnl-bonus-cap-and-priority-reduction',
    schoolId: 'iu',
    methodId: 'iu-method2-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iu-admission-info-2026',
    sourceNote: 'Điểm học lực = 0.4×THPT + 0.5×ĐGNL + 0.1×Học bạ; Điểm cộng 3 thành phần cap 10; Điểm ưu tiên giảm khi (học lực+cộng)>=75, chia 25 — Khoản 5.a/2.b/7, verified.',
    derivation: `
      thptRawTotal30=24 → thptScaled100=round2(24/30×100)=80.00
      dgnlRaw1200=960 → dgnlScaled100=round2(960/1200×100)=80.00
      transcriptTotal30=24 → transcriptScaled100=round2(24/30×100)=80.00
      academicScore = round2(0.4×80 + 0.5×80 + 0.1×80) = round2(80×1.0) = 80.00
      bonus: awardTier='national-third'(7) + hasPrioritySchool=true(3) + specialAchievementCount=0
             + ielts=7.0(encouragement 5.0) → awardBonus=7, xetThuongBonus=min(5,3)=3, encouragementBonus=5
             rawTotal=7+3+5=15 (> cap 10) → total=min(10,15)=10.00 [BONUS CAP]
      academicPlusBonus = round2(80.00+10.00) = 90.00 (>= 75 → KÍCH HOẠT giảm ưu tiên)
      standardPriority = KV1(2.5)+UT1(6.66) = 9.16 (không round, lookupIuStandardPriority cộng thẳng)
      effectivePriority = round(((100-90)/25)×9.16×100)/100 = round((10/25)×9.16×100)/100
                          = round(0.4×9.16×100)/100 = round(366.4)/100 = 3.66
      finalScore = round2(min(100, 90.00+3.66)) = 93.66
    `,
    boundaryNote: 'Bonus cap (IU_TOTAL_BONUS_CAP=10, rawTotal 15 bị cắt) + priority reduction threshold (75) vượt.',
    input: {
      academic: { thptRawTotal30: 24, dgnlRaw1200: 960, transcriptTotal30: 24 },
      bonus: { awardTier: 'national-third', hasPrioritySchool: true, specialAchievementCount: 0, certificate: { ielts: 7.0 } },
      priorityRegion: 'KV1',
      priorityCategory: 'UT1',
    },
    expected: { academicScore: 80.0, bonusTotal: 10.0, bonusCapped: true, priorityEffective: 3.66, finalScore: 93.66 },
  },
  {
    id: 'iu-2026-formula-derived-no-dgnl-substitute-no-reduction',
    schoolId: 'iu',
    methodId: 'iu-method2-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iu-admission-info-2026',
    sourceNote: 'Không có ĐGNL 2026 → thay bằng Hs3×THPT (Hs3=0.83), đúng công thức đối tượng 1.2 — verified.',
    derivation: `
      thptRawTotal30=24 → thptScaled100=80.00 (không có dgnlRaw1200 → dùng Hs3 substitute)
      dgnlSubstitute = round2(0.83×80) = 66.40
      transcriptTotal30=24 → transcriptScaled100=80.00
      academicScore = round2(0.4×80 + 0.5×66.40 + 0.1×80) = round2(32+33.2+8) = round2(73.2) = 73.20
      bonus: none/false/0/không chứng chỉ → total=0.00
      academicPlusBonus = round2(73.20+0) = 73.20 (< 75 → KHÔNG giảm ưu tiên)
      standardPriority = KV2(0.83)+UT2(3.33) = 4.16
      effectivePriority = standardPriority = 4.16 (dưới ngưỡng, hưởng trọn, không tính công thức giảm)
      finalScore = round2(min(100, 73.20+4.16)) = 77.36
    `,
    boundaryNote: 'Method branch anchor: KHÔNG có ĐGNL 2026 (Hs3=0.83 substitute) + control case dưới priority reduction threshold (75).',
    input: {
      academic: { thptRawTotal30: 24, transcriptTotal30: 24 },
      bonus: { awardTier: 'none', hasPrioritySchool: false, specialAchievementCount: 0, certificate: {} },
      priorityRegion: 'KV2',
      priorityCategory: 'UT2',
    },
    expected: { academicScore: 73.2, bonusTotal: 0, bonusCapped: false, priorityEffective: 4.16, finalScore: 77.36 },
  },
];
