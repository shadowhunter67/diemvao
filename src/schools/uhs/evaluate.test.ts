import { describe, expect, it } from 'vitest';
import { evaluateUhsAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

describe('evaluateUhsAdmission', () => {
  it('unknown khi chưa chọn ngành/tổ hợp', () => {
    const evaluation = evaluateUhsAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('unknown khi ngành không có ngưỡng cụ thể (vd nursing)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, chemistry: 8, biology: 8 } } };
    const evaluation = evaluateUhsAdmission(profile, {
      subjectContext: { combinationId: 'B00', subjects: ['math', 'chemistry', 'biology'] },
      program: undefined,
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('eligible khi ngành medicine đủ điều kiện', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, chemistry: 8, biology: 6 } } };
    const evaluation = evaluateUhsAdmission(profile, {
      subjectContext: { combinationId: 'B00', subjects: ['math', 'chemistry', 'biology'] },
      program: 'medicine',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('ineligible khi ngành medicine không đạt', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, chemistry: 5, biology: 5 } } };
    const evaluation = evaluateUhsAdmission(profile, {
      subjectContext: { combinationId: 'B00', subjects: ['math', 'chemistry', 'biology'] },
      program: 'medicine',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });
});
