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

  it('missingRules liệt kê 4 gap chính thức đã biết (re-audit 2026-08-13: tách bonus/priority/threshold-table)', () => {
    const evaluation = evaluateHcmusAdmission({});
    expect(evaluation.missingRules).toHaveLength(4);
  });

  it('academicScore tính được thật khi đủ THPT + học bạ, xuất hiện trong explanation, KHÔNG set evaluation.score', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateHcmusAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    const step = evaluation.explanation.find((s) => s.id === 'hcmus-academic-score');
    expect(step).toBeDefined();
    expect(step?.output).toBeCloseTo(23, 5);
    expect(step?.scale).toBe(30);
    expect(evaluation.score).toBeUndefined();
    expect(evaluation.confidence).toBe('partial');
  });
});
