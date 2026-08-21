import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHiuThptExamAdmission, evaluateHiuVactAdmission } from './evaluate';

const A01_SUBJECTS = ['math', 'physics', 'english'] as const;

function profileWithThpt(scores: Partial<Record<string, number>>): ApplicantProfile {
  return { thpt: { scores } };
}

function profileWithVact(total: number): ApplicantProfile {
  return { exams: { vact: { total, totalSource: 'user-total-input' } } };
}

describe('evaluateHiuThptExamAdmission', () => {
  it('chưa chọn tổ hợp -> unknown + missingRequirement school-context', () => {
    const evaluation = evaluateHiuThptExamAdmission(profileWithThpt({}));
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hiu-subject-combination')).toBe(true);
  });

  it('nhóm standard, tổng 15 -> eligible', () => {
    const evaluation = evaluateHiuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 5 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm standard, tổng 14.99 -> ineligible', () => {
    const evaluation = evaluateHiuThptExamAdmission(profileWithThpt({ math: 5, physics: 5, english: 4.99 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'standard',
    });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm healthLicenseOrLaw -> luôn unknown dù điểm cao (ngưỡng Bộ GD&ĐT quy định, chưa có số)', () => {
    const evaluation = evaluateHiuThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
      group: 'healthLicenseOrLaw',
    });
    expect(evaluation.eligibility?.status).toBe('unknown');
  });

  it('confidence luôn partial, không có score', () => {
    const evaluation = evaluateHiuThptExamAdmission(profileWithThpt({ math: 9, physics: 9, english: 9 }), {
      subjectContext: { combinationId: 'A01', subjects: A01_SUBJECTS },
    });
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
  });
});

describe('evaluateHiuVactAdmission', () => {
  it('chưa có điểm ĐGNL -> unknown + missingRequirement', () => {
    const evaluation = evaluateHiuVactAdmission({});
    expect(evaluation.eligibility?.status).toBe('unknown');
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hiu-vact-total')).toBe(true);
  });

  it('nhóm standard, 650 -> eligible', () => {
    const evaluation = evaluateHiuVactAdmission(profileWithVact(650), { group: 'standard' });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('nhóm medicineDentistryLaw, 699 -> ineligible (ngưỡng 700)', () => {
    const evaluation = evaluateHiuVactAdmission(profileWithVact(699), { group: 'medicineDentistryLaw' });
    expect(evaluation.eligibility?.status).toBe('ineligible');
  });

  it('nhóm traditionalMedicinePharmacy, 675 -> eligible', () => {
    const evaluation = evaluateHiuVactAdmission(profileWithVact(675), { group: 'traditionalMedicinePharmacy' });
    expect(evaluation.eligibility?.status).toBe('eligible');
  });

  it('methodId khớp phương thức ĐGNL', () => {
    const evaluation = evaluateHiuVactAdmission(profileWithVact(800));
    expect(evaluation.methodId).toBe('hiu-vact-2026');
  });
});
