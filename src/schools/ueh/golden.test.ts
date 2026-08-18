import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateUehExactScore } from './calculator';
import { uehOfficialFinalConversionCase, uehGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — UEH 2026 exact calculator. `uehOfficialFinalConversionCase` là
 * Tier A: input/output đều LẤY NGUYÊN VĂN từ trang chính thức UEH (xem `evidence.ts`), KHÔNG tính
 * bằng cách gọi `calculateUehExactScore`. `uehGoldenCases` là Tier C (priority không có trong ví
 * dụ gốc, derive từ bảng ưu tiên đã verified).
 */
describe('UEH 2026 official worked example (Tier A, sourceId ueh-conversion-table-2026)', () => {
  it(uehOfficialFinalConversionCase.id, () => {
    const result = calculateUehExactScore(uehOfficialFinalConversionCase.input);

    // Intermediate assertions — khớp ĐÚNG các số trung gian nguồn đã công bố (51.10/34.40), không
    // chỉ final score, để 2 lỗi triệt tiêu nhau (vd sai hệ số thi + sai hệ số học bạ) không lọt qua.
    expect(result.examScaled100).toBe(uehOfficialFinalConversionCase.expected.examScaled100);
    expect(result.transcriptScaled100).toBe(uehOfficialFinalConversionCase.expected.transcriptScaled100);
    expect(result.admissionScoreBeforeBonus).toBe(uehOfficialFinalConversionCase.expected.admissionScoreBeforeBonus);
    expect(result.finalScore).toBe(uehOfficialFinalConversionCase.expected.finalScore);
    expect(result.bonus.total).toBe(5.0);
  });
});

describe('UEH 2026 golden conformance (Tier C — priority, sourceId ueh-ksa-ksv-info-2026)', () => {
  assertGoldenCaseProvenance(uehGoldenCases);

  it.each(uehGoldenCases)('$id', (goldenCase) => {
    const result = calculateUehExactScore(goldenCase.input);
    expect(result.admissionScoreBeforeBonus).toBe(goldenCase.expected.admissionScoreBeforeBonus);
    expect(result.priority.received).toBe(goldenCase.expected.priorityReceived);
    expect(result.finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('reduction boundary case crosses the documented threshold, normal case stays under it', () => {
    const [normal, boundary] = uehGoldenCases;
    expect(calculateUehExactScore(normal.input).totalBeforePriority).toBeLessThan(75);
    expect(calculateUehExactScore(boundary.input).totalBeforePriority).toBeGreaterThanOrEqual(75);
    expect(calculateUehExactScore(boundary.input).priority.reduced).toBe(true);
    expect(calculateUehExactScore(normal.input).priority.reduced).toBe(false);
  });
});
