import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { usshComparisonAdapter } from './comparison';

/**
 * Trước batch loại bỏ classify-bằng-parse-text, `usshComparisonAdapter` suy `applicantTypeId`
 * bằng regex trên `explanation[].label` (`/\((DT[123])\)/`) — đổi wording UI vô tình làm gãy
 * cutoff matching. Test dưới đây khóa: cutoff comparison phải dùng
 * `evaluation.comparisonContext.applicantTypeId` (structured), KHÔNG phụ thuộc nội dung label.
 */
const dt1Profile: ApplicantProfile = {
  exams: { vact: { total: 900 } },
  thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
  transcript: {
    grade10: { math: 8, physics: 7, chemistry: 8 },
    grade11: { math: 8, physics: 7, chemistry: 8 },
    grade12: { math: 8, physics: 7, chemistry: 8 },
  },
};

const dt2Profile: ApplicantProfile = {
  thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
  transcript: {
    grade10: { math: 8, physics: 7, chemistry: 8 },
    grade11: { math: 8, physics: 7, chemistry: 8 },
    grade12: { math: 8, physics: 7, chemistry: 8 },
  },
};

const dt3Profile: ApplicantProfile = {
  exams: { vact: { total: 900 } },
  transcript: {
    grade10: { math: 8, physics: 7, chemistry: 8 },
    grade11: { math: 8, physics: 7, chemistry: 8 },
    grade12: { math: 8, physics: 7, chemistry: 8 },
  },
};

const selectionBase = { schoolId: 'ussh', programId: 'ussh-7310401', context: { combinationId: 'A00' } };

describe('usshComparisonAdapter — structured applicant type (no label parsing)', () => {
  it('DT1: exact-verified with cutoff comparison resolved from a real program', () => {
    const context = usshComparisonAdapter.buildContext(selectionBase);
    const result = usshComparisonAdapter.evaluate(dt1Profile, context);
    expect(result.evaluation.confidence).toBe('exact-verified');
    expect(result.evaluation.comparisonContext?.applicantTypeId).toBe('DT1');
    expect(result.cutoffComparison?.difference).toBeDefined();
  });

  it('DT2: exact-verified with cutoff comparison resolved from a real program', () => {
    const context = usshComparisonAdapter.buildContext(selectionBase);
    const result = usshComparisonAdapter.evaluate(dt2Profile, context);
    expect(result.evaluation.confidence).toBe('exact-verified');
    expect(result.evaluation.comparisonContext?.applicantTypeId).toBe('DT2');
    expect(result.cutoffComparison?.difference).toBeDefined();
  });

  it('DT3: exact-verified with cutoff comparison resolved from a real program', () => {
    const context = usshComparisonAdapter.buildContext(selectionBase);
    const result = usshComparisonAdapter.evaluate(dt3Profile, context);
    expect(result.evaluation.confidence).toBe('exact-verified');
    expect(result.evaluation.comparisonContext?.applicantTypeId).toBe('DT3');
    expect(result.cutoffComparison?.difference).toBeDefined();
  });

  it('cutoff comparison never appears without a resolvable applicant type (no score/context => no comparisonContext)', () => {
    const context = usshComparisonAdapter.buildContext({ schoolId: 'ussh', programId: 'ussh-7310401' });
    const result = usshComparisonAdapter.evaluate({}, context);
    expect(result.evaluation.comparisonContext?.applicantTypeId).toBeUndefined();
    expect(result.cutoffComparison).toBeUndefined();
  });

  it('mutating/removing the "(DTx)" token from explanation labels does not change which cutoff record is matched', () => {
    const context = usshComparisonAdapter.buildContext(selectionBase);
    const result = usshComparisonAdapter.evaluate(dt1Profile, context);
    const finalLabel = result.evaluation.explanation.find((step) => step.id === 'ussh-final')?.label ?? '';

    // Label thật không còn chứa "DT1" thô (đã đổi wording) — cutoff comparison vẫn đúng DT1.
    expect(finalLabel).not.toMatch(/\(DT1\)/);
    expect(result.cutoffComparison?.comparable).toBe(true);

    // Giả lập "đổi wording UI mạnh hơn nữa" (xóa sạch mọi thông tin DT khỏi label) — vẫn không có
    // đường nào trong adapter đọc lại label để quyết định cutoff, nên kết quả không đổi.
    const relabeled = {
      ...result.evaluation,
      explanation: result.evaluation.explanation.map((step) => (step.id === 'ussh-final' ? { ...step, label: 'Điểm xét tuyển cuối cùng' } : step)),
    };
    expect(relabeled.comparisonContext?.applicantTypeId).toBe('DT1');
  });
});
