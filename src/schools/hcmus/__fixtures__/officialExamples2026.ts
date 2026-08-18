import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { HcmusAcademicScoreInput } from '../academicScore';

/**
 * Tier B — 3 anchor lấy TRỰC TIẾP từ bảng phân vị chính thức HCMUS (`HCMUS_VACT_CONVERSION_TABLE`,
 * sourceId `hcmus-vact-conversion-table-2026`, transcribe trực tiếp từ ảnh infographic, xem
 * `vactConversionTable.ts`). Không tính toán gì ngoài áp dụng công thức nội suy tuyến tính ĐÃ
 * verified trong `dgnlConversion.ts` (chính công thức đó cũng lấy nguyên văn từ ảnh gốc).
 */
export const hcmusVactConversionGoldenCases: GoldenAdmissionCase<number, { thptScore: number; exactBreakpoint: boolean; clampedAtCeiling: boolean } | null>[] = [
  {
    id: 'hcmus-2026-vact-table-exact-breakpoint-995',
    schoolId: 'hcmus',
    methodId: 'hcmus-method2-2026',
    year: 2026,
    tier: 'B',
    sourceId: 'hcmus-vact-conversion-table-2026',
    sourceNote: 'Dòng bảng phân vị "2%": vactScore=995 → thptScore=27.25 (mốc đúng, không cần nội suy).',
    boundaryNote: 'Exact table breakpoint — không đi qua nhánh nội suy.',
    input: 995,
    expected: { thptScore: 27.25, exactBreakpoint: true, clampedAtCeiling: false },
  },
  {
    id: 'hcmus-2026-vact-table-interpolation-midpoint-981',
    schoolId: 'hcmus',
    methodId: 'hcmus-method2-2026',
    year: 2026,
    tier: 'B',
    sourceId: 'hcmus-vact-conversion-table-2026',
    sourceNote: '2 mốc liền kề: "2%" (995→27.25) và "3%" (967→26.70). Điểm giữa (raw=981, cách đều 2 mốc) dùng đúng công thức nội suy tuyến tính đã verified trong dgnlConversion.ts.',
    derivation: `
      x1=995 (a1=27.25), x2=967 (a2=26.70), raw=981
      converted = a2 + (a1-a2) × (raw-x2)/(x1-x2) = 26.70 + 0.55 × (14/28) = 26.70 + 0.55×0.5 = 26.70+0.275 = 26.975
    `,
    boundaryNote: 'Interpolation boundary — raw nằm GIỮA 2 mốc bảng, không phải breakpoint.',
    input: 981,
    expected: { thptScore: 26.975, exactBreakpoint: false, clampedAtCeiling: false },
  },
  {
    id: 'hcmus-2026-vact-table-ceiling-clamp',
    schoolId: 'hcmus',
    methodId: 'hcmus-method2-2026',
    year: 2026,
    tier: 'B',
    sourceId: 'hcmus-vact-conversion-table-2026',
    sourceNote: 'raw=1200 (thang ĐGNL tối đa) vượt mốc cao nhất bảng ("<1%", vactScore=1139) → clamp về trần thang đích 30 (có căn cứ: 30 là điểm tối đa thang THPT, xem dgnlConversion.ts).',
    boundaryNote: 'Ceiling clamp boundary — raw vượt mốc cao nhất bảng công bố.',
    input: 1200,
    expected: { thptScore: 30, exactBreakpoint: false, clampedAtCeiling: true },
  },
];

/**
 * Tier C — không có worked example cho "điểm xét tuyển cuối cùng" (điểm học lực + điểm cộng + điểm
 * ưu tiên). 3 rule độc lập, 3 evidence độc lập (không dùng chung 1 sourceId cho cả 3 — mỗi rule
 * chứng minh bằng đúng nguồn của nó):
 *   - Điểm học lực (`hcmus-academic-score-formula-2026`, verified): MAX(0.8×THPT+0.2×HB, 0.8×ĐGNL+0.2×HB).
 *   - Điểm cộng (`hcmus-bonus-table-2026`, verified): 15 mức cơ sở + công thức giảm ngưỡng 28.5/1.5.
 *   - Điểm ưu tiên (`hcmusPriorityEvidence`, `evidence.ts`, verification `cross-checked` — batch
 *     provenance-hygiene 2026-08-17 phát hiện `priority.ts` trước đó KHÔNG có evidence riêng nào;
 *     đã audit trực tiếp 3 trang HCMUS text hiện có, KHÔNG trang nào công bố bảng KV/UT/ngưỡng
 *     22.5/7.5 — các con số khớp bảng ưu tiên chuẩn quốc gia đã verified độc lập ở UEL/IU/USSH
 *     trong repo, xem `evidence.ts` cho chi tiết cross-check). `sourceId` của case này trỏ
 *     `hcmus-academic-score-formula-2026` (nguồn DUY NHẤT xác nhận điểm xét = học lực+cộng+ưu
 *     tiên) — KHÔNG còn dùng `hcmus-bonus-table-2026` cho phần ưu tiên (workaround cũ, sai semantic:
 *     nguồn đó chỉ nói về "2. Điểm cộng", không nói gì về điểm ưu tiên).
 */
export const hcmusGoldenCase: GoldenAdmissionCase<
  HcmusAcademicScoreInput & { bonusCategoryId: string; priorityRegion: string; priorityCategory: string },
  { academicScore: number; bonusAwarded: number; priorityEffective: number; finalScore30: number }
> = {
  id: 'hcmus-2026-formula-derived-full-chain',
  schoolId: 'hcmus',
  methodId: 'hcmus-method2-2026',
  year: 2026,
  tier: 'C',
  sourceId: 'hcmus-academic-score-formula-2026',
  sourceNote:
    'ĐIỂM HỌC LỰC = MAX(0.8×THPT+0.2×HB, 0.8×ĐGNL+0.2×HB) [hcmus-academic-score-formula-2026, verified]; bonus reduction threshold 28.5/1.5 [hcmus-bonus-table-2026, verified]; priority reduction threshold 22.5/7.5 [hcmusPriorityEvidence, cross-checked — xem evidence.ts].',
  derivation: `
    thptTotal30=25, transcriptTotal30=20 (không dùng route ĐGNL)
    route1 = round2(0.8×25 + 0.2×20) = round2(20+4) = 24.00 → academicScore=24.00 (chỉ route1 available)
    bonus: category 'provincial-olympiad-third' (basePoints30=0.5), totalScoreBeforeBonus30=24.00 (< 28.5 → KHÔNG giảm)
      awardedPoints30 = 0.5 (nguyên mức cơ sở)
    academicPlusBonus30 = min(30, 24.00+0.50) = 24.50 (>= 22.5 → KÍCH HOẠT giảm ưu tiên)
    standardPriority30 = KV1(0.75)+UT1(2) = 2.75
      effectivePriority30 = round2(((30-24.50)/7.5) × 2.75) = round2((5.5/7.5)×2.75) = round2(0.733333...×2.75) = round2(2.016666...67) = 2.02
    finalScore30 = round(min(30, 24.50+2.02)×100)/100 = 26.52
  `,
  boundaryNote: 'Priority reduction boundary: academicPlusBonus30=24.50 vượt HCMUS_PRIORITY_REDUCTION_THRESHOLD_30 (22.5), bonus KHÔNG giảm (24.00 < 28.5).',
  input: {
    thptTotal30: 25,
    transcriptTotal30: 20,
    bonusCategoryId: 'provincial-olympiad-third',
    priorityRegion: 'KV1',
    priorityCategory: 'UT1',
  },
  expected: { academicScore: 24.0, bonusAwarded: 0.5, priorityEffective: 2.02, finalScore30: 26.52 },
};
