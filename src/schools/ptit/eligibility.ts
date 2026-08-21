export type PtitDomesticExam = 'tsa' | 'hsa' | 'vact' | 'spt';

export const PTIT_DOMESTIC_EXAM_THRESHOLDS: Record<PtitDomesticExam, number> = {
  tsa: 50,
  hsa: 75,
  vact: 600,
  spt: 15,
};

export function checkPtitDomesticExamThreshold(exam: PtitDomesticExam, rawScore: number): { pass: boolean; requiredText: string } {
  const threshold = PTIT_DOMESTIC_EXAM_THRESHOLDS[exam];
  const label = exam === 'vact' ? 'V-ACT' : exam.toUpperCase();
  return { pass: rawScore >= threshold, requiredText: `${label} >= ${threshold}` };
}

