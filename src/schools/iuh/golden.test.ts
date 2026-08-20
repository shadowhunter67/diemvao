import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateIuhThptTotal, calculateIuhTranscriptTotal, calculateIuhXt1, calculateIuhXt2, calculateIuhCombinedFinalScore } from './calculator';
import { checkIuhStandardThreshold } from './eligibility';
import { lookupIuhStandardPriority30, calculateIuhPriority30 } from './priority';
import { calculateIuhReward30, calculateIuhTotalBonus30 } from './bonus';
import { iuhCombinedGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — IUH 2026 xét tuyển kết hợp, phạm vi KHÔNG có ĐGNL (xem `methods.ts`).
 * Test qua đúng chuỗi hàm thật (ĐTN/ĐHB → ưu tiên → cộng → XT1/XT2 → Max) — không gọi
 * `evaluateIuhCombinedAdmission` (test đó ở `evaluate.test.ts`, tách biệt logic missing-input/partial
 * khỏi domain conformance thuần).
 */
describe('IUH 2026 golden conformance — xét tuyển kết hợp (Tier C — sourceId iuh-formula-2026/iuh-quality-threshold-2026/iuh-bonus-appendix-2026)', () => {
  assertGoldenCaseProvenance(iuhCombinedGoldenCases);

  it.each(iuhCombinedGoldenCases)('$id', (goldenCase) => {
    const thptTotal30 = calculateIuhThptTotal(goldenCase.input.thpt);
    expect(thptTotal30).toBe(goldenCase.expected.thptTotal30);

    const transcriptTotal30 = calculateIuhTranscriptTotal(goldenCase.input.transcript);
    expect(transcriptTotal30).toBe(goldenCase.expected.transcriptTotal30);

    const threshold = checkIuhStandardThreshold(thptTotal30);
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const standardPriority30 = lookupIuhStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateIuhPriority30({ academicScore30: thptTotal30, standardPriority30 });

    const reward = calculateIuhReward30(goldenCase.input.reward ?? {});
    const bonus30 = calculateIuhTotalBonus30({ reward30: reward.total30, encouragement30: goldenCase.input.englishEncouragement30 ?? 0 });

    const xt1 = calculateIuhXt1({ thptTotal30, transcriptTotal30, priority30: priority.effectivePriority30, bonus30 });
    expect(xt1).toBe(goldenCase.expected.xt1);

    const xt2 = calculateIuhXt2({ thptTotal30, priority30: priority.effectivePriority30, bonus30 });
    expect(xt2).toBe(goldenCase.expected.xt2);

    const finalScore = calculateIuhCombinedFinalScore({ xt1, xt2 });
    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('priority reduction only triggers at/above 22.5/30', () => {
    const reduced = iuhCombinedGoldenCases.find((c) => c.id === 'iuh-2026-combined-priority-reduction-boundary')!;
    const notReduced = iuhCombinedGoldenCases.find((c) => c.id === 'iuh-2026-combined-xt2-wins')!;
    expect(calculateIuhThptTotal(reduced.input.thpt)).toBeGreaterThanOrEqual(22.5);
    expect(reduced.input.priorityRegion).toBe('KV1');
    expect(notReduced.input.priorityRegion).toBeUndefined();
  });

  it('XT2 (thuần thi TN) có thể thắng XT1 (kết hợp học bạ) khi ĐHB thấp hơn ĐTN đáng kể', () => {
    const goldenCase = iuhCombinedGoldenCases.find((c) => c.id === 'iuh-2026-combined-xt2-wins')!;
    expect(goldenCase.expected.xt2).toBeGreaterThan(goldenCase.expected.xt1);
    expect(goldenCase.expected.finalScore).toBe(goldenCase.expected.xt2);
  });

  it('ineligible (dưới ngưỡng đầu vào) vẫn trả exact score — eligibility tách khỏi exact', () => {
    const goldenCase = iuhCombinedGoldenCases.find((c) => c.id === 'iuh-2026-combined-ineligible-still-exact')!;
    expect(goldenCase.expected.eligible).toBe(false);
    expect(goldenCase.expected.finalScore).toBe(15.0);
  });
});
