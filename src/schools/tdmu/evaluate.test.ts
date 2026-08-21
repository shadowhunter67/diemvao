import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateTdmuThptExamAdmission, evaluateTdmuTranscriptAdmission, evaluateTdmuVactAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<string, number>>): ApplicantProfile {
  return { thpt: { scores } };
}

function profileWithTranscript(scores: Partial<Record<string, number>>): ApplicantProfile {
  return {
    transcript: {
      grade10: scores,
      grade11: scores,
      grade12: scores,
    },
  };
}

function profileWithVact(total: number): ApplicantProfile {
  return { exams: { vact: { total, totalSource: 'user-total-input' } } };
}

describe('evaluateTdmuThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'tdmu-subject-combination')).toBe(true);
  });

  it('nhóm standard, tổng 15 -> eligible', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm standard, tổng 14.99 -> ineligible', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm law, tổng 19.99 -> ineligible (ngưỡng 20)', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({ math: 7, physics: 7, english: 5.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm teacher, tổng 20 -> eligible', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({ math: 7, physics: 7, english: 6 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'teacher',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateTdmuThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });
});

describe('evaluateTdmuTranscriptAdmission', () => {
  it('chưa chọn tổ hợp -> unknown', () => {
    const evaluation = evaluateTdmuTranscriptAdmission(profileWithTranscript({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('nhóm standard, trung bình 3 năm mỗi môn = 5.5 -> tổng 16.5 -> eligible', () => {
    const evaluation = evaluateTdmuTranscriptAdmission(profileWithTranscript({ math: 5.5, physics: 5.5, english: 5.5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
    expect(evaluation.explanation[0].output).toBe(16.5);
  });

  it('nhóm law, trung bình mỗi môn 5.5 (tổng 16.5) -> ineligible (ngưỡng 21.5)', () => {
    const evaluation = evaluateTdmuTranscriptAdmission(profileWithTranscript({ math: 5.5, physics: 5.5, english: 5.5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('thiếu điểm lớp 11 -> missingInputs + missingRequirement', () => {
    const profile: ApplicantProfile = {
      transcript: { grade10: { math: 6, physics: 6, english: 6 }, grade12: { math: 6, physics: 6, english: 6 } },
    };
    const evaluation = evaluateTdmuTranscriptAdmission(profile, { subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS }, group: 'standard' });
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'tdmu-transcript-math')).toBe(true);
  });
});

describe('evaluateTdmuVactAdmission', () => {
  it('chưa có điểm ĐGNL -> unknown + missingRequirement', () => {
    const evaluation = evaluateTdmuVactAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'tdmu-vact-total')).toBe(true);
  });

  it('nhóm standard, 600 -> eligible', () => {
    const evaluation = evaluateTdmuVactAdmission(profileWithVact(600), { group: 'standard' });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm law, 700 -> ineligible (ngưỡng 750)', () => {
    const evaluation = evaluateTdmuVactAdmission(profileWithVact(700), { group: 'law' });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('methodId khớp phương thức ĐGNL', () => {
    const evaluation = evaluateTdmuVactAdmission(profileWithVact(800));
    expect(evaluation.methodId).toBe('tdmu-vact-2026');
  });
});
