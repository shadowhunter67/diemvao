import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { convertHcmusVactToThpt } from './dgnlConversion';
import { calculateHcmusAcademicScore } from './academicScore';
import { calculateHcmusBonus } from './bonus';
import { calculateHcmusEffectivePriority, lookupHcmusStandardPriority } from './priority';
import { HCMUS_MAX_SCORE_30, type HcmusBonusCategoryId } from './data/bonus';
import { hcmusVactConversionGoldenCases, hcmusGoldenCase } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — HCMUS 2026 exact calculator. Bảng phân vị ĐGNL→THPT (Tier B) test
 * trực tiếp converter thật; chain điểm học lực+cộng+ưu tiên (Tier C) test qua các hàm tính thật.
 */
describe('HCMUS 2026 vact conversion table (Tier B, sourceId hcmus-vact-conversion-table-2026)', () => {
  it.each(hcmusVactConversionGoldenCases)('$id', (goldenCase) => {
    const result = convertHcmusVactToThpt(goldenCase.input);
    expect(result).not.toBeNull();
    expect(result!.thptScore).toBe(goldenCase.expected!.thptScore);
    expect(result!.exactBreakpoint).toBe(goldenCase.expected!.exactBreakpoint);
    expect(result!.clampedAtCeiling).toBe(goldenCase.expected!.clampedAtCeiling);
  });

  it('interpolation case is genuinely between the two documented table rows (981 between 967 and 995)', () => {
    const interpolationCase = hcmusVactConversionGoldenCases.find((c) => c.id.includes('interpolation'))!;
    expect(interpolationCase.input).toBeGreaterThan(967);
    expect(interpolationCase.input).toBeLessThan(995);
  });
});

describe('HCMUS 2026 golden conformance (Tier C — full chain, sourceId hcmus-academic-score-formula-2026)', () => {
  assertGoldenCaseProvenance([hcmusGoldenCase]);

  it(hcmusGoldenCase.id, () => {
    const academic = calculateHcmusAcademicScore(hcmusGoldenCase.input);
    expect(academic.academicScore).toBe(hcmusGoldenCase.expected.academicScore);
    expect(academic.usedRoute).toBe('thpt');

    const bonus = calculateHcmusBonus(hcmusGoldenCase.input.bonusCategoryId as HcmusBonusCategoryId, academic.academicScore!);
    expect(bonus.awardedPoints30).toBe(hcmusGoldenCase.expected.bonusAwarded);
    expect(bonus.reduced).toBe(false);

    const academicPlusBonus30 = Math.min(HCMUS_MAX_SCORE_30, academic.academicScore! + bonus.awardedPoints30);
    const standardPriority30 = lookupHcmusStandardPriority(hcmusGoldenCase.input.priorityRegion, hcmusGoldenCase.input.priorityCategory);
    const priority = calculateHcmusEffectivePriority({ academicPlusBonus30, standardPriority30 });
    expect(priority.effectivePriority30).toBe(hcmusGoldenCase.expected.priorityEffective);
    expect(priority.reduced).toBe(true);

    const finalScore30 = Math.round(Math.min(HCMUS_MAX_SCORE_30, academicPlusBonus30 + priority.effectivePriority30) * 100) / 100;
    expect(finalScore30).toBe(hcmusGoldenCase.expected.finalScore30);
  });

  it('priority reduction boundary is genuinely crossed (academicPlusBonus30 >= 22.5) while bonus reduction is not (< 28.5)', () => {
    const academic = calculateHcmusAcademicScore(hcmusGoldenCase.input);
    const bonus = calculateHcmusBonus(hcmusGoldenCase.input.bonusCategoryId as HcmusBonusCategoryId, academic.academicScore!);
    expect(bonus.reduced).toBe(false);
    const academicPlusBonus30 = academic.academicScore! + bonus.awardedPoints30;
    expect(academicPlusBonus30).toBeGreaterThanOrEqual(22.5);
  });
});
