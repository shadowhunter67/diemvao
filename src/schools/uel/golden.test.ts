import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateUelFinalScore } from './calculator';
import { convertDgnlToScale100 } from './dgnlConversion';
import { uelGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — UEL 2026 exact calculator. Không có official worked example (xem
 * fixture header), toàn bộ Tier C từ β1/β2/β3 + quy tắc giảm ưu tiên đã verified.
 */
describe('UEL 2026 golden conformance (Tier C — sourceId uel-formula-2026 / uel-priority-reduction-2026)', () => {
  assertGoldenCaseProvenance(uelGoldenCases);

  it.each(uelGoldenCases)('$id', (goldenCase) => {
    const dgnlScale100 = convertDgnlToScale100(goldenCase.input.dgnlRaw1200);
    expect(dgnlScale100).not.toBeNull();

    const result = calculateUelFinalScore({ ...goldenCase.input, dgnlScale100: dgnlScale100! });

    expect(result.academicScore).toBe(goldenCase.expected.academicScore);
    expect(result.priority.effectivePriority).toBe(goldenCase.expected.priorityEffective);
    expect(result.finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('reduction boundary case crosses REDUCTION_THRESHOLD, normal case stays under it', () => {
    const [normal, boundary] = uelGoldenCases;
    const normalResult = calculateUelFinalScore({ ...normal.input, dgnlScale100: convertDgnlToScale100(normal.input.dgnlRaw1200)! });
    const boundaryResult = calculateUelFinalScore({ ...boundary.input, dgnlScale100: convertDgnlToScale100(boundary.input.dgnlRaw1200)! });
    expect(normalResult.priority.reduced).toBe(false);
    expect(boundaryResult.priority.reduced).toBe(true);
  });
});
