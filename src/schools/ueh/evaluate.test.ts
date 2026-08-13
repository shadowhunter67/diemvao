import { describe, expect, it } from 'vitest';
import { evaluateUehAdmission } from './evaluate';

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

  it('missingRules liệt kê đúng 2 khoảng trống đã biết', () => {
    const evaluation = evaluateUehAdmission({});
    expect(evaluation.missingRules).toHaveLength(2);
  });
});
