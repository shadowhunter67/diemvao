import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../core/applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { getEvaluationDisplayStatus } from './evaluationDisplay';
import { evaluateApplicantAcrossSchools, evaluateComparisonSelections } from './evaluateApplicantAcrossSchools';
import type { UsshEvaluationContext } from '../schools/ussh/evaluate';
import { hcmusProgramThresholds } from '../schools/hcmus/data/programThresholds';
import { usshPrograms } from '../schools/ussh/data/programs';
import { UHS_PROGRAMS } from '../schools/uhs/programs';
import { iuPrograms } from '../schools/iu/data/programs';
import { AGU_PROGRAM_THRESHOLDS_2026 } from '../schools/agu/data/thresholds';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

const profile: ApplicantProfile = {
  exams: { vact: { total: 980, components: { vietnamese: 250, english: 240, math: 260, scientificThinking: 230 } } },
  thpt: { scores: { math: 8.8, physics: 8.4, english: 9 } },
  transcript: {
    grade10: { math: 9, physics: 8.5, english: 9.1 },
    grade11: { math: 9.2, physics: 8.6, english: 9 },
    grade12: { math: 9.1, physics: 8.7, english: 9.2 },
  },
};

const a01 = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!;

function completeContexts() {
  return {
    hcmut: {
      methodContext: { combination: a01, bonus: { reward: 0, considerationReward: 0, encouragement: 0 }, priorityRaw30Scale: 0 },
      selectedProgramId: 'khoa-hoc-may-tinh',
    },
    ueh: { selectedProgramId: 'kinh-te' },
    uel: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'kinh-te' },
    uit: { selectedProgramId: 'khoa-hoc-may-tinh', programId: 'khoa-hoc-may-tinh' },
    hcmus: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'hcmus-75202a1' },
    ussh: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'ussh-7310401' } as UsshEvaluationContext & {
      selectedProgramId: string;
    },
    uhs: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'uhs-7720101' },
    iu: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, programId: 'iu-7340101' },
    agu: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramCode: '7480201' },
  };
}

describe('evaluateApplicantAcrossSchools', () => {
  it('selected comparison orchestration returns [] when there are no selections', () => {
    expect(evaluateComparisonSelections(profile, [])).toEqual([]);
  });

  it('selected comparison orchestration supports the same school with different programs', () => {
    const summaries = evaluateComparisonSelections(profile, [
      { id: 'hcmus-a', schoolId: 'hcmus', programId: 'hcmus-75202a1', context: { combinationId: 'A01' } },
      { id: 'hcmus-b', schoolId: 'hcmus', programId: 'hcmus-7520207', context: { combinationId: 'A01' } },
    ]);
    expect(summaries.map((summary) => summary.selectionId)).toEqual(['hcmus-a', 'hcmus-b']);
    expect(summaries.map((summary) => summary.schoolId)).toEqual(['hcmus', 'hcmus']);
    expect(summaries.every((summary) => summary.evaluation.score)).toBe(true);
  });

  it('selected comparison orchestration preserves USSH exact and bonus-partial semantics', () => {
    const [exact, partial] = evaluateComparisonSelections(profile, [
      { id: 'ussh-exact', schoolId: 'ussh', programId: 'ussh-7310401', context: { combinationId: 'A01' } },
      { id: 'ussh-partial', schoolId: 'ussh', programId: 'ussh-7310401', context: { combinationId: 'A01', hasUsshBonusAchievement: true } },
    ]);
    expect(exact.evaluation.confidence).toBe('exact-verified');
    expect(exact.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(partial.evaluation.confidence).toBe('partial');
    expect(partial.evaluation.score).toBeUndefined();
    expect(partial.cutoffComparisons).toBeUndefined();
  });

  it('selected comparison orchestration supports new HCMUE eligibility-only entries', () => {
    const [hcmue] = evaluateComparisonSelections(profile, [
      { id: 'hcmue-it', schoolId: 'hcmue', programId: 'hcmue-7480201', context: { combinationId: 'A01' } },
    ]);
    expect(hcmue.selectionId).toBe('hcmue-it');
    expect(hcmue.schoolId).toBe('hcmue');
    expect(hcmue.evaluation.confidence).toBe('partial');
    expect(hcmue.evaluation.score).toBeUndefined();
    expect(hcmue.cutoffComparisons).toBeUndefined();
  });

  /**
   * Trước refactor (`comparisonRegistry.ts`), HCMUE có module thật trong `schoolRegistry` + branch
   * trong `evaluateComparisonSelections` nhưng KHÔNG có mặt ở roster mặc định này — đúng loại
   * integration drift refactor này ngăn (school "implement rồi" nhưng bị quên ở 1 đường compare).
   * Giờ roster mặc định lặp qua đúng `schoolComparisonAdapters` (1 nguồn duy nhất), nên HCMUE tự
   * động xuất hiện — xem `docs/architecture.md` Batch 16.
   */
  it('renders the canonical 19-school compare roster in product order (incl. HCMUE/HCMUTE/TDTU/HUFLIT/HUTECH/UFM/IUH/HCMULAW/VLU/UMP, fixed integration drift)', () => {
    expect(evaluateApplicantAcrossSchools(profile).map((summary) => summary.schoolId)).toEqual([
      'hcmut',
      'ueh',
      'iu',
      'uel',
      'hcmus',
      'ussh',
      'uhs',
      'uit',
      'agu',
      'hcmue',
      'hcmute',
      'tdtu',
      'huflit',
      'hutech',
      'ufm',
      'iuh',
      'hcmulaw',
      'vlu',
      'ump',
    ]);
  });

  it('uses real program registries for compare selectors', () => {
    expect(hcmusProgramThresholds).toHaveLength(39);
    expect(usshPrograms).toHaveLength(54);
    expect(UHS_PROGRAMS).toHaveLength(6);
    expect(iuPrograms).toHaveLength(38);
    expect(AGU_PROGRAM_THRESHOLDS_2026).toHaveLength(43);
  });

  it('same complete profile and contexts produce exact HCMUT, UEH, IU, UEL, HCMUS, USSH (no bonus achievement) and partial remaining schools', () => {
    const frozen = deepFreeze(structuredClone(profile));
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(frozen, completeContexts()).map((summary) => [summary.schoolId, summary]));

    for (const schoolId of ['hcmut', 'ueh', 'iu', 'uel', 'hcmus', 'ussh']) {
      expect(getEvaluationDisplayStatus(bySchool[schoolId].evaluation.confidence)).toBe('exact');
      expect(bySchool[schoolId].evaluation.score).toBeDefined();
    }
    for (const schoolId of ['uhs', 'uit', 'agu', 'hcmue', 'hcmute']) {
      expect(getEvaluationDisplayStatus(bySchool[schoolId].evaluation.confidence)).toBe('partial');
    }
  });

  it('USSH stays partial (no score) when applicant declares a bonus achievement', () => {
    const contexts = completeContexts();
    contexts.ussh = { ...contexts.ussh, hasBonusAchievement: true };
    const ussh = evaluateApplicantAcrossSchools(profile, contexts).find((summary) => summary.schoolId === 'ussh')!;
    expect(getEvaluationDisplayStatus(ussh.evaluation.confidence)).toBe('partial');
    expect(ussh.evaluation.score).toBeUndefined();
  });

  it('does not mutate ApplicantProfile', () => {
    const before = structuredClone(profile);
    const frozen = deepFreeze(structuredClone(profile));
    evaluateApplicantAcrossSchools(frozen, completeContexts());
    expect(frozen).toEqual(before);
  });

  it('missing HCMUT context cannot create fake exact score', () => {
    const hcmut = evaluateApplicantAcrossSchools(profile).find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
  });

  it('classifies actionable missing requirements without mutating context', () => {
    const frozenContext = deepFreeze({ uel: { subjectContext: { combinationId: 'A01', subjects: a01.subjects } } });
    const incompleteProfile: ApplicantProfile = { exams: { vact: { total: 980 } }, thpt: { scores: { math: 8.8, english: 9 } } };
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(incompleteProfile, frozenContext).map((summary) => [summary.schoolId, summary]));

    expect(bySchool.hcmut.evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'hcmut-context' }));
    expect(bySchool.uel.evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'uel-thpt-physics' }));
    expect(bySchool.uit.evaluation.missingRequirements?.some((requirement) => requirement.kind === 'official-rule')).toBe(true);
    expect(frozenContext.uel.subjectContext.combinationId).toBe('A01');
  });

  it('exact schools expose cutoff gaps only when selected program and scale are compatible', () => {
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(profile, completeContexts()).map((summary) => [summary.schoolId, summary]));
    expect(bySchool.hcmut.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(bySchool.ueh.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(bySchool.iu.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(bySchool.uel.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(bySchool.ussh.cutoffComparisons?.[0]?.difference).toBeDefined();
    expect(bySchool.hcmus.cutoffComparisons).toBeUndefined();
  });

  it('does not expose USSH cutoff comparison outside the no-bonus exact supported scope', () => {
    const contexts = completeContexts();
    contexts.ussh = { ...contexts.ussh, hasBonusAchievement: true };
    const ussh = evaluateApplicantAcrossSchools(profile, contexts).find((summary) => summary.schoolId === 'ussh')!;
    expect(getEvaluationDisplayStatus(ussh.evaluation.confidence)).toBe('partial');
    expect(ussh.evaluation.score).toBeUndefined();
    expect(ussh.cutoffComparisons).toBeUndefined();
  });

  it('does not expose USSH cutoff comparison when selected program has no compatible cutoff record', () => {
    const contexts = completeContexts();
    contexts.ussh.selectedProgramId = 'not-a-real-ussh-program';
    const ussh = evaluateApplicantAcrossSchools(profile, contexts).find((summary) => summary.schoolId === 'ussh')!;
    expect(ussh.evaluation.confidence).toBe('exact-verified');
    expect(ussh.cutoffComparisons?.[0]?.referenceType).toBe('none');
  });

  it('does not expose UEL cutoff comparison when selected program has no compatible cutoff record', () => {
    const contexts = completeContexts();
    contexts.uel.selectedProgramId = 'not-a-real-uel-program';
    const uel = evaluateApplicantAcrossSchools(profile, contexts).find((summary) => summary.schoolId === 'uel')!;
    expect(uel.evaluation.confidence).toBe('exact-verified');
    expect(uel.cutoffComparisons?.[0]?.referenceType).toBe('none');
  });

  it('partial schools never expose unsafe cutoff gaps even when programs are selected', () => {
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(profile, completeContexts()).map((summary) => [summary.schoolId, summary]));
    for (const schoolId of ['uit', 'uhs', 'agu', 'hcmue', 'hcmute']) {
      expect(bySchool[schoolId].cutoffComparisons).toBeUndefined();
      expect(bySchool[schoolId].evaluation.score).toBeUndefined();
    }
    expect(bySchool.hcmus.evaluation.explanation).toContainEqual(expect.objectContaining({ id: 'hcmus-program-threshold', output: 24 }));
    expect(bySchool.uhs.evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'official-rule', code: 'uhs-method2-weights-range' }));
  });

  it('stale HCMUT context with incomplete profile cannot create fake exact score', () => {
    const incompleteProfile: ApplicantProfile = { exams: { vact: { total: 980 } }, thpt: { scores: { math: 8.8, english: 9 } } };
    const hcmut = evaluateApplicantAcrossSchools(incompleteProfile, completeContexts()).find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
  });

  it('cleared factual profile with persisted contexts stays unavailable, not stale exact', () => {
    const hcmut = evaluateApplicantAcrossSchools({}, completeContexts()).find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
  });
});
