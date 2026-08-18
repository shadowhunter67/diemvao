import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { UehExactCalculatorInput } from '../calculator';

/**
 * Tier A — nguồn `ueh-conversion-table-2026` công bố NGUYÊN VĂN 1 ví dụ tính điểm hoàn chỉnh (xem
 * `evidence.ts:uehFinalConversionEvidence`, transcribe từ trang chính thức UEH):
 *
 *   "[(25.55×100)/30]×0.6=51.10 + (8.6×10)×0.4=34.40 → 90.50 (kèm 5.0 điểm cộng)"
 *
 * 25.55 (thang 30) chính là kết quả quy đổi ĐGNL 950 → 25.55 đã có fixture riêng
 * (`dgnlConversion.fixtures.ts`, id `ueh-dgnl-950-to-2555`) — case này test bước TIẾP THEO (từ
 * điểm thi thang 30 → điểm xét tuyển cuối, gồm cả học bạ + điểm cộng), dùng lại đúng số 25.55
 * nguồn đã công bố (KHÔNG re-derive từ 950 ở đây, tránh 2 fixture cùng test 1 việc).
 */
export const uehOfficialFinalConversionCase: GoldenAdmissionCase<
  UehExactCalculatorInput,
  { examScaled100: number; transcriptScaled100: number; admissionScoreBeforeBonus: number; finalScore: number }
> = {
  id: 'ueh-2026-official-worked-example-950-8point6-bonus5',
  schoolId: 'ueh',
  methodId: 'ueh-integrated-2026',
  year: 2026,
  tier: 'A',
  sourceId: 'ueh-conversion-table-2026',
  sourceNote:
    'Ví dụ tính điểm hoàn chỉnh công bố nguyên văn trên trang chính thức UEH: examScore30=25.55 (đã là kết quả quy đổi ĐGNL 950 theo bảng, xem ueh-dgnl-950-to-2555), transcriptAverage10=8.6, bonus=+5.0 → 90.50.',
  input: {
    examScore30: 25.55,
    gpaGrade10: 8.6,
    gpaGrade11: 8.6,
    gpaGrade12: 8.6, // 3 năm bằng nhau → trung bình có trọng số (1:2:3) vẫn ra đúng 8.6 như nguồn đã cho.
    bonusIds: ['hsg-tinh-nhat'], // reward 5.0 — khớp "kèm 5.0 điểm cộng" trong nguồn.
    priorityZone: 'kv3', // 0 điểm — nguồn không đề cập ưu tiên trong ví dụ này.
    priorityObjectGroup: 'none', // 0 điểm.
  },
  expected: {
    examScaled100: 85.17, // round2(25.55×100/30) — nguồn viết gọn "51.10" là SAU khi ×0.6, không phải giá trị examScaled100 riêng.
    transcriptScaled100: 86.0, // 8.6×10
    admissionScoreBeforeBonus: 85.5, // 51.10 + 34.40 (đúng nguyên văn nguồn)
    finalScore: 90.5, // đúng nguyên văn nguồn
  },
};

/**
 * Tier C — priority KHÔNG có trong worked example gốc nên phần dưới đây tự derive theo constants
 * đã verified (`sourceId: ueh-ksa-ksv-info-2026`: bảng ưu tiên khu vực/đối tượng + ngưỡng giảm 75,
 * chia 25 — xem `priority.ts`).
 */
export const uehGoldenCases: GoldenAdmissionCase<UehExactCalculatorInput, { admissionScoreBeforeBonus: number; priorityReceived: number; finalScore: number }>[] = [
  {
    id: 'ueh-2026-formula-derived-normal-no-reduction',
    schoolId: 'ueh',
    methodId: 'ueh-integrated-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ueh-ksa-ksv-info-2026',
    sourceNote: 'Bảng điểm ưu tiên KV1=2.5/ĐT1-3=6.67 (thang 100) + ngưỡng giảm 75 — verified.',
    derivation: `
      examScore30=15 → examScaled100=round2(15×100/30)=50.00
      gpaGrade10/11/12=5 → transcriptAverage10=5.00 → transcriptScaled100=round2(5×10)=50.00
      admissionScoreBeforeBonus=round2(50×0.6+50×0.4)=50.00
      bonus: [] → total=0
      totalBeforePriority=50.00 (< 75 → KHÔNG giảm)
      priority: zone=kv1(2.5)+object=dt1-3(6.67) → basePoints=9.17 → received=9.17 (full, không giảm)
      finalScore=round2(50.00+9.17)=59.17
    `,
    boundaryNote: 'Control case — totalBeforePriority (50) dưới UEH_PRIORITY_REDUCTION_THRESHOLD (75).',
    input: { examScore30: 15, gpaGrade10: 5, gpaGrade11: 5, gpaGrade12: 5, bonusIds: [], priorityZone: 'kv1', priorityObjectGroup: 'dt1-3' },
    expected: { admissionScoreBeforeBonus: 50.0, priorityReceived: 9.17, finalScore: 59.17 },
  },
  {
    id: 'ueh-2026-formula-derived-priority-reduction-boundary',
    schoolId: 'ueh',
    methodId: 'ueh-integrated-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ueh-ksa-ksv-info-2026',
    sourceNote: 'Cùng bảng ưu tiên/threshold, dùng lại admissionScoreBeforeBonus=85.50 từ ví dụ chính thức (worked example) để kiểm tra nhánh giảm dần.',
    derivation: `
      Tái dùng examScore30=25.55, gpa=8.6/8.6/8.6 (giống ví dụ chính thức) → admissionScoreBeforeBonus=85.50
      bonus: [] → total=0 → totalBeforePriority=85.50 (>= 75 → KÍCH HOẠT giảm)
      priority: zone=kv3(0)+object=dt4-6(3.33) → basePoints=3.33
        received = ((100-85.50)/25) × 3.33 = (14.5/25)×3.33 = 0.58×3.33 = 1.9314
        LƯU Ý: computeUehPriority() KHÔNG round2() field "received" (khác UEL/IU/HCMUS — 3 trường
        đó ĐỀU round2 kết quả giảm ưu tiên). Phát hiện khi verify fixture này, KHÔNG sửa code (chưa
        có nguồn xác nhận UEH round hay không round ở bước này) — golden expected phản ánh ĐÚNG
        hành vi hiện tại, xem final report mục "rounding decisions".
      finalScore = round2(85.50 + 1.9314) = round2(87.4314) = 87.43 (finalScore CÓ round2 riêng)
    `,
    boundaryNote: 'Boundary anchor: UEH_PRIORITY_REDUCTION_THRESHOLD (75) — totalBeforePriority=85.50 vượt ngưỡng, kích hoạt nhánh giảm dần.',
    input: { examScore30: 25.55, gpaGrade10: 8.6, gpaGrade11: 8.6, gpaGrade12: 8.6, bonusIds: [], priorityZone: 'kv3', priorityObjectGroup: 'dt4-6' },
    expected: { admissionScoreBeforeBonus: 85.5, priorityReceived: 1.9314, finalScore: 87.43 },
  },
];
