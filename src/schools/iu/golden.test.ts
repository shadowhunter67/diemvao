import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateIuAcademicScore } from './calculator';
import { computeIuTotalBonus } from './bonus';
import { lookupIuStandardPriority } from './priority';
import { calculateIuEffectivePriority } from './priorityReduction';
import { round2 } from '../../core/round2';
import { iuGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — IU 2026 Phương thức 2 (đối tượng "Thí sinh tốt nghiệp THPT 2026").
 * Không có official worked example, Tier C từ formula+constants verified. Phủ cả 2 nhánh công
 * thức điểm học lực: có ĐGNL thật vs. Hs3×THPT substitute (không có ĐGNL 2026).
 */
describe('IU 2026 golden conformance (Tier C — sourceId iu-admission-info-2026)', () => {
  assertGoldenCaseProvenance(iuGoldenCases);

  it.each(iuGoldenCases)('$id', (goldenCase) => {
    const academic = calculateIuAcademicScore(goldenCase.input.academic);
    expect(academic.academicScore).toBe(goldenCase.expected.academicScore);

    const bonus = computeIuTotalBonus(goldenCase.input.bonus);
    expect(bonus.total).toBe(goldenCase.expected.bonusTotal);
    expect(bonus.capped).toBe(goldenCase.expected.bonusCapped);

    const academicPlusBonus = round2(academic.academicScore + bonus.total);
    const standardPriority = lookupIuStandardPriority(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateIuEffectivePriority({ academicPlusBonus, standardPriority });
    expect(priority.effectivePriority).toBe(goldenCase.expected.priorityEffective);

    const finalScore = round2(Math.min(100, academicPlusBonus + priority.effectivePriority));
    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('with-DGNL case uses the real ĐGNL formula branch, no-DGNL case uses the Hs3 substitute branch', () => {
    const [withDgnl, noDgnl] = iuGoldenCases;
    expect(calculateIuAcademicScore(withDgnl.input.academic).usedDgnlSubstitute).toBe(false);
    expect(calculateIuAcademicScore(noDgnl.input.academic).usedDgnlSubstitute).toBe(true);
  });

  it('priority reduction triggers only for the case with academicPlusBonus >= 75', () => {
    const [withDgnl, noDgnl] = iuGoldenCases;
    const academicWith = calculateIuAcademicScore(withDgnl.input.academic);
    const bonusWith = computeIuTotalBonus(withDgnl.input.bonus);
    expect(round2(academicWith.academicScore + bonusWith.total)).toBeGreaterThanOrEqual(75);

    const academicNo = calculateIuAcademicScore(noDgnl.input.academic);
    const bonusNo = computeIuTotalBonus(noDgnl.input.bonus);
    expect(round2(academicNo.academicScore + bonusNo.total)).toBeLessThan(75);
  });
});
