import { round2 } from '../../core/round2';
import { computeUehBonus, type UehBonusResult } from './bonus';
import { computeUehPriority, type UehPriorityObjectGroup, type UehPriorityResult, type UehPriorityZone } from './priority';

/**
 * Calculator chính xác UEH 2026 — Phương thức Xét tuyển tích hợp, Đối tượng 1 (thí sinh tốt
 * nghiệp THPT Việt Nam) CHỈ. Đối tượng 2 (THPT nước ngoài) dùng công thức học bạ khác (không có
 * cấu trúc lớp 10/11/12 kiểu Việt Nam) — KHÔNG hỗ trợ ở calculator này, xem `scopeNotes.ts`.
 *
 * Công thức (nguồn `ueh-ksa-ksv-info-2026` + `ueh-conversion-table-2026`, worked example verified
 * số học thật: ĐGNL 950→25.55/30 → (25.55×100/30)×0.6=51.10; học bạ 8.6/10 → (8.6×10)×0.4=34.40;
 * +5 điểm cộng = 90.50):
 *
 *   Điểm thi (thang 100) = (Điểm thi thang 30 × 100/30) × 0.6
 *   Điểm học bạ (thang 100) = (ĐTB các năm học THPT × 10) × 0.4
 *   ĐTB các năm học THPT = (ĐTB lớp 10×1 + ĐTB lớp 11×2 + ĐTB lớp 12×3) / 6
 *   Điểm xét (trước ưu tiên) = Điểm thi + Điểm học bạ + Điểm cộng
 *   Điểm xét tuyển cuối = Điểm xét (trước ưu tiên) + Điểm ưu tiên KV/ĐT
 */
export interface UehExactCalculatorInput {
  /** Điểm thi thang 30 — hoặc điểm thi tốt nghiệp THPT tổ hợp thô, hoặc điểm THPT tương đương đã
   * quy đổi từ ĐGNL/V-SAT qua `convertDgnlToThpt`. */
  examScore30: number;
  gpaGrade10: number;
  gpaGrade11: number;
  gpaGrade12: number;
  bonusIds: readonly string[];
  priorityZone: UehPriorityZone;
  priorityObjectGroup: UehPriorityObjectGroup;
}

export interface UehExactCalculatorResult {
  transcriptAverage10: number;
  examScaled100: number;
  transcriptScaled100: number;
  /** Điểm xét tuyển thang 100, CHƯA gồm điểm cộng/ưu tiên — đúng cơ sở UEH dùng để so ngưỡng đảm
   * bảo chất lượng đầu vào (65/60), xem `eligibility.ts`. */
  admissionScoreBeforeBonus: number;
  bonus: UehBonusResult;
  totalBeforePriority: number;
  priority: UehPriorityResult;
  finalScore: number;
}

export function calculateUehExactScore(input: UehExactCalculatorInput): UehExactCalculatorResult {
  const transcriptAverage10 = round2(
    (input.gpaGrade10 * 1 + input.gpaGrade11 * 2 + input.gpaGrade12 * 3) / 6
  );
  const examScaled100 = round2((input.examScore30 * 100) / 30);
  const transcriptScaled100 = round2(transcriptAverage10 * 10);
  const admissionScoreBeforeBonus = round2(examScaled100 * 0.6 + transcriptScaled100 * 0.4);
  const bonus = computeUehBonus(input.bonusIds);
  const totalBeforePriority = round2(admissionScoreBeforeBonus + bonus.total);
  const priority = computeUehPriority(input.priorityZone, input.priorityObjectGroup, totalBeforePriority);
  const finalScore = round2(totalBeforePriority + priority.received);

  return {
    transcriptAverage10,
    examScaled100,
    transcriptScaled100,
    admissionScoreBeforeBonus,
    bonus,
    totalBeforePriority,
    priority,
    finalScore,
  };
}
