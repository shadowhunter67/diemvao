/**
 * Metadata mở rộng cho một điểm chuẩn — bổ sung các chiều mà cutoff dài hạn có thể phụ thuộc
 * (phương thức, campus, tổ hợp, đối tượng, đợt xét) NGOÀI school/year/programId đã có sẵn ở mỗi
 * `<School>Cutoff` hiện tại. Additive, optional — không migrate schema cutoff hiện có của
 * HCMUT/UIT/UEL/UEH, chỉ demo cách join ra context này ở nơi thật sự có nuance (xem
 * `schools/ueh/cutoffContext.ts`, UEH có 2 campus hcmc/mekong).
 */
export interface CutoffContext {
  methodId?: string;
  campusId?: string;
  combinationId?: string;
  applicantTypeId?: string;
  round?: string;
  scoreScale?: number;
}
