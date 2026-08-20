import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateUmpAdmission, type UmpEvaluationContext } from './evaluate';

const b00Context: UmpEvaluationContext = {
  subjectContext: { combinationId: 'B00', subjects: ['math', 'chemistry', 'biology'] },
  selectedProgramId: '7720101', // Y khoa, threshold30 = 23.0
};

describe('evaluateUmpAdmission', () => {
  it('thiếu tổ hợp → partial, yêu cầu chọn tổ hợp', () => {
    const evaluation = evaluateUmpAdmission({}, {});
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ code: 'ump-subject-combination' }));
  });

  it('thiếu điểm môn → partial, liệt kê đúng môn thiếu', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8 } } };
    const evaluation = evaluateUmpAdmission(profile, b00Context);
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'ump-thpt-chemistry')).toBe(true);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'ump-thpt-biology')).toBe(true);
  });

  it('đủ điểm, không chọn ngành → vẫn tính được điểm, eligibility unknown', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, chemistry: 8, biology: 7 } } };
    const evaluation = evaluateUmpAdmission(profile, { subjectContext: b00Context.subjectContext });
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score?.value).toBe(23);
    expect(evaluation.eligibility!.status).toBe('unknown');
  });

  it('đủ điểm + chọn ngành Y khoa, đạt ngưỡng, không ưu tiên/khuyến khích', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, chemistry: 8, biology: 7 } } };
    const evaluation = evaluateUmpAdmission(profile, b00Context);
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.eligibility!.status).toBe('eligible');
    expect(evaluation.score).toEqual({ value: 23, scale: 30 });
  });

  it('không đạt ngưỡng vẫn tính được điểm, eligibility ineligible', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 6, chemistry: 6, biology: 6 } } };
    const evaluation = evaluateUmpAdmission(profile, b00Context);
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.eligibility!.status).toBe('ineligible');
    expect(evaluation.score?.value).toBe(18);
  });

  it('cộng điểm ưu tiên KV1+UT1 và điểm khuyến khích IELTS 9', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 6, chemistry: 6, biology: 6 } },
      priority: { region: 'KV1', category: 'UT1' },
      certificates: { ielts: 9 },
    };
    const evaluation = evaluateUmpAdmission(profile, b00Context);
    // raw=18, priority=2.75 (dưới 22.5 nên không giảm), bonus=0.9 → 21.65
    expect(evaluation.score?.value).toBeCloseTo(21.65, 2);
  });

  it('ngành Hộ sinh gắn cờ chưa kiểm tra được điều kiện giới tính', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 6, chemistry: 6, biology: 6 } } };
    const evaluation = evaluateUmpAdmission(profile, { ...b00Context, selectedProgramId: '7720302' });
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ code: 'ump-gender-restriction-not-modeled' }));
  });
});
