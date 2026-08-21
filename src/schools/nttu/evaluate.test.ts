import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateNttuTranscriptAdmission } from './evaluate';

const EMPTY_PROFILE: ApplicantProfile = {};

describe('evaluateNttuTranscriptAdmission', () => {
  it('chưa nhập gì -> unknown + missingRequirement tổng điểm', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE);
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'nttu-transcript-total-score')).toBe(true);
  });

  it('nhóm standard: 18 pass, 17.99 fail, không cần rank/alt score', () => {
    expect(evaluateNttuTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 18, thresholdGroup: 'standard' }).eligibility?.status).toBe('eligible');
    expect(evaluateNttuTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 17.99, thresholdGroup: 'standard' }).eligibility?.status).toBe('ineligible');
  });

  it('nhóm medicine: đủ điểm sàn 23 nhưng thiếu rank -> unknown', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 23, thresholdGroup: 'medicine' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'nttu-academic-rank-12')).toBe(true);
  });

  it('nhóm medicine: đủ điểm sàn + rank tốt + điểm tốt nghiệp 8.5 -> eligible', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
      transcriptTotal30: 23,
      thresholdGroup: 'medicine',
      academicRank12: 'tot',
      graduationScore10: 8.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm medicine: rank khá (dưới yêu cầu tốt) dù điểm đủ -> ineligible', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
      transcriptTotal30: 25,
      thresholdGroup: 'medicine',
      academicRank12: 'kha',
      graduationScore10: 9,
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm medicine: đủ điểm sàn nhưng dưới ngưỡng thay thế (18 tổng THPT thay vì 20) -> ineligible', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
      transcriptTotal30: 23,
      thresholdGroup: 'medicine',
      academicRank12: 'tot',
      thptExamTotal30: 18,
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm nursing-prevention: ngưỡng thấp hơn (19/30, rank khá + 16.5/6.5)', () => {
    expect(
      evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
        transcriptTotal30: 19,
        thresholdGroup: 'nursing-prevention',
        academicRank12: 'kha',
        thptExamTotal30: 16.5,
      }).eligibility?.status
    ).toBe('eligible');
    expect(
      evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
        transcriptTotal30: 18.99,
        thresholdGroup: 'nursing-prevention',
        academicRank12: 'kha',
        thptExamTotal30: 16.5,
      }).eligibility?.status
    ).toBe('ineligible');
  });

  it('nhóm law: ngưỡng 18/30, rank tốt + điểm tốt nghiệp 8.5 -> eligible', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, {
      transcriptTotal30: 18,
      thresholdGroup: 'law',
      academicRank12: 'tot',
      graduationScore10: 8.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateNttuTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 25, thresholdGroup: 'standard' });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });

  it('methodId khớp phương thức học bạ', () => {
    expect(evaluateNttuTranscriptAdmission(EMPTY_PROFILE, { transcriptTotal30: 18 }).methodId).toBe('nttu-transcript-2026');
  });
});
