import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateAdmissionScore, calculateAdmissionScoreNoDgnl } from './calculator/calculator';
import { activeAdmissionConfig } from './config/admission-2026';
import { hcmutGoldenCases, hcmutNoDgnlGoldenCase } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — HCMUT KHÔNG có official worked example (xem
 * `evidence.ts:HCMUT_MISSING_OFFICIAL_WORKED_EXAMPLE`), nên toàn bộ case ở đây là Tier C
 * (formula-derived, xem `__fixtures__/officialExamples2026.ts` cho phép tính thủ công đầy đủ).
 * Expected values KHÔNG được sinh ra bằng cách gọi `calculateAdmissionScore` — chúng được tính tay
 * TRƯỚC, ghi trong `derivation`, rồi test dưới đây gọi implementation thật để so khớp.
 */
describe('HCMUT 2026 golden conformance (Tier C — formula-derived, sourceId hcmut-admission-scheme-2026)', () => {
  assertGoldenCaseProvenance(hcmutGoldenCases);

  it.each(hcmutGoldenCases)('$id', (goldenCase) => {
    const result = calculateAdmissionScore(goldenCase.input, activeAdmissionConfig);

    // Final + component assertions — không chỉ final score, để 2 bug triệt tiêu nhau không lọt qua.
    expect(result.finalScore).toBe(goldenCase.expected.finalScore);
    expect(result.academic.score).toBe(goldenCase.expected.academicScore);
    expect(result.bonus.received).toBe(goldenCase.expected.bonusReceived);
    expect(result.priority.received).toBe(goldenCase.expected.priorityReceived);
  });

  it('priority reduction boundary case actually crosses the documented threshold (baseScore >= 75)', () => {
    const boundary = hcmutGoldenCases.find((c) => c.id === 'hcmut-2026-formula-derived-priority-reduction-boundary')!;
    const result = calculateAdmissionScore(boundary.input, activeAdmissionConfig);
    expect(result.baseScore).toBeGreaterThanOrEqual(activeAdmissionConfig.priority.reductionThreshold);
  });

  it('normal case stays below the priority reduction threshold (control case for the boundary above)', () => {
    const normal = hcmutGoldenCases.find((c) => c.id === 'hcmut-2026-formula-derived-normal')!;
    const result = calculateAdmissionScore(normal.input, activeAdmissionConfig);
    expect(result.baseScore).toBeLessThan(activeAdmissionConfig.priority.reductionThreshold);
  });

  it('bonus+final cap case actually triggers both documented caps', () => {
    const capCase = hcmutGoldenCases.find((c) => c.id === 'hcmut-2026-formula-derived-bonus-and-final-cap')!;
    const rawBonus = capCase.input.bonus.reward + capCase.input.bonus.considerationReward + capCase.input.bonus.encouragement;
    expect(rawBonus).toBeGreaterThan(activeAdmissionConfig.bonus.maxTotal);
    const result = calculateAdmissionScore(capCase.input, activeAdmissionConfig);
    expect(result.academic.score + result.bonus.received).toBeGreaterThan(activeAdmissionConfig.scoreScale);
    expect(result.finalScore).toBe(activeAdmissionConfig.scoreScale);
  });
});

describe('HCMUT 2026 no-ĐGNL branch golden conformance (Tier C, sourceId hcmut-no-dgnl-research-2026, cross-checked)', () => {
  assertGoldenCaseProvenance([hcmutNoDgnlGoldenCase]);

  it(hcmutNoDgnlGoldenCase.id, () => {
    const result = calculateAdmissionScoreNoDgnl(hcmutNoDgnlGoldenCase.input, activeAdmissionConfig);
    expect(result.finalScore).toBe(hcmutNoDgnlGoldenCase.expected.finalScore);
    expect(result.academic.score).toBe(hcmutNoDgnlGoldenCase.expected.academicScore);
    expect(result.dgnl.normalizedScore).toBe(hcmutNoDgnlGoldenCase.expected.abilityNormalizedScore);
    expect(result.abilitySource).toBe('thpt-derived');
  });
});
