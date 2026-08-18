import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateUfmThptRawScore, calculateUfmThptFinalScore, calculateUfmDgnlFinalScore } from './calculator';
import { checkUfmThptThreshold, checkUfmDgnlThreshold } from './eligibility';
import { lookupUfmStandardPriority30, calculateUfmPriority30, calculateUfmPriority1200 } from './priority';
import { ufmThptGoldenCases, ufmDgnlGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — UFM 2026 exact calculators (xét THPT / xét ĐGNL), phạm vi ĐC=0, chương
 * trình Chuẩn (xem `methods.ts`). Test qua đúng chuỗi hàm (raw/eligibility → ưu tiên → final) gọi
 * thật. Case Luật kinh tế truyền `subject1Score` làm điểm Toán (khớp derivation trong fixture).
 */
describe('UFM 2026 golden conformance — xét THPT (Tier C — sourceId ufm-quality-threshold-2026/ufm-admission-plan-2026)', () => {
  assertGoldenCaseProvenance(ufmThptGoldenCases);

  it.each(ufmThptGoldenCases)('$id', (goldenCase) => {
    const raw30 = calculateUfmThptRawScore(goldenCase.input);
    expect(raw30).toBe(goldenCase.expected.raw30);

    const threshold = checkUfmThptThreshold({
      total30: raw30,
      group: goldenCase.input.group,
      mathRawScore: goldenCase.input.subject1Score,
      subjectRawScores: [goldenCase.input.subject1Score, goldenCase.input.subject2Score, goldenCase.input.subject3Score],
    });
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const standardPriority30 = lookupUfmStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateUfmPriority30({ academicScore30: raw30, standardPriority30 });
    const finalScore = calculateUfmThptFinalScore({ raw30, priority30: priority.effectivePriority30 });

    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('law-economics branch fails independently on the Toán≥6 sub-condition even when the total meets 20/30', () => {
    const passCase = ufmThptGoldenCases.find((c) => c.id === 'ufm-2026-thpt-law-economics-pass')!;
    const failCase = ufmThptGoldenCases.find((c) => c.id === 'ufm-2026-thpt-law-economics-fails-math-floor')!;
    expect(calculateUfmThptRawScore(failCase.input)).toBeGreaterThanOrEqual(20);
    expect(failCase.expected.eligible).toBe(false);
    expect(passCase.expected.eligible).toBe(true);
  });

  it('priority reduction only triggers at/above 22.5/30', () => {
    const reduced = ufmThptGoldenCases.find((c) => c.id === 'ufm-2026-thpt-priority-reduction-boundary')!;
    const notReduced = ufmThptGoldenCases.find((c) => c.id === 'ufm-2026-thpt-standard-normal')!;
    expect(calculateUfmThptRawScore(reduced.input)).toBeGreaterThanOrEqual(22.5);
    expect(calculateUfmThptRawScore(notReduced.input)).toBeLessThan(22.5);
  });
});

describe('UFM 2026 golden conformance — xét ĐGNL (Tier C)', () => {
  assertGoldenCaseProvenance(ufmDgnlGoldenCases);

  it.each(ufmDgnlGoldenCases)('$id', (goldenCase) => {
    const threshold = checkUfmDgnlThreshold(goldenCase.input.dgnlScore1200, goldenCase.input.group);
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const standardPriority30 = lookupUfmStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateUfmPriority1200({ dgnlScore1200: goldenCase.input.dgnlScore1200, standardPriority30 });
    const finalScore = calculateUfmDgnlFinalScore({ dgnlScore1200: goldenCase.input.dgnlScore1200, priority1200: priority.effectivePriority1200 });

    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('priority reduction only triggers at/above 900/1200', () => {
    const reduced = ufmDgnlGoldenCases.find((c) => c.id === 'ufm-2026-dgnl-priority-reduction-boundary')!;
    const notReduced = ufmDgnlGoldenCases.find((c) => c.id === 'ufm-2026-dgnl-standard-normal')!;
    expect(reduced.input.dgnlScore1200).toBeGreaterThanOrEqual(900);
    expect(notReduced.input.dgnlScore1200).toBeLessThan(900);
  });
});
