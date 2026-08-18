import type { SourcedRule } from '../../core/evidence';
import { UEL_ALPHA_2026, UEL_BETA_2026, UEL_PRIORITY_REGION_POINTS_100, UEL_PRIORITY_CATEGORY_POINTS_100 } from './calculator';
import { REDUCTION_THRESHOLD, REDUCTION_DIVISOR } from './priorityReduction';
import { UEL_BONUS_OVERALL_CAP } from './data/bonus';
import { UEL_PRIORITY_SCHOOL_BONUS } from './data/thresholds';

/**
 * Batch provenance-hygiene (2026-08-18) — UEL đọc evidence thẳng inline trong `evaluate.ts` (evidence
 * trả ra `AdmissionEvaluation` cho user), khiến `verifiedRuntimeEvidence()` không phủ được UEL cho
 * `npm run audit:data`. File này KHÔNG thay evaluate.ts — chỉ là registry song song, theo đúng
 * convention `hcmus/evidence.ts` / `ussh/evidence.ts`: import ngược constants thật từ nơi định nghĩa
 * (calculator.ts/priorityReduction.ts/data/bonus.ts) để giá trị luôn khớp runtime, không hard-code
 * lại số.
 */
export const uelFormulaEvidence = {
  value: { beta1: UEL_BETA_2026.beta1, beta2: UEL_BETA_2026.beta2, beta3: UEL_BETA_2026.beta3, alpha: UEL_ALPHA_2026, prioritySchoolBonus: UEL_PRIORITY_SCHOOL_BONUS },
  evidence: [
    {
      sourceId: 'uel-formula-2026',
      location: 'Công thức Xét tuyển Tổng hợp: β1=55% ĐGNL/THPT, β2=35% THPT, β3=10% học bạ; α=1 cho ĐT2; điểm cộng trường ưu tiên +5/100',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ beta1: number; beta2: number; beta3: number; alpha: number; prioritySchoolBonus: number }>;

export const uelPriorityTableEvidence = {
  value: { regionPoints100: UEL_PRIORITY_REGION_POINTS_100, categoryPoints100: UEL_PRIORITY_CATEGORY_POINTS_100 },
  evidence: [
    {
      sourceId: 'uel-formula-2026',
      location: 'Bảng điểm ưu tiên khu vực/đối tượng quy đổi thang 100 (KV1=2.5, KV2-NT=1.67, KV2=0.83, KV3=0; UT1=6.67, UT2=3.33)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ regionPoints100: Record<string, number>; categoryPoints100: Record<string, number> }>;

export const uelCertificateBonusEvidence = {
  value: { overallCap: UEL_BONUS_OVERALL_CAP },
  evidence: [
    {
      sourceId: 'uel-certificate-bonus-html-2026',
      location: 'Bảng điểm cộng chứng chỉ tiếng Anh (IELTS/TOEFL iBT/TOEIC) trong trang Tổ hợp tuyển sinh, trần cộng điểm 10/100',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ overallCap: number }>;

export const uelPriorityReductionEvidence = {
  value: { threshold: REDUCTION_THRESHOLD, divisor: REDUCTION_DIVISOR },
  evidence: [
    {
      sourceId: 'uel-priority-reduction-2026',
      location: '(100 – Điểm học lực – Điểm cộng)/25 × Điểm ưu tiên quy đổi, áp dụng khi tổng ≥ 75/100',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ threshold: number; divisor: number }>;
