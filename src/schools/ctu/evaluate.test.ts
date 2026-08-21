import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateCtuThptExamAdmission, evaluateCtuTranscriptAdmission, evaluateCtuVsatAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<string, number>>): ApplicantProfile {
  return { thpt: { scores } };
}

describe('evaluateCtuThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'ctu-subject-combination')).toBe(true);
  });

  it('thiếu điểm 1 môn -> missingInputs + missingRequirement profile-input', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({ math: 8, physics: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'ctu-thpt-english')).toBe(true);
  });

  it('tổng đủ 15, không môn nào ≤1 -> unknown (điều kiện 2 PDF-gated, không kết luận eligible)', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.explanation[0].output).toBe(15);
  });

  it('tổng dưới 14.99 -> ineligible (điều kiện 1 fail, kết luận chắc chắn)', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('có môn = 1.0 -> ineligible dù tổng đủ 15 (điều kiện "không môn nào ≤1")', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({ math: 1, physics: 7, english: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });

  it('missingRules chứa gap phụ lục PDF điểm sàn theo mã xét tuyển', () => {
    const evaluation = evaluateCtuThptExamAdmission(profileWithThpt({}));
    expect(evaluation.missingRules.some((label) => label.includes('mã xét tuyển'))).toBe(true);
  });
});

describe('evaluateCtuTranscriptAdmission (Phương thức 3 — điều kiện thay thế)', () => {
  it('chưa chọn nhóm ngành -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'ctu-program-group')).toBe(true);
  });

  it('nhóm standard -> luôn unknown (không có đường thay thế công bố)', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}), { group: 'standard' });
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('nhóm teacher, học lực Tốt + tổng 18 -> eligible (đường thay thế đủ điều kiện)', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({ math: 6, physics: 6, english: 6 }), {
      group: 'teacher',
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      academicRank12: 'tot',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm teacher, điểm xét tốt nghiệp 8.5 -> eligible qua đường điểm xét tốt nghiệp', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}), {
      group: 'teacher',
      academicRank12: 'gioi',
      graduationScore10: 8.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm teacher, học lực Khá -> ineligible (chưa đạt loại Tốt/Giỏi)', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}), {
      group: 'teacher',
      academicRank12: 'kha',
      graduationScore10: 9,
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm law, đủ điều kiện học lực+điểm -> unknown (còn vướng điều kiện tổ hợp môn quy đổi)', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}), {
      group: 'law',
      academicRank12: 'tot',
      graduationScore10: 9,
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.eligibility?.reasons.some((r) => r.includes('quy đổi'))).toBe(true);
  });

  it('methodId khớp Phương thức 3', () => {
    const evaluation = evaluateCtuTranscriptAdmission(profileWithThpt({}));
    expect(evaluation.methodId).toBe('ctu-transcript-2026');
  });
});

describe('evaluateCtuVsatAdmission (Phương thức 4)', () => {
  it('methodId khớp Phương thức 4, dùng chung logic với Phương thức 3', () => {
    const evaluation = evaluateCtuVsatAdmission(profileWithThpt({}), { group: 'teacher', academicRank12: 'tot', graduationScore10: 9 });
    expect(evaluation.methodId).toBe('ctu-vsat-2026');
    expect(evaluation.eligibility?.status).toBe('eligible');
  });
});
