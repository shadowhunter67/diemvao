import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { assertGoldenCaseProvenance } from '../../core/goldenAdmissionCase';
import { calculateUfmThptRawScore, calculateUfmThptFinalScore } from './calculator';
import { checkUfmThptThreshold, checkUfmDgnlThreshold } from './eligibility';
import { lookupUfmStandardPriority30, calculateUfmPriority30 } from './priority';
import { evaluateUfmDgnlAdmission, evaluateUfmHocbaAdmission, evaluateUfmVsatAdmission } from './evaluate';
import { ufmThptGoldenCases, ufmDgnlGoldenCases, ufmHocbaGoldenCases, ufmVsatGoldenCases } from './__fixtures__/officialExamples2026';

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

/**
 * ĐGNL 2026 — batch 2026-08-20: "Điểm xét tuyển" nay quy đổi qua bảng bách phân vị (mục 3.2, xem
 * `conversionTable.ts`) trước khi cộng ưu tiên/điểm cộng. Gọi thẳng `evaluateUfmDgnlAdmission`
 * (wired end-to-end) thay vì chuỗi hàm rời rạc — case đều chọn điểm trùng biên khoảng nên `expected`
 * đọc thẳng từ bảng, không cần hand-verify nội suy (xem comment ở fixture).
 */
describe('UFM 2026 golden conformance — xét ĐGNL (Tier C, boundary-anchored — xem officialExamples2026.ts)', () => {
  assertGoldenCaseProvenance(ufmDgnlGoldenCases);

  it.each(ufmDgnlGoldenCases)('$id', (goldenCase) => {
    const threshold = checkUfmDgnlThreshold(goldenCase.input.dgnlScore1200, goldenCase.input.group);
    expect(threshold.pass).toBe(goldenCase.expected.eligible);

    const profile: ApplicantProfile = {
      exams: { vact: { total: goldenCase.input.dgnlScore1200 } },
      priority: { region: goldenCase.input.priorityRegion, category: goldenCase.input.priorityCategory },
    };
    const result = evaluateUfmDgnlAdmission(profile, { thresholdGroup: goldenCase.input.group });

    if (goldenCase.expected.convertedY30 !== undefined) {
      const conversionStep = result.explanation.find((s) => s.id === 'ufm-dgnl-conversion');
      expect(conversionStep?.output).toBe(goldenCase.expected.convertedY30);
    }
    if (goldenCase.expected.finalScore !== undefined) {
      expect(result.score?.value).toBe(goldenCase.expected.finalScore);
    } else {
      expect(result.score).toBeUndefined();
    }
  });
});

/** Mục 3.1 — học bạ. Cùng cấu trúc test với ĐGNL ở trên. */
describe('UFM 2026 golden conformance — xét học bạ (Tier C, boundary-anchored)', () => {
  assertGoldenCaseProvenance(ufmHocbaGoldenCases);

  const comboFixture = { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const };

  it.each(ufmHocbaGoldenCases)('$id', (goldenCase) => {
    const raw30 = calculateUfmThptRawScore(goldenCase.input);
    expect(raw30).toBe(goldenCase.expected.raw30);

    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: goldenCase.input.subject1Score, physics: goldenCase.input.subject2Score, english: goldenCase.input.subject3Score },
        grade11: { math: goldenCase.input.subject1Score, physics: goldenCase.input.subject2Score, english: goldenCase.input.subject3Score },
        grade12: { math: goldenCase.input.subject1Score, physics: goldenCase.input.subject2Score, english: goldenCase.input.subject3Score },
      },
      priority: { region: goldenCase.input.priorityRegion, category: goldenCase.input.priorityCategory },
    };
    const result = evaluateUfmHocbaAdmission(profile, { subjectContext: comboFixture, thresholdGroup: goldenCase.input.group });

    expect(result.eligibility?.status).toBe(goldenCase.expected.eligible ? 'eligible' : 'ineligible');
    if (goldenCase.expected.convertedY30 !== undefined) {
      const conversionStep = result.explanation.find((s) => s.id === 'ufm-hocba-conversion');
      expect(conversionStep?.output).toBe(goldenCase.expected.convertedY30);
    }
    if (goldenCase.expected.finalScore !== undefined) {
      expect(result.score?.value).toBe(goldenCase.expected.finalScore);
    } else {
      expect(result.score).toBeUndefined();
    }
  });
});

/**
 * Mục 3.3 — V-SAT. `ufm-2026-vsat-official-worked-example` (Tier A) là proof mạnh nhất trong toàn bộ
 * UFM golden suite — input/output lấy nguyên văn từ ví dụ minh họa chính thức của văn bản gốc.
 */
describe('UFM 2026 golden conformance — xét V-SAT (Tier A official worked example + Tier C boundary)', () => {
  assertGoldenCaseProvenance(ufmVsatGoldenCases);

  it.each(ufmVsatGoldenCases)('$id', (goldenCase) => {
    const profile: ApplicantProfile = { priority: { region: goldenCase.input.priorityRegion, category: goldenCase.input.priorityCategory } };
    const result = evaluateUfmVsatAdmission(profile, { vsatScore: goldenCase.input.vsatScore, thresholdGroup: goldenCase.input.group });

    expect(result.eligibility?.status).toBe(goldenCase.expected.eligible ? 'eligible' : 'ineligible');
    if (goldenCase.expected.convertedY30 !== undefined) {
      const conversionStep = result.explanation.find((s) => s.id === 'ufm-vsat-conversion');
      expect(conversionStep?.output).toBe(goldenCase.expected.convertedY30);
    }
    if (goldenCase.expected.finalScore !== undefined) {
      expect(result.score?.value).toBe(goldenCase.expected.finalScore);
    } else {
      expect(result.score).toBeUndefined();
    }
  });
});
