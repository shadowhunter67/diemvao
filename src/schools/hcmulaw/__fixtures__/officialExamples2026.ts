import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { HcmulawThreeSubjectInput } from '../calculator';

/**
 * HCMULAW 2026 golden fixtures. Tier C (formula-derived, `hcmulaw-method-notice-2026`) cho Phương
 * thức 5; Tier A (official worked example, `hcmulaw-equivalence-notice-2026` trang V-SAT.png) cho
 * Phương thức 4 — ví dụ minh họa DUY NHẤT lấy nguyên văn từ văn bản gốc, không tự thiết kế case nội
 * suy khác (tránh rủi ro sai số hand-verify).
 */
export const hcmulawThpt5GoldenCases: GoldenAdmissionCase<
  HcmulawThreeSubjectInput & { priorityRegion?: string; priorityCategory?: string },
  { subjectGroupScore30: number; finalScore: number }
>[] = [
  {
    id: 'hcmulaw-2026-thpt5-standard-normal',
    schoolId: 'hcmulaw',
    methodId: 'hcmulaw-thpt5-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hcmulaw-method-notice-2026',
    sourceNote: 'ĐXT (PT5) = tổng thô 3 môn (không hệ số) + điểm ưu tiên, PT5 không có điểm cộng.',
    derivation: `
      subjectGroupScore30 = 7+7+7 = 21.00
      standardPriority30 = KV2 = 0.25 (không category)
      cappedTotal=21.00 < 22.5 -> KHÔNG giảm -> effectivePriority30 = 0.25
      finalScore = round(min(30, 21.00+0.25)) = 21.25
    `,
    input: { subject1Score: 7, subject2Score: 7, subject3Score: 7, priorityRegion: 'KV2' },
    expected: { subjectGroupScore30: 21, finalScore: 21.25 },
  },
];

/**
 * Tier A — ví dụ minh họa CHÍNH THỨC của văn bản gốc (mục 2.2, trang V-SAT.png, "MÔN TOÁN"): thí
 * sinh V-SAT môn Toán x=125 thuộc khoảng 10% (a=122,5 b=129,5 c=8,5 d=9,0) -> y≈8,68.
 */
export const hcmulawVsat4GoldenCases: GoldenAdmissionCase<{ subjectId: 'math'; x: number }, { y: number }>[] = [
  {
    id: 'hcmulaw-2026-vsat4-official-worked-example-math',
    schoolId: 'hcmulaw',
    methodId: 'hcmulaw-vsat4-2026',
    year: 2026,
    tier: 'A',
    sourceId: 'hcmulaw-equivalence-notice-2026',
    sourceNote: 'Ví dụ minh họa CHÍNH THỨC của văn bản (mục 2.2, ảnh V-SAT.png): "Thí sinh có điểm thi V-SAT môn Toán x = 125... thuộc thứ hạng 10%... y ≈ 8.68".',
    derivation: `
      x=125, khoảng 10% môn Toán: a=122.5 b=129.5 c=8.5 d=9.0
      y = c + (x-a)(d-c)/(b-a) = 8.5 + (125-122.5)(9.0-8.5)/(129.5-122.5) = 8.5 + (2.5*0.5)/7 = 8.5 + 0.1786 = 8.6786 -> làm tròn 2 chữ số = 8.68
    `,
    input: { subjectId: 'math', x: 125 },
    expected: { y: 8.68 },
  },
];
