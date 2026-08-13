import { describe, expect, it } from 'vitest';
import { evaluateUehAdmission, evaluateUehExactAdmission } from './evaluate';

describe('evaluateUehAdmission — partial confidence, không bao giờ fake final score', () => {
  it('confidence = partial, score luôn undefined dù có dgnlScore', () => {
    const evaluation = evaluateUehAdmission({ dgnlScore: 950 });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });

  it('có bước giải thích quy đổi ĐGNL khi có dgnlScore, khớp ví dụ chính thức 950 -> 25.55', () => {
    const evaluation = evaluateUehAdmission({ dgnlScore: 950 });
    const step = evaluation.explanation.find((s) => s.id === 'dgnl-to-thpt');
    expect(step?.output).toBeCloseTo(25.55, 2);
  });

  it('eligibility = unknown khi không có knownAdmissionScore100 (không suy đoán)', () => {
    const evaluation = evaluateUehAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('eligibility tính đúng khi người dùng tự cung cấp điểm đã biết', () => {
    const passing = evaluateUehAdmission({ knownAdmissionScore100: 70, campus: 'hcmc' });
    expect(passing.eligibility?.status).toBe('eligible');

    const failing = evaluateUehAdmission({ knownAdmissionScore100: 50, campus: 'hcmc' });
    expect(failing.eligibility?.status).toBe('ineligible');
  });

  it('missingRules rỗng — re-audit 2026-08-13 đã resolve cả 2 gap cũ', () => {
    const evaluation = evaluateUehAdmission({});
    expect(evaluation.missingRules).toHaveLength(0);
  });
});

describe('evaluateUehExactAdmission — Đối tượng 1, exact calculator', () => {
  it('confidence = partial, score undefined khi thiếu exam hoặc GPA', () => {
    const missingGpa = evaluateUehExactAdmission({ examScore30: 25, campus: 'hcmc' });
    expect(missingGpa.confidence).toBe('partial');
    expect(missingGpa.score).toBeUndefined();
    expect(missingGpa.missingInputs.length).toBeGreaterThan(0);

    const missingExam = evaluateUehExactAdmission({ gpaGrade10: 8, gpaGrade11: 8, gpaGrade12: 8, campus: 'hcmc' });
    expect(missingExam.confidence).toBe('partial');
    expect(missingExam.score).toBeUndefined();
  });

  it('confidence = exact-verified, tính đúng điểm cuối khi đủ input', () => {
    const evaluation = evaluateUehExactAdmission({
      examScore30: 25.55,
      gpaGrade10: 8.6,
      gpaGrade11: 8.6,
      gpaGrade12: 8.6,
      bonusIds: ['thpt-chuyen'],
      campus: 'hcmc',
    });
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score?.value).toBeCloseTo(87.5, 1);
    expect(evaluation.score?.scale).toBe(100);
  });

  it('eligibility dựa trên điểm trước điểm cộng/ưu tiên, đúng ngưỡng theo campus', () => {
    const belowThreshold = evaluateUehExactAdmission({
      examScore30: 10,
      gpaGrade10: 5,
      gpaGrade11: 5,
      gpaGrade12: 5,
      campus: 'hcmc',
    });
    expect(belowThreshold.eligibility?.status).toBe('ineligible');

    const aboveThreshold = evaluateUehExactAdmission({
      examScore30: 27,
      gpaGrade10: 9,
      gpaGrade11: 9,
      gpaGrade12: 9,
      campus: 'mekong',
    });
    expect(aboveThreshold.eligibility?.status).toBe('eligible');
  });
});
