import { describe, expect, it } from 'vitest';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateUsshBestDhl } from './calculator';
import { calculateUsshBonus } from './bonus';
import { lookupUsshStandardPriority } from './priority';
import { calculateUsshEffectivePriority } from './priorityReduction';
import { usshGoldenCases } from './__fixtures__/officialExamples2026';

/**
 * Golden/domain conformance — USSH 2026 exact calculator (phạm vi ĐC=0, xem `methods.ts`). Test
 * qua đúng chuỗi hàm `evaluateUsshAdmission` gọi thật (ĐHL → bonus → ưu tiên → final), phủ cả 3
 * applicant type branch (DT1/DT2/DT3 — công thức trọng số khác hẳn nhau theo dữ liệu có sẵn).
 */
describe('USSH 2026 golden conformance (Tier C — sourceId ussh-info-pdf-2026)', () => {
  assertGoldenCaseProvenance(usshGoldenCases);

  it.each(usshGoldenCases)('$id', (goldenCase) => {
    const dhl = calculateUsshBestDhl(goldenCase.input);
    expect(dhl).not.toBeNull();
    expect(dhl!.applicantType).toBe(goldenCase.expected.applicantType);
    expect(dhl!.scoreBeforeBonusAndPriority).toBe(goldenCase.expected.scoreBeforeBonusAndPriority);

    // exactCalculator chỉ hỗ trợ phạm vi KHÔNG có thành tích cộng điểm (ĐC=0) — hasBonusAchievement=false.
    const bonus = calculateUsshBonus(false);
    expect(bonus.awardedPoints100).toBe(0);

    const totalIncludingBonus = Math.min(100, dhl!.scoreBeforeBonusAndPriority + bonus.awardedPoints100);
    const standardPriority = lookupUsshStandardPriority(goldenCase.input.priorityRegion, goldenCase.input.priorityCategory);
    const priority = calculateUsshEffectivePriority({ totalIncludingBonus, standardPriority });
    const finalScore = Math.round(Math.min(100, totalIncludingBonus + priority.effectivePriority) * 100) / 100;

    expect(finalScore).toBe(goldenCase.expected.finalScore);
  });

  it('DT1/DT3 boundary cases: reduction triggers only when totalIncludingBonus >= 75', () => {
    const dt1 = usshGoldenCases.find((c) => c.id.includes('dt1'))!;
    const dt3 = usshGoldenCases.find((c) => c.id.includes('dt3'))!;
    expect(calculateUsshBestDhl(dt1.input)!.scoreBeforeBonusAndPriority).toBeGreaterThanOrEqual(75);
    expect(calculateUsshBestDhl(dt3.input)!.scoreBeforeBonusAndPriority).toBeLessThan(75);
  });

  it('each applicant type uses a genuinely different weighted formula branch (DT1 != DT2 != DT3 selection)', () => {
    const byType = Object.fromEntries(usshGoldenCases.map((c) => [c.expected.applicantType, calculateUsshBestDhl(c.input)]));
    expect(byType.DT1?.dgnlComponent).toBeDefined();
    expect(byType.DT1?.thptComponent).toBeDefined();
    expect(byType.DT2?.dgnlComponent).toBeUndefined();
    expect(byType.DT2?.thptComponent).toBeDefined();
    expect(byType.DT3?.dgnlComponent).toBeDefined();
    expect(byType.DT3?.thptComponent).toBeUndefined();
  });
});
