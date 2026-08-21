import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHsuThptExamAdmission, evaluateHsuTranscriptAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<(typeof A01_SUBJECTS)[number], number>>): ApplicantProfile {
  return { thpt: { scores } };
}

describe('evaluateHsuThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateHsuThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hsu-subject-combination')).toBe(true);
  });

  it('nhóm standard: 15 pass, 14.99 fail', () => {
    expect(
      evaluateHsuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
        subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
        thresholdGroup: 'standard',
      }).eligibility?.status
    ).toBe('eligible');
    expect(
      evaluateHsuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
        subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
        thresholdGroup: 'standard',
      }).eligibility?.status
    ).toBe('ineligible');
  });

  it('nhóm law: 20 pass, tổng 15 dưới ngưỡng -> ineligible', () => {
    const evaluation = evaluateHsuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateHsuThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });
});

describe('evaluateHsuTranscriptAdmission', () => {
  it('chưa nhập tổng điểm, nhóm standard -> unknown', () => {
    const evaluation = evaluateHsuTranscriptAdmission(profileWithThpt({}), { thresholdGroup: 'standard' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hsu-transcript-total-score')).toBe(true);
  });

  it('nhóm standard: 18 pass, 17.99 fail', () => {
    expect(evaluateHsuTranscriptAdmission(profileWithThpt({}), { totalScore30: 18, thresholdGroup: 'standard' }).eligibility?.status).toBe('eligible');
    expect(evaluateHsuTranscriptAdmission(profileWithThpt({}), { totalScore30: 17.99, thresholdGroup: 'standard' }).eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: luôn unknown kèm gap (ngưỡng chưa công bố), kể cả khi có điểm', () => {
    const evaluation = evaluateHsuTranscriptAdmission(profileWithThpt({}), { totalScore30: 25, thresholdGroup: 'law' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hsu-law-non-thpt-threshold-unpublished')).toBe(true);
  });

  it('methodId khớp phương thức học bạ', () => {
    expect(evaluateHsuTranscriptAdmission(profileWithThpt({}), { totalScore30: 18 }).methodId).toBe('hsu-transcript-2026');
  });
});
