import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { IuhThreeSubjectInput } from '../calculator';
import type { IuhRewardInput } from '../bonus';

/**
 * IUH 2026 không có official worked example (input→output) cho phương thức xét tuyển kết hợp — chỉ
 * có công thức + hằng số nguyên văn từ `iuh-formula-2026`/`iuh-quality-threshold-2026`/
 * `iuh-bonus-appendix-2026` (ưu tiên: bảng chuẩn quốc gia, cross-checked). Tier C. Case dưới đây phủ:
 * case thường (Max chọn XT2), boundary ngưỡng đầu vào, boundary giảm ưu tiên, case có điểm cộng, case
 * ineligible (vẫn tính được điểm exact theo đúng convention UFM/HCMUT — eligibility tách khỏi exact).
 * Phạm vi: KHÔNG có ĐGNL (đúng scope `iuh-combined-2026`, xem `evidence.ts`).
 */
export interface IuhGoldenInput {
  thpt: IuhThreeSubjectInput;
  transcript: IuhThreeSubjectInput;
  priorityRegion?: string;
  priorityCategory?: string;
  reward?: IuhRewardInput;
  englishEncouragement30?: number;
}

export interface IuhGoldenExpected {
  thptTotal30: number;
  transcriptTotal30: number;
  xt1: number;
  xt2: number;
  finalScore: number;
  eligible: boolean;
}

export const iuhCombinedGoldenCases: GoldenAdmissionCase<IuhGoldenInput, IuhGoldenExpected>[] = [
  {
    id: 'iuh-2026-combined-xt2-wins',
    schoolId: 'iuh',
    methodId: 'iuh-combined-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iuh-formula-2026',
    sourceNote: 'ĐXT=Max(XT1,XT2) (phạm vi không ĐGNL); ngưỡng chuẩn=18/30; không ưu tiên/cộng.',
    derivation: `
      ĐTN = 9+8+7 = 24.00 (>=18 → eligible)
      ĐHB = 6+6+6 = 18.00
      XT1 = 0.7×24.00 + 0.3×18.00 + 0 + 0 = 16.80 + 5.40 = 22.20
      XT2 = 24.00 + 0 + 0 = 24.00
      ĐXT = Max(22.20, 24.00) = 24.00
    `,
    boundaryNote: 'ĐHB thấp hơn ĐTN đáng kể — chứng minh XT2 (thuần thi TN) có thể thắng XT1 (kết hợp).',
    input: { thpt: { subject1Score: 9, subject2Score: 8, subject3Score: 7 }, transcript: { subject1Score: 6, subject2Score: 6, subject3Score: 6 } },
    expected: { thptTotal30: 24.0, transcriptTotal30: 18.0, xt1: 22.2, xt2: 24.0, finalScore: 24.0, eligible: true },
  },
  {
    id: 'iuh-2026-combined-threshold-boundary',
    schoolId: 'iuh',
    methodId: 'iuh-combined-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iuh-quality-threshold-2026',
    sourceNote: 'Ngưỡng đầu vào chương trình Chuẩn = 18,00/30 — case này ĐÚNG bằng ngưỡng (boundary = đạt).',
    derivation: `
      ĐTN = 6+6+6 = 18.00 (== 18 → eligible)
      ĐHB = 6+6+6 = 18.00
      XT1 = 0.7×18.00 + 0.3×18.00 = 12.60 + 5.40 = 18.00
      XT2 = 18.00
      ĐXT = Max(18.00, 18.00) = 18.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm — chứng minh phép so sánh dùng >= chứ không phải >.',
    input: { thpt: { subject1Score: 6, subject2Score: 6, subject3Score: 6 }, transcript: { subject1Score: 6, subject2Score: 6, subject3Score: 6 } },
    expected: { thptTotal30: 18.0, transcriptTotal30: 18.0, xt1: 18.0, xt2: 18.0, finalScore: 18.0, eligible: true },
  },
  {
    id: 'iuh-2026-combined-priority-reduction-boundary',
    schoolId: 'iuh',
    methodId: 'iuh-combined-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iuh-formula-2026',
    sourceNote: 'Giảm điểm ưu tiên khi (học lực) >= 22,5/30 (bảng chuẩn quốc gia, cross-checked, xem evidence.ts).',
    derivation: `
      ĐTN = 8+8+7 = 23.00 (>=18 → eligible; >=22.5 → GIẢM ưu tiên)
      standardPriority30 = KV1 = 0.75
      effectivePriority30 = round(((30-23.00)/7.5)×0.75) = round((7/7.5)×0.75) = round(0.7) = 0.70
      ĐHB = 7+7+7 = 21.00
      XT1 = 0.7×23.00 + 0.3×21.00 + 0.70 + 0 = 16.10 + 6.30 + 0.70 = 23.10
      XT2 = 23.00 + 0.70 + 0 = 23.70
      ĐXT = Max(23.10, 23.70) = 23.70
    `,
    boundaryNote: 'Priority reduction threshold (22,5/30) vừa bị vượt.',
    input: { thpt: { subject1Score: 8, subject2Score: 8, subject3Score: 7 }, transcript: { subject1Score: 7, subject2Score: 7, subject3Score: 7 }, priorityRegion: 'KV1' },
    expected: { thptTotal30: 23.0, transcriptTotal30: 21.0, xt1: 23.1, xt2: 23.7, finalScore: 23.7, eligible: true },
  },
  {
    id: 'iuh-2026-combined-with-reward-and-encouragement',
    schoolId: 'iuh',
    methodId: 'iuh-combined-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iuh-bonus-appendix-2026',
    sourceNote: 'Điểm xét thưởng (Phụ lục 1, dòng 1: giải Nhì trở lên = 1,50, đã ở trần 1,50) + điểm khuyến khích IELTS 5.5 (Phụ lục 2 = 1,00).',
    derivation: `
      ĐTN = 7+7+6 = 20.00 (>=18 → eligible)
      ĐHB = 7+7+6 = 20.00
      reward = min(1.5; 1.5) = 1.50 (dòng 1, academicAward='second-or-above')
      bonus = reward + encouragement = 1.50 + 1.00 = 2.50
      XT1 = 0.7×20.00 + 0.3×20.00 + 0 + 2.50 = 14.00 + 6.00 + 2.50 = 22.50
      XT2 = 20.00 + 0 + 2.50 = 22.50
      ĐXT = Max(22.50, 22.50) = 22.50
    `,
    input: {
      thpt: { subject1Score: 7, subject2Score: 7, subject3Score: 6 },
      transcript: { subject1Score: 7, subject2Score: 7, subject3Score: 6 },
      reward: { academicAward: 'second-or-above' },
      englishEncouragement30: 1.0,
    },
    expected: { thptTotal30: 20.0, transcriptTotal30: 20.0, xt1: 22.5, xt2: 22.5, finalScore: 22.5, eligible: true },
  },
  {
    id: 'iuh-2026-combined-ineligible-still-exact',
    schoolId: 'iuh',
    methodId: 'iuh-combined-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'iuh-quality-threshold-2026',
    sourceNote: 'Dưới ngưỡng đầu vào (18/30) nhưng exact score vẫn tính được — eligibility tách khỏi exact (cùng convention UFM/HCMUT).',
    derivation: `
      ĐTN = 5+5+5 = 15.00 (<18 → ineligible)
      ĐHB = 5+5+5 = 15.00
      XT1 = 0.7×15.00 + 0.3×15.00 = 15.00
      XT2 = 15.00
      ĐXT = Max(15.00, 15.00) = 15.00
    `,
    boundaryNote: 'Ineligible KHÔNG chặn exact score — chỉ chặn khả năng trúng tuyển thật.',
    input: { thpt: { subject1Score: 5, subject2Score: 5, subject3Score: 5 }, transcript: { subject1Score: 5, subject2Score: 5, subject3Score: 5 } },
    expected: { thptTotal30: 15.0, transcriptTotal30: 15.0, xt1: 15.0, xt2: 15.0, finalScore: 15.0, eligible: false },
  },
];
