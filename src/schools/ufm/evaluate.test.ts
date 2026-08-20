import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateUfmThptAdmission, evaluateUfmDgnlAdmission, evaluateUfmVsatAdmission, evaluateUfmHocbaAdmission } from './evaluate';

const combo = { combinationId: 'A01', subjects: ['math', 'physics', 'english'] as const };

describe('evaluateUfmThptAdmission', () => {
  it('returns partial when no subject combination is chosen', () => {
    const result = evaluateUfmThptAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-subject-combination')).toBe(true);
    expect(result.score).toBeUndefined();
  });

  it('reports missing THPT scores', () => {
    const result = evaluateUfmThptAdmission({}, { subjectContext: combo });
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-thpt-math')).toBe(true);
    expect(result.confidence).toBe('partial');
  });

  it('computes an exact-verified score for a complete profile with no bonus achievement', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } }, priority: { region: 'KV1' } };
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo });
    expect(result.confidence).toBe('exact-verified');
    const academicStep = result.explanation.find((s) => s.id === 'ufm-academic-score');
    expect(academicStep?.output).toBe(21);
    expect(result.score?.scale).toBe(30);
    expect(result.eligibility?.status).toBe('eligible'); // standard group, 21 >= 16
  });

  it('reports ineligible below the standard 16/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 5, english: 5 } } }; // total 15
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // score itself is still exact/computable
  });

  it('applies law-economics sub-conditions using the raw math score read from the profile', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 5, physics: 8, english: 8 } } }; // total 21, math 5 < 6
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo, thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible'); // total passes but math floor fails
  });

  it('adds the bonus (b1/b2/b3) to the final score and stays exact-verified', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // raw30 = 21
    const result = evaluateUfmThptAdmission(profile, {
      subjectContext: combo,
      bonus: { nationalAchievementLevel: 'third', giftedSchoolStudent: true, englishCertificateTier: 0.5 }, // 1.5 + 0.75 + 0.5 = 2.75
    });
    expect(result.confidence).toBe('exact-verified');
    expect(result.score?.value).toBe(23.75); // 21 + 0 (priority) + 2.75 (bonus)
    const bonusStep = result.explanation.find((s) => s.id === 'ufm-bonus');
    expect(bonusStep?.output).toBe(2.75);
  });

  it('caps the bonus at 3,0 (10% of thang 30) even when b1+b2+b3 would exceed it', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 7, english: 6 } } }; // raw30 = 21
    const result = evaluateUfmThptAdmission(profile, {
      subjectContext: combo,
      bonus: { nationalAchievementLevel: 'first', nationalEncouragementAward: true, englishCertificateTier: 1.5 },
    });
    expect(result.score?.value).toBe(24); // 21 + 0 (priority) + 3 (bonus capped)
  });

  it('clamps the final score at 30 even when raw + priority + bonus would exceed it', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 10, physics: 10, english: 9 } }, priority: { region: 'KV1', category: 'UT1' } }; // raw30 = 29
    const result = evaluateUfmThptAdmission(profile, { subjectContext: combo, bonus: { nationalAchievementLevel: 'first' } });
    expect(result.score?.value).toBe(30);
  });
});

describe('evaluateUfmDgnlAdmission — quy đổi qua bảng bách phân vị (mục 3.2) rồi cộng ưu tiên/điểm cộng', () => {
  it('asks for ĐGNL score when absent', () => {
    const result = evaluateUfmDgnlAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-dgnl-total')).toBe(true);
  });

  it('below the eligibility threshold: no score (bảng quy đổi không phủ khoảng dưới ngưỡng)', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 656 } } };
    const result = evaluateUfmDgnlAdmission(profile);
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.confidence).toBe('exact-verified'); // certain about ineligibility itself
    expect(result.score).toBeUndefined();
  });

  it('at the eligibility floor (657 = Khoảng 6 min): converts to y=16.00 exactly', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 657 } } };
    const result = evaluateUfmDgnlAdmission(profile);
    expect(result.eligibility?.status).toBe('eligible');
    const conversionStep = result.explanation.find((s) => s.id === 'ufm-dgnl-conversion');
    expect(conversionStep?.output).toBe(16.0);
    expect(result.score?.value).toBe(16.0);
    expect(result.confidence).toBe('exact-verified');
  });

  it('applies the law-economics 720/1200 threshold', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 700 } } };
    const result = evaluateUfmDgnlAdmission(profile, { thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('clamps scores above the published table ceiling (1139) to y=30', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 1200 } } };
    const result = evaluateUfmDgnlAdmission(profile);
    expect(result.score?.value).toBe(30);
  });

  it('adds bonus on top of the converted score', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 657 } } }; // y = 16.00
    const result = evaluateUfmDgnlAdmission(profile, { bonus: { englishCertificateTier: 1.5 } });
    expect(result.score?.value).toBe(17.5); // 16.00 + 0 (priority) + 1.5 (bonus)
  });
});

describe('evaluateUfmVsatAdmission — quy đổi qua bảng bách phân vị (mục 3.3) rồi cộng ưu tiên/điểm cộng', () => {
  it('asks for V-SAT score when absent', () => {
    const result = evaluateUfmVsatAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-vsat-score')).toBe(true);
  });

  it('below the eligibility threshold: no score', () => {
    const result = evaluateUfmVsatAdmission({}, { vsatScore: 240, thresholdGroup: 'standard' });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.score).toBeUndefined();
  });

  it('official worked example (mục 3.4): V-SAT 360.00 → y=23.98', () => {
    const result = evaluateUfmVsatAdmission({}, { vsatScore: 360, thresholdGroup: 'standard' });
    expect(result.eligibility?.status).toBe('eligible');
    const conversionStep = result.explanation.find((s) => s.id === 'ufm-vsat-conversion');
    expect(conversionStep?.output).toBe(23.98);
    expect(result.score?.value).toBe(23.98);
  });

  it('applies the law-economics 270 threshold', () => {
    const result = evaluateUfmVsatAdmission({}, { vsatScore: 260, thresholdGroup: 'law-economics' });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  it('reads priority region/category from the shared profile', () => {
    const profile: ApplicantProfile = { priority: { region: 'KV1' } };
    const eligibleAtCeiling = evaluateUfmVsatAdmission(profile, { vsatScore: 450 }); // y = 30.00 (ceiling) → priority reduced to 0
    expect(eligibleAtCeiling.score?.value).toBe(30);
  });
});

describe('evaluateUfmHocbaAdmission — TB 3 năm × tổ hợp, quy đổi qua bảng bách phân vị (mục 3.1)', () => {
  it('returns partial when no subject combination is chosen', () => {
    const result = evaluateUfmHocbaAdmission({}, {});
    expect(result.confidence).toBe('partial');
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-hocba-subject-combination')).toBe(true);
  });

  it('reports missing transcript years — needs all 3 years (10/11/12), not partial averages', () => {
    const profile: ApplicantProfile = { transcript: { grade10: { math: 8 }, grade11: { math: 8 } } }; // missing grade12
    const result = evaluateUfmHocbaAdmission(profile, { subjectContext: combo });
    expect(result.missingRequirements?.some((r) => r.code === 'ufm-hocba-math')).toBe(true);
    expect(result.confidence).toBe('partial');
  });

  it('below the eligibility threshold: no score', () => {
    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: 6, physics: 6, english: 5.9 },
        grade11: { math: 6, physics: 6, english: 5.9 },
        grade12: { math: 6, physics: 6, english: 5.9 },
      },
    }; // raw30 = 17.90 < 18
    const result = evaluateUfmHocbaAdmission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('ineligible');
    expect(result.score).toBeUndefined();
  });

  it('at the eligibility floor (raw30=18.00 = Khoảng 6 min): converts to y=16.00 exactly', () => {
    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: 6, physics: 6, english: 6 },
        grade11: { math: 6, physics: 6, english: 6 },
        grade12: { math: 6, physics: 6, english: 6 },
      },
    };
    const result = evaluateUfmHocbaAdmission(profile, { subjectContext: combo });
    expect(result.eligibility?.status).toBe('eligible');
    const academicStep = result.explanation.find((s) => s.id === 'ufm-hocba-academic-score');
    expect(academicStep?.output).toBe(18);
    const conversionStep = result.explanation.find((s) => s.id === 'ufm-hocba-conversion');
    expect(conversionStep?.output).toBe(16.0);
    expect(result.score?.value).toBe(16.0);
  });

  it('at the absolute ceiling (raw30=30.00): converts to y=30.00, priority reduced to 0', () => {
    const profile: ApplicantProfile = {
      transcript: {
        grade10: { math: 10, physics: 10, english: 10 },
        grade11: { math: 10, physics: 10, english: 10 },
        grade12: { math: 10, physics: 10, english: 10 },
      },
      priority: { region: 'KV1' },
    };
    const result = evaluateUfmHocbaAdmission(profile, { subjectContext: combo });
    expect(result.score?.value).toBe(30);
  });
});
