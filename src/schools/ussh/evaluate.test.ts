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

  it('missingRules liệt kê 1 gap chính thức còn lại (re-audit 2026-08-15: chỉ còn mức cộng theo tiêu chí)', () => {
    const evaluation = evaluateUsshAdmission({});
    expect(evaluation.missingRules).toHaveLength(1);
  });

  it('ĐT3 tính được khi đủ ĐGNL + học bạ, không có thành tích cộng điểm -> exact-verified có score', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    const dhlStep = evaluation.explanation.find((s) => s.id === 'ussh-dhl-score');
    expect(dhlStep).toBeDefined();
    expect(dhlStep?.scale).toBe(100);
    const finalStep = evaluation.explanation.find((s) => s.id === 'ussh-final');
    expect(finalStep).toBeDefined();
    expect(evaluation.score).toBeDefined();
    expect(evaluation.confidence).toBe('exact-verified');
  });

  it('DT1 exact supported scope uses THPT + DGNL + transcript on scale 100', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score?.scale).toBe(100);
    // Đối tượng xét tuyển là structured metadata (`comparisonContext`), KHÔNG phải suy từ label —
    // xem invariant test "label wording change does not affect applicant type" bên dưới.
    expect(evaluation.comparisonContext?.applicantTypeId).toBe('DT1');
  });

  it('DT2 exact supported scope uses THPT + transcript on scale 100', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score?.scale).toBe(100);
    expect(evaluation.comparisonContext?.applicantTypeId).toBe('DT2');
  });

  it('DT3 (ĐGNL + học bạ, không THPT) expose comparisonContext.applicantTypeId đúng', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.comparisonContext?.applicantTypeId).toBe('DT3');
  });

  it('thay đổi wording label không làm mất/sai applicantTypeId — evaluation text có thể không chứa "DT1/DT2/DT3" mà business behavior vẫn đúng', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      thpt: { scores: { math: 8, physics: 7, chemistry: 8 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    const finalLabel = evaluation.explanation.find((s) => s.id === 'ussh-final')?.label ?? '';
    // Label hiện tại KHÔNG chứa raw token "DT1" nữa (đã đổi wording sang "Đối tượng 1") — chứng
    // minh business identity không còn phụ thuộc chuỗi hiển thị này.
    expect(finalLabel).not.toMatch(/\bDT1\b/);
    expect(evaluation.comparisonContext?.applicantTypeId).toBe('DT1');
  });

  it('có thành tích cộng điểm (hasBonusAchievement=true) -> vẫn partial, KHÔNG set score', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 900 } },
      transcript: {
        grade10: { math: 8, physics: 7, chemistry: 8 },
        grade11: { math: 8, physics: 7, chemistry: 8 },
        grade12: { math: 8, physics: 7, chemistry: 8 },
      },
    };
    const evaluation = evaluateUsshAdmission(profile, {
      subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] },
      hasBonusAchievement: true,
    });
    expect(evaluation.score).toBeUndefined();
    expect(evaluation.confidence).toBe('partial');
    const bonusStep = evaluation.explanation.find((s) => s.id === 'ussh-bonus');
    expect(bonusStep).toBeDefined();
  });

  it('không profile mutation — evaluateUsshAdmission không sửa profile truyền vào', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 900 } } };
    const snapshot = JSON.parse(JSON.stringify(profile));
    evaluateUsshAdmission(profile, { subjectContext: { combinationId: 'A00', subjects: ['math', 'physics', 'chemistry'] } });
    expect(profile).toEqual(snapshot);
  });
});
