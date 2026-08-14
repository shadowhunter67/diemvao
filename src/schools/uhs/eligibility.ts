import type { UhsProgramGroup } from './programs';

export const UHS_MEDICINE_LIKE_COMBINATION_THRESHOLD_30 = 20;
export const UHS_MEDICINE_LIKE_GRADUATION_THRESHOLD_10 = 8.5;
export const UHS_NURSING_COMBINATION_THRESHOLD_30 = 16.5;
export const UHS_NURSING_GRADUATION_THRESHOLD_10 = 6.5;

export type UhsAcademicPerformanceLevel = 'dat' | 'kha' | 'tot';

export interface UhsEntryEligibilityInput {
  programGroup: UhsProgramGroup;
  combinationTotal30?: number;
  grade12Performance?: UhsAcademicPerformanceLevel;
  graduationScore10?: number;
}

export interface EligibilityResult {
  pass: boolean;
  requiredText: string;
}

function performanceRank(level: UhsAcademicPerformanceLevel | undefined): number {
  if (level === 'tot') return 3;
  if (level === 'kha') return 2;
  if (level === 'dat') return 1;
  return 0;
}

export function checkUhsEntryEligibility(input: UhsEntryEligibilityInput): EligibilityResult {
  const isNursing = input.programGroup === 'nursing';
  const requiredPerformance: UhsAcademicPerformanceLevel = isNursing ? 'kha' : 'tot';
  const requiredCombination = isNursing ? UHS_NURSING_COMBINATION_THRESHOLD_30 : UHS_MEDICINE_LIKE_COMBINATION_THRESHOLD_30;
  const requiredGraduation = isNursing ? UHS_NURSING_GRADUATION_THRESHOLD_10 : UHS_MEDICINE_LIKE_GRADUATION_THRESHOLD_10;
  const hasPerformance = performanceRank(input.grade12Performance) >= performanceRank(requiredPerformance);
  const hasScorePath =
    (input.combinationTotal30 !== undefined && input.combinationTotal30 >= requiredCombination) ||
    (input.graduationScore10 !== undefined && input.graduationScore10 >= requiredGraduation);

  return {
    pass: hasPerformance && hasScorePath,
    requiredText: isNursing
      ? `Điều dưỡng: học lực lớp 12 từ Khá trở lên và tổng 3 môn THPT ≥ ${requiredCombination}/30 hoặc điểm xét tốt nghiệp ≥ ${requiredGraduation}/10.`
      : `Y khoa/Dược/Răng - Hàm - Mặt/Y học cổ truyền: học lực lớp 12 từ Tốt trở lên và tổng 3 môn THPT ≥ ${requiredCombination}/30 hoặc điểm xét tốt nghiệp ≥ ${requiredGraduation}/10.`,
  };
}
