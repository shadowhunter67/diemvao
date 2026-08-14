import { describe, expect, it } from 'vitest';
import { evaluateUsshAdmission } from './evaluate';
import type { ApplicantProfile } from '../../core/applicantProfile';

describe('evaluateUsshAdmission', () => {
  it('unknown khi chưa có gì', () => {
    const evaluation = evaluateUsshAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('eligible khi ĐGNL đạt ngưỡng', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const evaluation = evaluateUsshAdmission(profile);
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('ineligible khi ĐGNL dưới ngưỡng', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 500 } } };
    const evaluation = evaluateUsshAdmission(profile);
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('missingRules liệt kê 4 gap chính thức đã biết (re-audit 2026-08-13/14: α1/α2/bonus/priority-table)', () => {
    const evaluation = evaluateUsshAdmission({});
    expect(evaluation.missingRules).toHaveLength(4);
  });

  it('ĐT3 tính được khi đủ ĐGNL + học bạ, xuất hiện trong explanation, KHÔNG set evaluation.score', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    const step = evaluation.explanation.find((s) => s.id === 'ussh-dt3-score');
    expect(step).toBeDefined();
    expect(step?.scale).toBe(100);
    expect(evaluation.score).toBeUndefined();
    expect(evaluation.confidence).toBe('partial');
  });
});
