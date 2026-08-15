import { round2 } from '../../core/round2';
import { calculateUelBonus } from './bonus';
import { calculateUelEffectivePriority } from './priorityReduction';

export type UelApplicantType = 'dt1' | 'dt2' | 'dt3';

export interface UelScoreInput {
  applicantType: UelApplicantType;
  dgnlScale100?: number;
  thptScale100?: number;
  transcriptScale100: number;
  certificateBonus?: number;
  prioritySchool?: boolean;
  standardPriority100: number;
}

export const UEL_ALPHA_2026 = 1;
export const UEL_BETA_2026 = {
  beta1: 0.55,
  beta2: 0.35,
  beta3: 0.1,
} as const;

export const UEL_PRIORITY_REGION_POINTS_100: Record<string, number> = {
  KV1: 2.5,
  'KV2-NT': 1.67,
  KV2: 0.83,
  KV3: 0,
};

export const UEL_PRIORITY_CATEGORY_POINTS_100: Record<string, number> = {
  UT1: 6.67,
  UT2: 3.33,
};

export function lookupUelStandardPriority(region: string | undefined, category: string | undefined): number {
  return (region ? (UEL_PRIORITY_REGION_POINTS_100[region] ?? 0) : 0) + (category ? (UEL_PRIORITY_CATEGORY_POINTS_100[category] ?? 0) : 0);
}

export function calculateUelAcademicScore(input: UelScoreInput): number {
  const { beta1, beta2, beta3 } = UEL_BETA_2026;
  if (input.applicantType === 'dt1') {
    if (input.dgnlScale100 === undefined || input.thptScale100 === undefined) throw new Error('UEL DT1 requires DGNL and THPT.');
    return round2(input.dgnlScale100 * beta1 + input.thptScale100 * beta2 + input.transcriptScale100 * beta3);
  }
  if (input.applicantType === 'dt2') {
    if (input.thptScale100 === undefined) throw new Error('UEL DT2 requires THPT.');
    return round2(input.thptScale100 * UEL_ALPHA_2026 * beta1 + input.thptScale100 * beta2 + input.transcriptScale100 * beta3);
  }
  if (input.dgnlScale100 === undefined) throw new Error('UEL DT3 requires DGNL.');
  return round2(input.dgnlScale100 * beta1 + input.dgnlScale100 * beta2 + input.transcriptScale100 * beta3);
}

export function calculateUelFinalScore(input: UelScoreInput) {
  const academicScore = calculateUelAcademicScore(input);
  const bonus = calculateUelBonus({ certificateBonus: input.certificateBonus, prioritySchool: input.prioritySchool });
  const academicPlusBonus = Math.min(100, round2(academicScore + bonus));
  const priority = calculateUelEffectivePriority({ academicPlusBonus, standardPriority: input.standardPriority100 });
  const finalScore = round2(Math.min(100, academicPlusBonus + priority.effectivePriority));
  return { academicScore, bonus, priority, finalScore };
}
