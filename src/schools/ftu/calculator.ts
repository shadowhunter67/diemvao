import { round2 } from '../../core/round2';

export type FtuDomesticExam = 'hsa' | 'vact' | 'tsa';
export type FtuProgramGroup = 'standard30' | 'integrated40';

export const FTU_DOMESTIC_EXAM_MIN_SCORE: Record<FtuDomesticExam, number> = {
  hsa: 100,
  vact: 850,
  tsa: 70,
};

export function checkFtuDomesticExamThreshold(exam: FtuDomesticExam, rawScore: number): { pass: boolean; requiredText: string } {
  const threshold = FTU_DOMESTIC_EXAM_MIN_SCORE[exam];
  const label = exam === 'vact' ? 'V-ACT' : exam.toUpperCase();
  return { pass: rawScore >= threshold, requiredText: `${label} >= ${threshold}` };
}

export function convertFtuDomesticExamToBaseScore(input: { exam: FtuDomesticExam; rawScore: number; programGroup: FtuProgramGroup }): number {
  const offset = input.exam === 'hsa' ? 100 : input.exam === 'vact' ? 850 : 70;
  const divisor = input.exam === 'hsa' ? 50 : input.exam === 'vact' ? 350 : 30;
  const base30 = 27 + ((input.rawScore - offset) * 3) / divisor;
  return round2(input.programGroup === 'integrated40' ? (base30 * 4) / 3 : base30);
}

export function scaleFtuBonus30(input: { bonus30: number; programGroup: FtuProgramGroup }): number {
  const capped30 = Math.min(Math.max(input.bonus30, 0), 3);
  return round2(input.programGroup === 'integrated40' ? (capped30 * 4) / 3 : capped30);
}

