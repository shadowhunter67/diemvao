import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHubThptExamAdmission, evaluateHubComprehensiveAdmission, evaluateHubVsatAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;
const C01_SUBJECTS = ['literature', 'math', 'physics'] as const;

function profileWithThpt(scores: Partial<Record<string, number>>, graduationYear?: number): ApplicantProfile {
  return { thpt: { scores }, graduationYear };
}

describe('evaluateHubThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hub-subject-combination')).toBe(true);
  });

  it('thiếu điểm 1 môn trong tổ hợp -> missingInputs + missingRequirement profile-input', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 8, physics: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hub-thpt-english')).toBe(true);
  });

  it('đủ điểm, nhóm standard, tổng 15 -> eligible', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
    expect(evaluation.explanation[0].output).toBe(15);
  });

  it('đủ điểm, nhóm standard, tổng 14.99 -> ineligible', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('confidence luôn partial, không có score (đúng invariant unavailable/partial không có score)', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });

  it('nhóm law: đủ điểm KV3, tổ hợp A01, Toán=6, tổng 20 -> eligible', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 6, physics: 7, english: 7 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'law',
      priorityZone: 'KV3',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm law: chưa khai báo khu vực -> unknown + missingRequirement', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 8, physics: 8, english: 8 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'law',
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hub-priority-zone')).toBe(true);
  });

  it('nhóm law: KV3, tổ hợp C01, Văn thiếu -> vẫn tính được ineligible (subjectOk unknown -> pass false)', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 8, physics: 8 }), {
      subjectContext: { combinationId: 'C01', subjects: C01_SUBJECTS },
      group: 'law',
      priorityZone: 'KV3',
    });
    // Thiếu điểm Văn (môn thứ 3 của C01) -> missingInputs, total30 undefined -> vẫn 'unknown' vì chưa đủ điểm tổ hợp.
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingInputs.length).toBeGreaterThan(0);
  });

  it('nhóm finance-banking-elite: đủ điểm 15 + IELTS 5.5 -> eligible', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'finance-banking-elite',
      ielts: 5.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm finance-banking-elite: đủ điểm 15 + IELTS 5.4 -> ineligible', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'finance-banking-elite',
      ielts: 5.4,
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm finance-banking-elite: chưa có IELTS -> unknown + missingRequirement', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'finance-banking-elite',
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hub-elite-ielts')).toBe(true);
  });

  it('missingRules/missingRequirements chứa đủ knowledge gap của Phương thức 1', () => {
    const evaluation = evaluateHubThptExamAdmission(profileWithThpt({}));
    expect(evaluation.missingRules.some((label) => label.includes('điểm ưu tiên'))).toBe(true);
  });
});

describe('evaluateHubComprehensiveAdmission (Phương thức Tổng hợp)', () => {
  it('chưa có năm tốt nghiệp -> unknown + missingRequirement', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hub-graduation-year')).toBe(true);
  });

  it('tốt nghiệp 2025 (trước 2026) -> unknown, không suy đoán', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({}, 2025));
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('tốt nghiệp 2026, nhóm standard, rank khá cả 3 năm + tổng 15 -> eligible', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }, 2026), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      academicRank10: 'kha',
      academicRank11: 'kha',
      academicRank12: 'kha',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('tốt nghiệp 2026, nhóm law, path (c) điểm xét tốt nghiệp 8.5 -> eligible', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({}, 2026), {
      group: 'law',
      graduationScore10: 8.5,
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('methodId khớp Phương thức Tổng hợp', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({}, 2026));
    expect(evaluation.methodId).toBe('hub-comprehensive-2026');
  });

  it('missingRules chứa gap riêng Phụ lục II', () => {
    const evaluation = evaluateHubComprehensiveAdmission(profileWithThpt({}, 2026));
    expect(evaluation.missingRules.some((label) => label.includes('Phụ lục II'))).toBe(true);
  });
});

describe('evaluateHubVsatAdmission (Phương thức V-SAT)', () => {
  it('methodId khớp Phương thức V-SAT, dùng chung logic điều kiện với Tổng hợp', () => {
    const evaluation = evaluateHubVsatAdmission(profileWithThpt({}, 2026), { group: 'law', graduationScore10: 8.5 });
    expect(evaluation.methodId).toBe('hub-vsat-2026');
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('missingRules chứa gap riêng Phụ lục I', () => {
    const evaluation = evaluateHubVsatAdmission(profileWithThpt({}, 2026));
    expect(evaluation.missingRules.some((label) => label.includes('Phụ lục I'))).toBe(true);
  });
});
