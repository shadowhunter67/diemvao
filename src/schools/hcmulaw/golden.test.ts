import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateHcmulawSubjectGroupScore, calculateHcmulawThpt5FinalScore } from './calculator';
import { calculateHcmulawPriority30, lookupHcmulawStandardPriority30 } from './priority';
import { convertHcmulawVsatSubjectScore } from './conversionTable';
import { hcmulawThpt5GoldenCases, hcmulawVsat4GoldenCases } from './__fixtures__/officialExamples2026';

describe('HCMULAW 2026 golden conformance — Phương thức 5, thi TN THPT (Tier C — sourceId hcmulaw-method-notice-2026)', () => {
  assertGoldenCaseProvenance(hcmulawThpt5GoldenCases);

  it.each(hcmulawThpt5GoldenCases)('$id', (goldenCase) => {
    const subjectGroupScore30 = calculateHcmulawSubjectGroupScore(goldenCase.input);
    expect(subjectGroupScore30).toBe(goldenCase.expected.subjectGroupScore30);

    const standardPriority30 = lookupHcmulawStandardPriority30(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateHcmulawPriority30({ academicScore30: subjectGroupScore30, standardPriority30 });
    const finalScore = calculateHcmulawThpt5FinalScore({ subjectGroupScore30, priority30: priority.effectivePriority30 });
    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });
});

describe('HCMULAW 2026 golden conformance — Phương thức 4, V-SAT (Tier A official worked example — sourceId hcmulaw-equivalence-notice-2026)', () => {
  assertGoldenCaseProvenance(hcmulawVsat4GoldenCases);

  it.each(hcmulawVsat4GoldenCases)('$id', (goldenCase) => {
    const y = convertHcmulawVsatSubjectScore(goldenCase.input.subjectId, goldenCase.input.x);
    expect(y).toBe(goldenCase.expected.y);
  });
});
