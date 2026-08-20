import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateVluThptExamAdmission, evaluateVluTranscriptAdmission, evaluateVluCombinedAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<(typeof A01_SUBJECTS)[number], number>>): ApplicantProfile {
  return { thpt: { scores } };
}

describe('evaluateVluThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'vlu-subject-combination')).toBe(true);
  });

  it('thiếu điểm 1 môn trong tổ hợp -> missingInputs + missingRequirement profile-input', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({ math: 8, physics: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'vlu-thpt-english')).toBe(true);
  });

  it('đủ điểm, nhóm standard, tổng 15 -> eligible', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
    expect(evaluation.explanation).toHaveLength(1);
    expect(evaluation.explanation[0].output).toBe(15);
  });

  it('đủ điểm, nhóm law, tổng 15 (dưới ngưỡng 20) -> ineligible', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      thresholdGroup: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score (đúng invariant unavailable/partial không có score)', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });

  it('missingRules/missingRequirements chứa đủ knowledge gap của Phương thức 1', () => {
    const evaluation = evaluateVluThptExamAdmission(profileWithThpt({}));
    expect(evaluation.missingRules.some((label) => label.includes('môn thi chính'))).toBe(true);
  });
});

describe('evaluateVluTranscriptAdmission (Phương thức 2 — học bạ)', () => {
  it('nhóm standard: eligible ngay cả khi không cung cấp rank/điểm thay thế', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({}), { thresholdGroup: 'standard' });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm law: chưa cung cấp rank -> unknown + missingRequirement', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({}), { thresholdGroup: 'law' });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'vlu-academic-rank-12')).toBe(true);
  });

  it('nhóm law: rank giỏi + điểm xét tốt nghiệp 8.5 -> eligible', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({}), {
      thresholdGroup: 'law',
      academicRank12: 'gioi',
      graduationScore10: 8.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm law: rank khá (dưới yêu cầu) + điểm đủ -> ineligible (không phải unknown, vì đủ thông tin để biết fail)', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({}), {
      thresholdGroup: 'law',
      academicRank12: 'kha',
      graduationScore10: 9,
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm law: rank giỏi + tổng điểm 3 môn TN THPT (qua subjectContext) đủ 18 -> eligible', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({ math: 6, physics: 6, english: 6 }), {
      thresholdGroup: 'law',
      academicRank12: 'gioi',
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('methodId khớp Phương thức 2', () => {
    const evaluation = evaluateVluTranscriptAdmission(profileWithThpt({}), { thresholdGroup: 'standard' });
    expect(evaluation.methodId).toBe('vlu-transcript-2026');
  });
});

describe('evaluateVluCombinedAdmission (Phương thức 3 — kết hợp)', () => {
  it('methodId khớp Phương thức 3, dùng chung logic điều kiện bổ sung với Phương thức 2', () => {
    const evaluation = evaluateVluCombinedAdmission(profileWithThpt({}), {
      thresholdGroup: 'nursing-medlab',
      academicRank12: 'kha',
      graduationScore10: 6.5,
    });
    expect(evaluation.methodId).toBe('vlu-combined-2026');
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('missingRules chứa gap riêng của Phương thức 3 (bảng quy đổi kỳ thi kết hợp)', () => {
    const evaluation = evaluateVluCombinedAdmission(profileWithThpt({}), { thresholdGroup: 'standard' });
    expect(evaluation.missingRules.some((label) => label.includes('kết hợp'))).toBe(true);
  });
});
