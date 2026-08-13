import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import { summarizeApplicantProfile } from './applicantProfileSummary';

describe('summarizeApplicantProfile', () => {
  it('profile rỗng → hasData false, mọi count = 0', () => {
    expect(summarizeApplicantProfile({})).toEqual({
      hasData: false,
      vactTotal: undefined,
      thptSubjectCount: 0,
      transcriptSubjectCount: 0,
      thptSubjects: [],
      transcriptSubjects: [],
    });
  });

  it('có vactTotal → hasData true', () => {
    const summary = summarizeApplicantProfile({ exams: { vact: { total: 990 } } });
    expect(summary.hasData).toBe(true);
    expect(summary.vactTotal).toBe(990);
  });

  it('đếm đúng số môn THPT đã có điểm (undefined không tính)', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 9, physics: undefined, chemistry: 7 } } };
    const summary = summarizeApplicantProfile(profile);
    expect(summary.thptSubjectCount).toBe(2);
    expect(summary.thptSubjects).toEqual([
      { subjectId: 'math', label: 'Toán', score: 9 },
      { subjectId: 'chemistry', label: 'Hóa học', score: 7 },
    ]);
    expect(summary.hasData).toBe(true);
  });

  it('đếm số môn học bạ theo union 3 năm, không cộng dồn trùng', () => {
    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: 9, physics: 8 },
        grade11: { math: 9, physics: 8 },
        grade12: { math: 9, physics: 8 },
      },
    };
    const summary = summarizeApplicantProfile(profile);
    expect(summary.transcriptSubjectCount).toBe(2);
    expect(summary.transcriptSubjects).toEqual([
      { subjectId: 'math', label: 'Toán', grades: { grade10: 9, grade11: 9, grade12: 9 } },
      { subjectId: 'physics', label: 'Vật lý', grades: { grade10: 8, grade11: 8, grade12: 8 } },
    ]);
  });
});
