import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { UfmThreeSubjectInput } from '../calculator';
import type { UfmThresholdGroup } from '../eligibility';

/**
 * UFM 2026 không có official worked example (input→output) cho xét THPT/xét ĐGNL — chỉ có công
 * thức + ngưỡng nguyên văn từ Thông báo 10/7/2026 (`ufm-quality-threshold-2026`) + bảng ưu tiên
 * cross-checked quốc gia (`ufm-admission-plan-2026`). Tier C. Case dưới đây phủ: case thường,
 * boundary ngưỡng, nhóm Luật kinh tế (cả pass và fail điều kiện phụ Toán≥6), boundary giảm ưu tiên.
 */
export const ufmThptGoldenCases: GoldenAdmissionCase<
  UfmThreeSubjectInput & { priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { raw30: number; finalScore: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-thpt-standard-normal',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Điểm xét = tổng thô 3 môn (không hệ số); ngưỡng nhóm "chuẩn" = 16/30; ưu tiên KV2 = 0,25 (bảng chuẩn quốc gia).',
    derivation: `
      raw30 = 8+7+6 = 21.00 (>=16 → eligible, nhóm standard)
      standardPriority30 = KV2 = 0.25 (không category)
      cappedTotal=21.00 < 22.5 → KHÔNG giảm → effectivePriority30 = 0.25
      finalScore = round(min(30, 21.00+0.25)) = 21.25
    `,
    input: { subject1Score: 8, subject2Score: 7, subject3Score: 6, priorityRegion: 'KV2', group: 'standard' },
    expected: { raw30: 21.0, finalScore: 21.25, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-standard-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "chuẩn" = 16/30 — case này ĐÚNG bằng ngưỡng (boundary = đạt).',
    derivation: `
      raw30 = 6+5+5 = 16.00 (== 16 → eligible, nhóm standard)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 16.00+0)) = 16.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm — chứng minh phép so sánh dùng >= chứ không phải >.',
    input: { subject1Score: 6, subject2Score: 5, subject3Score: 5, group: 'standard' },
    expected: { raw30: 16.0, finalScore: 16.0, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-law-economics-pass',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Luật kinh tế: tổng ≥20/30 VÀ Toán ≥6 VÀ không môn nào <1 — case này thỏa cả 3 điều kiện.',
    derivation: `
      raw30 = 7(Toán)+7+6 = 20.00 (>=20, Toán=7>=6, min(7,7,6)=6>=1 → eligible, nhóm law-economics)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 20.00+0)) = 20.00
    `,
    input: { subject1Score: 7, subject2Score: 7, subject3Score: 6, group: 'law-economics' },
    expected: { raw30: 20.0, finalScore: 20.0, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-law-economics-fails-math-floor',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Luật kinh tế: tổng ≥20 nhưng Toán <6 → VẪN ineligible dù tổng đạt — chứng minh điều kiện phụ độc lập với tổng.',
    derivation: `
      raw30 = 5(Toán)+8+8 = 21.00 (>=20 nhưng Toán=5<6 → ineligible, nhóm law-economics)
      finalScore vẫn tính được (exact không phụ thuộc eligibility) = round(min(30, 21.00+0)) = 21.00
    `,
    boundaryNote: 'Điều kiện phụ Toán≥6 độc lập với tổng điểm — tổng đạt ngưỡng KHÔNG đủ nếu Toán dưới sàn riêng.',
    input: { subject1Score: 5, subject2Score: 8, subject3Score: 8, group: 'law-economics' },
    expected: { raw30: 21.0, finalScore: 21.0, eligible: false },
  },
  {
    id: 'ufm-2026-thpt-priority-reduction-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-admission-plan-2026',
    sourceNote: 'Giảm điểm ưu tiên khi tổng >= 22,5/30 (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      raw30 = 9+9+9 = 27.00 (>=16 → eligible, nhóm standard)
      standardPriority30 = KV1 = 0.75
      cappedTotal=27.00 >= 22.5 → GIẢM: effectivePriority30 = round(((30-27)/7.5)×0.75) = round(0.4×0.75) = round(0.3) = 0.30
      finalScore = round(min(30, 27.00+0.30)) = 27.30
    `,
    boundaryNote: 'Priority reduction threshold (22,5/30) vừa bị vượt.',
    input: { subject1Score: 9, subject2Score: 9, subject3Score: 9, priorityRegion: 'KV1', group: 'standard' },
    expected: { raw30: 27.0, finalScore: 27.3, eligible: true },
  },
];

export const ufmDgnlGoldenCases: GoldenAdmissionCase<
  { dgnlScore1200: number; priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { finalScore: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-dgnl-standard-normal',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "chuẩn" (ĐGNL) = 657/1200; ưu tiên KV2 = 0,25×40 = 10 (thang 1200).',
    derivation: `
      dgnlScore1200 = 700 (>=657 → eligible, nhóm standard)
      standardPriority30 = KV2 = 0.25 → standardPriority1200 = 0.25×40 = 10
      cappedScore=700 < 900 → KHÔNG giảm → effectivePriority1200 = 10
      finalScore = round(700+10) = 710.00
    `,
    input: { dgnlScore1200: 700, priorityRegion: 'KV2', group: 'standard' },
    expected: { finalScore: 710.0, eligible: true },
  },
  {
    id: 'ufm-2026-dgnl-standard-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "chuẩn" (ĐGNL) = 657/1200 — case này ĐÚNG bằng ngưỡng.',
    derivation: `
      dgnlScore1200 = 657 (== 657 → eligible, nhóm standard)
      không khai KV/ĐT → effectivePriority1200 = 0
      finalScore = round(657+0) = 657.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm.',
    input: { dgnlScore1200: 657, group: 'standard' },
    expected: { finalScore: 657.0, eligible: true },
  },
  {
    id: 'ufm-2026-dgnl-law-economics-below-threshold',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Luật kinh tế" (ĐGNL) = 720/1200 — case này DƯỚI ngưỡng 1 điểm.',
    derivation: `
      dgnlScore1200 = 719 (< 720 → ineligible, nhóm law-economics)
      finalScore = round(719+0) = 719.00
    `,
    input: { dgnlScore1200: 719, group: 'law-economics' },
    expected: { finalScore: 719.0, eligible: false },
  },
  {
    id: 'ufm-2026-dgnl-priority-reduction-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-admission-plan-2026',
    sourceNote: 'Giảm điểm ưu tiên khi ĐGNL >= 900/1200 (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      dgnlScore1200 = 950 (>=657 → eligible, nhóm standard)
      standardPriority30 = KV1 = 0.75 → standardPriority1200 = 0.75×40 = 30
      cappedScore=950 >= 900 → GIẢM: effectivePriority1200 = round(((1200-950)/300)×30) = round((250/300)×30) = round(25.00) = 25.00
      finalScore = round(950+25.00) = 975.00
    `,
    boundaryNote: 'Priority reduction threshold (900/1200) vừa bị vượt.',
    input: { dgnlScore1200: 950, priorityRegion: 'KV1', group: 'standard' },
    expected: { finalScore: 975.0, eligible: true },
  },
];
