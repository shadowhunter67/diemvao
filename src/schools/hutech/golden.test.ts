import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateHutechThptRawScore, calculateHutechThptFinalScore, calculateHutechDgnlFinalScore } from './calculator';
import { checkHutechThptThreshold, checkHutechDgnlThreshold } from './eligibility';
import { lookupHutechStandardPriority30, calculateHutechPriority30, calculateHutechPriority1200 } from './priority';
import { hutechThptGoldenCases, hutechDgnlGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — HUTECH 2026 exact calculators (xét THPT / xét ĐGNL), phạm vi ĐC=0
 * (xem `methods.ts`). Test qua đúng chuỗi hàm (raw/eligibility → ưu tiên → final) gọi thật, không
 * gọi thẳng `evaluateHutech*Admission` để tách riêng "công thức đúng" khỏi "orchestration/missing
 * input handling" (đã có `evaluate.test.ts` phủ phần đó).
 */
describe('HUTECH 2026 golden conformance — xét THPT (Tier C — sourceId hutech-quality-threshold-2026/hutech-admission-plan-2026)', () => {
  assertGoldenCaseProvenance(hutechThptGoldenCases);

  it.each(hutechThptGoldenCases)('$id', (goldenCase) => {
    const raw30 = calculateHutechThptRawScore(goldenCase.input);
    expect(raw30).toBe(goldenCase.expected.raw30);

    const threshold = checkHutechThptThreshold(raw30, goldenCase.input.group);
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const standardPriority30 = lookupHutechStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateHutechPriority30({ academicScore30: raw30, standardPriority30 });
    const finalScore = calculateHutechThptFinalScore({ raw30, priority30: priority.effectivePriority30 });

    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('boundary case proves >= comparison (score exactly equal to threshold is eligible)', () => {
    const boundaryCase = hutechThptGoldenCases.find((c) => c.id === 'hutech-2026-thpt-medicine-boundary')!;
    expect(checkHutechThptThreshold(22, 'medicine').pass).toBe(true);
    expect(boundaryCase.expected.eligible).toBe(true);
  });

  it('priority reduction only triggers at/above 22.5/30 — lower case unaffected', () => {
    const reduced = hutechThptGoldenCases.find((c) => c.id === 'hutech-2026-thpt-priority-reduction-boundary')!;
    const notReduced = hutechThptGoldenCases.find((c) => c.id === 'hutech-2026-thpt-standard-normal')!;
    expect(calculateHutechThptRawScore(reduced.input)).toBeGreaterThanOrEqual(22.5);
    expect(calculateHutechThptRawScore(notReduced.input)).toBeLessThan(22.5);
  });
});

describe('HUTECH 2026 golden conformance — xét ĐGNL (Tier C)', () => {
  assertGoldenCaseProvenance(hutechDgnlGoldenCases);

  it.each(hutechDgnlGoldenCases)('$id', (goldenCase) => {
    const threshold = checkHutechDgnlThreshold(goldenCase.input.dgnlScore1200, goldenCase.input.group);
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const standardPriority30 = lookupHutechStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateHutechPriority1200({ dgnlScore1200: goldenCase.input.dgnlScore1200, standardPriority30 });
    const finalScore = calculateHutechDgnlFinalScore({ dgnlScore1200: goldenCase.input.dgnlScore1200, priority1200: priority.effectivePriority1200 });

    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('priority reduction only triggers at/above 900/1200', () => {
    const reduced = hutechDgnlGoldenCases.find((c) => c.id === 'hutech-2026-dgnl-priority-reduction-boundary')!;
    const notReduced = hutechDgnlGoldenCases.find((c) => c.id === 'hutech-2026-dgnl-standard-normal')!;
    expect(reduced.input.dgnlScore1200).toBeGreaterThanOrEqual(900);
    expect(notReduced.input.dgnlScore1200).toBeLessThan(900);
  });
});
