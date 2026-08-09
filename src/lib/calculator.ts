import type { AdmissionConfig, ScoreBreakdown, ScoreInput } from '../types/admission';

export function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Điểm ĐGNL / THPT / học bạ ở đây được coi là đã quy đổi về thang 100.
 * Khi có công thức quy đổi chính thức từ điểm gốc, thêm các hàm
 * convertDgnlScore/convertThptScore/convertTranscriptScore vào module này
 * và gọi trước khi truyền vào calculateScore, không cần sửa UI.
 */
export function calculateScore(input: ScoreInput, config: AdmissionConfig): ScoreBreakdown {
  const dgnlContribution = input.dgnl * config.weights.dgnl;
  const thptContribution = input.thpt * config.weights.thpt;
  const transcriptContribution = input.transcript * config.weights.transcript;
  const academicScore = dgnlContribution + thptContribution + transcriptContribution;
  const finalScore = academicScore + input.bonus + input.priority;

  return {
    dgnlContribution: roundTo2(dgnlContribution),
    thptContribution: roundTo2(thptContribution),
    transcriptContribution: roundTo2(transcriptContribution),
    academicScore: roundTo2(academicScore),
    bonus: roundTo2(input.bonus),
    priority: roundTo2(input.priority),
    finalScore: roundTo2(finalScore),
  };
}
