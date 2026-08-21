import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateUefThptExamAdmission, evaluateUefTranscriptAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<(typeof A01_SUBJECTS)[number], number>>): ApplicantProfile {
  return { thpt: { scores } };
}

const EMPTY_PROFILE: ApplicantProfile = {};

describe('evaluateUefThptExamAdmission', () => {
  it('nhóm standard: 15 pass, 14.99 fail', () => {
    expect(
      evaluateUefThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
        subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
        thresholdGroup: 'standard',
      }).eligibility?.status
    ).toBe('eligible');
    expect(
      evaluateUefThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
        subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
        thresholdGroup: 'standard',
      }).eligibility?.status
    ).toBe('ineligible');
  });

  it('nhóm law: ngưỡng 20, tổng 15 -> ineligible', () => {
    const evaluation = evaluateUefThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateUefThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });
});

describe('evaluateUefTranscriptAdmission', () => {
  it('nhóm standard: chưa nhập điểm -> unknown', () => {
    const evaluation = evaluateUefTranscriptAdmission(EMPTY_PROFILE, { thresholdGroup: 'standard' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'uef-transcript-total-score')).toBe(true);
  });

  it('nhóm standard: 18 pass, 17.99 fail', () => {
    expect(evaluateUefTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 18, thresholdGroup: 'standard' }).eligibility?.status).toBe('eligible');
    expect(evaluateUefTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 17.99, thresholdGroup: 'standard' }).eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: chưa cung cấp rank -> unknown', () => {
    const evaluation = evaluateUefTranscriptAdmission(EMPTY_PROFILE, { thresholdGroup: 'law' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'uef-academic-rank-12')).toBe(true);
  });

  it('nhóm law: rank tốt-giỏi + điểm xét tốt nghiệp 8.5 -> eligible', () => {
    const evaluation = evaluateUefTranscriptAdmission(EMPTY_PROFILE, { thresholdGroup: 'law', academicRank12: 'tot-gioi', graduationScore10: 8.5 });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm law: rank khá (dưới yêu cầu) dù điểm đủ -> ineligible', () => {
    const evaluation = evaluateUefTranscriptAdmission(EMPTY_PROFILE, { thresholdGroup: 'law', academicRank12: 'kha', graduationScore10: 9 });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: rank đủ + tổng 3 môn TN THPT 18 -> eligible', () => {
    const evaluation = evaluateUefTranscriptAdmission(EMPTY_PROFILE, { thresholdGroup: 'law', academicRank12: 'tot-gioi', thptExamTotal30: 18 });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('methodId khớp phương thức học bạ', () => {
    expect(evaluateUefTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 18, thresholdGroup: 'standard' }).methodId).toBe('uef-transcript-2026');
  });
});
