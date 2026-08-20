import { round2 } from '../../core/round2';

/** Tổng thô 3 môn theo tổ hợp xét tuyển, thang 30, KHÔNG nhân hệ số môn nào (Thông báo 2415/TB-ĐHYD
 * mục 6.2.2). */
export interface UmpThreeSubjectInput {
  subject1Score: number;
  subject2Score: number;
  subject3Score: number;
}

export function calculateUmpRawScore(input: UmpThreeSubjectInput): number {
  return round2(input.subject1Score + input.subject2Score + input.subject3Score);
}

/** Điểm xét tuyển cuối = Tổng 3 môn + Điểm ưu tiên + Điểm khuyến khích, kẹp 30, làm tròn SAU KHI
 * cộng đầy đủ ưu tiên + khuyến khích (Thông báo 2415/TB-ĐHYD mục 3/6.2.2). */
export function calculateUmpFinalScore(input: { raw30: number; priority30: number; bonus30?: number }): number {
  return round2(Math.min(30, input.raw30 + input.priority30 + (input.bonus30 ?? 0)));
}
