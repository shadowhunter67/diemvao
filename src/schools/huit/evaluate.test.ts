import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHuitThptExamAdmission, evaluateHuitTranscriptAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<(typeof A01_SUBJECTS)[number], number>>): ApplicantProfile {
  return { thpt: { scores } };
}

describe('evaluateHuitThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateHuitThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'huit-subject-combination')).toBe(true);
  });

  it('thiếu điểm 1 môn -> missingInputs + missingRequirement profile-input', () => {
    const evaluation = evaluateHuitThptExamAdmission(profileWithThpt({ math: 8, physics: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'huit-thpt-english')).toBe(true);
  });

  it('nhóm standard: 16 pass, 15.99 fail', () => {
    const pass = evaluateHuitThptExamAdmission(profileWithThpt({ math: 6, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'standard',
    });
    expect(pass.eligibility?.status).toBe('eligible');

    const fail = evaluateHuitThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'standard',
    });
    expect(fail.eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: ngưỡng 20, tổng 16 dưới ngưỡng -> ineligible', () => {
    const evaluation = evaluateHuitThptExamAdmission(profileWithThpt({ math: 6, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateHuitThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });
});

describe('evaluateHuitTranscriptAdmission', () => {
  it('chưa nhập tổng điểm -> unknown + missingRequirement', () => {
    const evaluation = evaluateHuitTranscriptAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'huit-transcript-total-score')).toBe(true);
  });

  it('nhóm standard: 20 pass, 19.99 fail', () => {
    expect(evaluateHuitTranscriptAdmission(profileWithThpt({}), { totalScore30: 20, thresholdGroup: 'standard' }).eligibility?.status).toBe('eligible');
    expect(evaluateHuitTranscriptAdmission(profileWithThpt({}), { totalScore30: 19.99, thresholdGroup: 'standard' }).eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: 20 pass, 19.99 fail', () => {
    expect(evaluateHuitTranscriptAdmission(profileWithThpt({}), { totalScore30: 20, thresholdGroup: 'law' }).eligibility?.status).toBe('eligible');
    expect(evaluateHuitTranscriptAdmission(profileWithThpt({}), { totalScore30: 19.99, thresholdGroup: 'law' }).eligibility?.status).toBe('ineligible');
  });

  it('methodId khớp phương thức học tập THPT', () => {
    const evaluation = evaluateHuitTranscriptAdmission(profileWithThpt({}), { totalScore30: 20 });
    expect(evaluation.methodId).toBe('huit-transcript-2026');
  });
});
