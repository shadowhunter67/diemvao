import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { HutechThreeSubjectInput } from '../calculator';
import type { HutechThresholdGroup } from '../eligibility';

/**
 * HUTECH 2026 không có official worked example (input→output) cho xét THPT/xét ĐGNL — chỉ có công
 * thức + ngưỡng nguyên văn từ Thông báo 04/7/2026 (`hutech-quality-threshold-2026`) + bảng ưu tiên
 * cross-checked quốc gia (`hutech-admission-plan-2026`). Tier C. Case dưới đây phủ: case thường,
 * boundary ngưỡng (đúng ngưỡng = đạt), nhóm ngành đặc thù, và boundary giảm điểm ưu tiên.
 */
export const hutechThptGoldenCases: GoldenAdmissionCase<
  HutechThreeSubjectInput & { priorityRegion?: string; priorityCategory?: string; group: HutechThresholdGroup },
  { raw30: number; finalScore: number; eligible: boolean }
>[] = [
  {
    id: 'hutech-2026-thpt-standard-normal',
    schoolId: 'hutech',
    methodId: 'hutech-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Điểm xét = tổng thô 3 môn (không hệ số); ngưỡng nhóm "standard" = 15/30; ưu tiên KV2 = 0,25 (bảng chuẩn quốc gia).',
    derivation: `
      raw30 = 8+7+6 = 21.00 (>=15 → eligible, nhóm standard)
      standardPriority30 = KV2 = 0.25 (không category)
      cappedTotal=21.00 < 22.5 → KHÔNG giảm → effectivePriority30 = 0.25
      finalScore = round(min(30, 21.00+0.25)) = 21.25
    `,
    input: { subject1Score: 8, subject2Score: 7, subject3Score: 6, priorityRegion: 'KV2', group: 'standard' },
    expected: { raw30: 21.0, finalScore: 21.25, eligible: true },
  },
  {
    id: 'hutech-2026-thpt-medicine-boundary',
    schoolId: 'hutech',
    methodId: 'hutech-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Y khoa" = 22/30 — case này ĐÚNG bằng ngưỡng (boundary = đạt, không phải "> ngưỡng").',
    derivation: `
      raw30 = 8+8+6 = 22.00 (== 22 → eligible, nhóm medicine, boundary >= chứ không phải >)
      không khai KV/ĐT → standardPriority30 = 0 → effectivePriority30 = 0
      finalScore = round(min(30, 22.00+0)) = 22.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm — chứng minh phép so sánh dùng >= chứ không phải >.',
    input: { subject1Score: 8, subject2Score: 8, subject3Score: 6, group: 'medicine' },
    expected: { raw30: 22.0, finalScore: 22.0, eligible: true },
  },
  {
    id: 'hutech-2026-thpt-nursing-lab-below-threshold',
    schoolId: 'hutech',
    methodId: 'hutech-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Điều dưỡng, Kỹ thuật xét nghiệm y học" = 18/30 — case này DƯỚI ngưỡng 0,01 điểm.',
    derivation: `
      raw30 = 6+6+5.99 = 17.99 (< 18 → ineligible, nhóm nursing-lab)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore vẫn tính được (exact không phụ thuộc eligibility) = round(min(30, 17.99+0)) = 17.99
    `,
    input: { subject1Score: 6, subject2Score: 6, subject3Score: 5.99, group: 'nursing-lab' },
    expected: { raw30: 17.99, finalScore: 17.99, eligible: false },
  },
  {
    id: 'hutech-2026-thpt-priority-reduction-boundary',
    schoolId: 'hutech',
    methodId: 'hutech-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-admission-plan-2026',
    sourceNote: 'Giảm điểm ưu tiên khi tổng >= 22,5/30 (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      raw30 = 9+9+9 = 27.00 (>=15 → eligible, nhóm standard)
      standardPriority30 = KV1 = 0.75
      cappedTotal=27.00 >= 22.5 → GIẢM: effectivePriority30 = round(((30-27)/7.5)×0.75) = round(0.4×0.75) = round(0.3) = 0.30
      finalScore = round(min(30, 27.00+0.30)) = 27.30
    `,
    boundaryNote: 'Priority reduction threshold (22,5/30) vừa bị vượt — kết quả khác với case standard-normal (không giảm).',
    input: { subject1Score: 9, subject2Score: 9, subject3Score: 9, priorityRegion: 'KV1', group: 'standard' },
    expected: { raw30: 27.0, finalScore: 27.3, eligible: true },
  },
];

export const hutechDgnlGoldenCases: GoldenAdmissionCase<
  { dgnlScore1200: number; priorityRegion?: string; priorityCategory?: string; group: HutechThresholdGroup },
  { finalScore: number; eligible: boolean }
>[] = [
  {
    id: 'hutech-2026-dgnl-standard-normal',
    schoolId: 'hutech',
    methodId: 'hutech-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "còn lại" (ĐGNL) = 550/1200; ưu tiên KV2 = 0,25×40 = 10 (thang 1200).',
    derivation: `
      dgnlScore1200 = 700 (>=550 → eligible, nhóm standard)
      standardPriority30 = KV2 = 0.25 → standardPriority1200 = 0.25×40 = 10
      cappedScore=700 < 900 → KHÔNG giảm → effectivePriority1200 = 10
      finalScore = round(700+10) = 710.00
    `,
    input: { dgnlScore1200: 700, priorityRegion: 'KV2', group: 'standard' },
    expected: { finalScore: 710.0, eligible: true },
  },
  {
    id: 'hutech-2026-dgnl-pharmacy-boundary',
    schoolId: 'hutech',
    methodId: 'hutech-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Dược" (ĐGNL) = 570/1200 — case này ĐÚNG bằng ngưỡng.',
    derivation: `
      dgnlScore1200 = 570 (== 570 → eligible, nhóm pharmacy)
      không khai KV/ĐT → effectivePriority1200 = 0
      finalScore = round(570+0) = 570.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm.',
    input: { dgnlScore1200: 570, group: 'pharmacy' },
    expected: { finalScore: 570.0, eligible: true },
  },
  {
    id: 'hutech-2026-dgnl-medicine-below-threshold',
    schoolId: 'hutech',
    methodId: 'hutech-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Y" (ĐGNL) = 650/1200 — case này DƯỚI ngưỡng 1 điểm.',
    derivation: `
      dgnlScore1200 = 649 (< 650 → ineligible, nhóm medicine)
      finalScore = round(649+0) = 649.00
    `,
    input: { dgnlScore1200: 649, group: 'medicine' },
    expected: { finalScore: 649.0, eligible: false },
  },
  {
    id: 'hutech-2026-dgnl-priority-reduction-boundary',
    schoolId: 'hutech',
    methodId: 'hutech-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hutech-admission-plan-2026',
    sourceNote: 'Giảm điểm ưu tiên khi ĐGNL >= 900/1200 (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      dgnlScore1200 = 950 (>=550 → eligible, nhóm standard)
      standardPriority30 = KV1 = 0.75 → standardPriority1200 = 0.75×40 = 30
      cappedScore=950 >= 900 → GIẢM: effectivePriority1200 = round(((1200-950)/300)×30) = round((250/300)×30) = round(25.00) = 25.00
      finalScore = round(950+25.00) = 975.00
    `,
    boundaryNote: 'Priority reduction threshold (900/1200) vừa bị vượt.',
    input: { dgnlScore1200: 950, priorityRegion: 'KV1', group: 'standard' },
    expected: { finalScore: 975.0, eligible: true },
  },
];
