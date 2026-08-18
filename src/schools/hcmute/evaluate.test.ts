import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateHcmuteAdmission } from './evaluate';

const a01Combination = { combinationId: 'A01', mainSubjectId: 'math' as const, subjects: ['math', 'physics', 'english'] as const };

describe('evaluateHcmuteAdmission', () => {
  it('returns unknown eligibility and asks for a subject combination when none is chosen', () => {
    const result = evaluateHcmuteAdmission({});
    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('unknown');
    expect(result.missingRequirements?.some((req) => req.code === 'hcmute-subject-combination')).toBe(true);
  });

  it('reports missing profile-input requirements when subject scores are absent', () => {
    const result = evaluateHcmuteAdmission({}, { subjectContext: a01Combination });
    expect(result.missingRequirements?.some((req) => req.code === 'hcmute-thpt-math')).toBe(true);
  });

  it('computes HLy.1, bonus, priority and eligibility for a complete profile (Tier A worked example)', () => {
    const profile: ApplicantProfile = {
      thpt: { scores: { math: 8.5, physics: 8.0, english: 9.7 } },
      priority: { region: 'KV2' },
    };
    const result = evaluateHcmuteAdmission(profile, { subjectContext: a01Combination, bonus: { provincialRank: 'nhi' } });
    expect(result.confidence).toBe('partial');
    expect(result.eligibility?.status).toBe('eligible');
    const academicStep = result.explanation.find((step) => step.id === 'hcmute-academic-score-hly1');
    expect(academicStep?.output).toBe(26.025);
    const bonusStep = result.explanation.find((step) => step.id === 'hcmute-bonus');
    expect(bonusStep?.output).toBe(1.0);
    const priorityStep = result.explanation.find((step) => step.id === 'hcmute-priority');
    // Học lực dùng ở đây là HLy.1 (26,025), khác ĐHL=26,850 trong ví dụ gốc (lấy từ HLy.2, công
    // thức evaluator này chưa tính được — xem knowledgeGaps.ts) nên điểm ưu tiên khác ví dụ gốc:
    // (30 - (26,025+1,00))/7,50 × 0,25 = 0,10.
    expect(priorityStep?.output).toBe(0.1);
    expect(result.score).toBeUndefined();
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  it('reports ineligible below the general 15/30 threshold', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 3, physics: 3, english: 3 } } };
    const result = evaluateHcmuteAdmission(profile, { subjectContext: a01Combination });
    expect(result.eligibility?.status).toBe('ineligible');
  });

  const a01Profile: ApplicantProfile = { thpt: { scores: { math: 8.5, physics: 8.0, english: 9.7 } } };

  it('computes HLy.3 (ĐGNL route) without needing ĐXTT — not blocked by the dxtt gap', () => {
    const result = evaluateHcmuteAdmission(a01Profile, { subjectContext: a01Combination, dgnlRoute: { dgnlRawScore: 1200 } });
    const hly3Step = result.explanation.find((step) => step.id === 'hcmute-academic-score-hly3');
    expect(hly3Step?.output).toBe(26.82); // 0.8*26.025 + 0.2*(1200/40) = 20.82 + 6
    const maxStep = result.explanation.find((step) => step.id === 'hcmute-academic-score-hly-max');
    expect(maxStep?.output).toBe(26.82);
    expect(maxStep?.description).toContain('HLy.3');
    expect(result.missingInputs.some((msg) => msg.includes('ĐXTT'))).toBe(false);
  });

  it('reports a missing-input for ĐXTT when transcriptRoute is declared without dxtt30 (genuine gap, not out-of-scope)', () => {
    const result = evaluateHcmuteAdmission(a01Profile, {
      subjectContext: a01Combination,
      transcriptRoute: { scores: { math: 9.0, physics: 8.5, english: 9.0 } },
    });
    expect(result.missingRequirements?.some((req) => req.code === 'hcmute-dxtt')).toBe(true);
    expect(result.explanation.some((step) => step.id === 'hcmute-academic-score-hly2')).toBe(false);
  });

  it('does not ask for ĐXTT when transcriptRoute is simply absent (out of scope for this applicant)', () => {
    const result = evaluateHcmuteAdmission(a01Profile, { subjectContext: a01Combination });
    expect(result.missingRequirements?.some((req) => req.code === 'hcmute-dxtt')).toBe(false);
  });

  it('computes HLy.2 when transcriptRoute is fully declared (scores + dxtt30) and feeds HLy.max into priority', () => {
    const result = evaluateHcmuteAdmission(a01Profile, {
      subjectContext: a01Combination,
      transcriptRoute: { scores: { math: 9.0, physics: 8.5, english: 9.0 }, dxtt30: 0 },
    });
    const hly2Step = result.explanation.find((step) => step.id === 'hcmute-academic-score-hly2');
    expect(hly2Step?.output).toBe(26.145);
    const maxStep = result.explanation.find((step) => step.id === 'hcmute-academic-score-hly-max');
    expect(maxStep?.output).toBe(26.145);
    expect(maxStep?.description).toContain('HLy.2');
  });

  describe('programId → formula group wiring', () => {
    it('falls back to the standard group when no programId is given (existing default behaviour)', () => {
      const result = evaluateHcmuteAdmission(a01Profile, { subjectContext: a01Combination });
      expect(result.explanation.find((step) => step.id === 'hcmute-academic-score-hly1')?.output).toBe(26.025);
    });

    it('returns unavailable/partial for an unrecognized programId instead of silently defaulting to standard', () => {
      const result = evaluateHcmuteAdmission(a01Profile, { subjectContext: a01Combination, programId: 'nganh-khong-ro' });
      expect(result.confidence).toBe('partial');
      expect(result.eligibility?.status).toBe('unknown');
      expect(result.missingRequirements?.some((req) => req.code === 'hcmute-program-not-recognized')).toBe(true);
      expect(result.explanation.length).toBe(0);
    });

    it('uses the English group formula (no main-subject weighting) for programId "ngon-ngu-anh"', () => {
      const profile: ApplicantProfile = { thpt: { scores: { math: 8, physics: 8, english: 8 } } };
      const combo = { combinationId: 'A01', mainSubjectId: 'math' as const, subjects: ['math', 'physics', 'english'] as const };
      const result = evaluateHcmuteAdmission(profile, { subjectContext: combo, programId: 'ngon-ngu-anh' });
      expect(result.explanation.find((step) => step.id === 'hcmute-academic-score-hly1')?.output).toBe(24); // 8+8+8, no ×2/÷4×3
    });

    it('rejects a 3-subject combination for the design-architecture group (needs exactly 2)', () => {
      const combo = { combinationId: 'A01', mainSubjectId: 'math' as const, subjects: ['math', 'physics', 'english'] as const };
      const result = evaluateHcmuteAdmission(a01Profile, { subjectContext: combo, programId: 'kien-truc', aptitudeScore: 7 });
      expect(result.missingRequirements?.some((req) => req.code === 'hcmute-subject-count-mismatch')).toBe(true);
    });

    it('requires aptitudeScore for the design-architecture group before computing anything', () => {
      const combo = { combinationId: 'design', mainSubjectId: 'math' as const, subjects: ['math', 'physics'] as const };
      const result = evaluateHcmuteAdmission({ thpt: { scores: { math: 8, physics: 8 } } }, { subjectContext: combo, programId: 'kien-truc' });
      expect(result.missingRequirements?.some((req) => req.code === 'hcmute-aptitude-score')).toBe(true);
    });

    it('computes HLy.1 for the design-architecture group and marks eligibility unknown (threshold unverified for this group)', () => {
      const combo = { combinationId: 'design', mainSubjectId: 'math' as const, subjects: ['math', 'physics'] as const };
      const result = evaluateHcmuteAdmission({ thpt: { scores: { math: 8, physics: 8 } } }, { subjectContext: combo, programId: 'kien-truc', aptitudeScore: 7 });
      expect(result.explanation.find((step) => step.id === 'hcmute-academic-score-hly1')?.output).toBe(23); // 8+8+7
      expect(result.eligibility?.status).toBe('unknown');
    });
  });

  describe('programId-specific eligibility threshold (SP tiếng Anh/SP công nghệ/Luật)', () => {
    const highScoreProfile: ApplicantProfile = { thpt: { scores: { math: 9, physics: 9, english: 9 } } };

    it('asks for grade12Excellent before evaluating the special threshold', () => {
      const result = evaluateHcmuteAdmission(highScoreProfile, { subjectContext: a01Combination, programId: 'su-pham-tieng-anh' });
      expect(result.eligibility?.status).toBe('unknown');
      expect(result.missingRequirements?.some((req) => req.code === 'hcmute-grade12-excellent')).toBe(true);
    });

    it('passes the special threshold when grade12Excellent + totalScore30 ≥ 18', () => {
      const result = evaluateHcmuteAdmission(highScoreProfile, { subjectContext: a01Combination, programId: 'su-pham-tieng-anh', grade12Excellent: true });
      expect(result.eligibility?.status).toBe('eligible');
    });

    it('fails the special threshold when grade12Excellent is false even with a high score', () => {
      const result = evaluateHcmuteAdmission(highScoreProfile, { subjectContext: a01Combination, programId: 'su-pham-tieng-anh', grade12Excellent: false });
      expect(result.eligibility?.status).toBe('ineligible');
    });

    it('applies the general 15/30 threshold (not the special one) when programId is absent, even for a high-score profile', () => {
      const result = evaluateHcmuteAdmission(highScoreProfile, { subjectContext: a01Combination });
      expect(result.eligibility?.status).toBe('eligible');
      expect(result.missingRequirements?.some((req) => req.code === 'hcmute-grade12-excellent')).toBe(false);
    });

    it('additionally requires the Toán/Ngữ văn ≥ 6.0 condition for programId "luat"', () => {
      const lowMathCombo = { combinationId: 'D01', mainSubjectId: 'math' as const, subjects: ['math', 'literature', 'english'] as const };
      const profile: ApplicantProfile = { thpt: { scores: { math: 5.0, literature: 5.5, english: 9 } } }; // totalScore30=19.5 ≥18, but math/literature <6.0
      const result = evaluateHcmuteAdmission(profile, { subjectContext: lowMathCombo, programId: 'luat', grade12Excellent: true });
      expect(result.eligibility?.status).toBe('ineligible');
    });
  });
});
