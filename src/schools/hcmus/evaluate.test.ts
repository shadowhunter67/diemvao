import { describe, expect, it } from 'vitest';
import { evaluateHcmusAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

describe('evaluateHcmusAdmission', () => {
  it('eligibility unknown khi chưa chọn tổ hợp', () => {
    const evaluation = evaluateHcmusAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.confidence).toBe('partial');
  });

  it('missing input khi thiếu môn trong tổ hợp', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8 } } };
    const evaluation = evaluateHcmusAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
  });

  it('eligible khi đủ 3 môn và tổng ≥15', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 6, physics: 5, chemistry: 5 } } };
    const evaluation = evaluateHcmusAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('ineligible khi đủ 3 môn nhưng tổng <15', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 4, physics: 4, chemistry: 4 } } };
    const evaluation = evaluateHcmusAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('missingRules liệt kê 3 gap chính thức đã biết', () => {
    const evaluation = evaluateHcmusAdmission({});
    expect(evaluation.missingRules).toHaveLength(3);
  });
});
