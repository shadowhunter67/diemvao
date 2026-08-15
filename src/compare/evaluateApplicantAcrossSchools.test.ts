import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../core/applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { getEvaluationDisplayStatus } from './evaluationDisplay';
import { evaluateApplicantAcrossSchools } from './evaluateApplicantAcrossSchools';
import { hcmusProgramThresholds } from '../schools/hcmus/data/programThresholds';
import { usshPrograms } from '../schools/ussh/data/programs';
import { UHS_PROGRAMS } from '../schools/uhs/programs';
import { iuPrograms } from '../schools/iu/data/programs';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

const profile: ApplicantProfile = {
  exams: {
    vact: {
      total: 980,
      components: { vietnamese: 250, english: 240, math: 260, scientificThinking: 230 },
    },
  },
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
      methodContext: {
        combination: a01,
        bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 0,
      },
      selectedProgramId: 'khoa-hoc-may-tinh',
    },
    ueh: { selectedProgramId: 'kinh-te' },
    uel: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'kinh-te' },
    uit: { selectedProgramId: 'khoa-hoc-may-tinh', programId: 'khoa-hoc-may-tinh' },
    hcmus: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'hcmus-75202a1' },
    ussh: { subjectContext: { combinationId: 'A01', subjects: a01.subjects } },
    uhs: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, selectedProgramId: 'uhs-7720101' },
    iu: { subjectContext: { combinationId: 'A01', subjects: a01.subjects }, programId: 'iu-7340101' },
  };
}

describe('evaluateApplicantAcrossSchools', () => {
  it('renders the canonical 8-school compare roster in product order', () => {
    const summaries = evaluateApplicantAcrossSchools(profile);
    expect(summaries.map((summary) => summary.schoolId)).toEqual(['hcmut', 'ueh', 'iu', 'uel', 'hcmus', 'ussh', 'uhs', 'uit']);
  });

  it('uses real program registries for compare selectors', () => {
    expect(hcmusProgramThresholds).toHaveLength(39);
    expect(usshPrograms).toHaveLength(54);
    expect(UHS_PROGRAMS).toHaveLength(6);
    expect(iuPrograms).toHaveLength(38);
  });

  it('same complete profile and contexts produce exact HCMUT, UEH, IU and partial remaining schools', () => {
    const frozen = deepFreeze(structuredClone(profile));
    const summaries = evaluateApplicantAcrossSchools(frozen, completeContexts());
    const bySchool = Object.fromEntries(summaries.map((summary) => [summary.schoolId, summary]));

    expect(getEvaluationDisplayStatus(bySchool.hcmut.evaluation.confidence)).toBe('exact');
    expect(getEvaluationDisplayStatus(bySchool.ueh.evaluation.confidence)).toBe('exact');
    expect(getEvaluationDisplayStatus(bySchool.iu.evaluation.confidence)).toBe('exact');
    expect(bySchool.hcmut.evaluation.score?.scale).toBe(100);
    expect(bySchool.ueh.evaluation.score?.scale).toBe(100);
    expect(bySchool.iu.evaluation.score?.scale).toBe(100);

    expect(getEvaluationDisplayStatus(bySchool.uel.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.hcmus.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.ussh.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.uhs.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.uit.evaluation.confidence)).toBe('partial');
  });

  it('does not mutate ApplicantProfile', () => {
    const before = structuredClone(profile);
    const frozen = deepFreeze(structuredClone(profile));
    evaluateApplicantAcrossSchools(frozen, completeContexts());
    expect(frozen).toEqual(before);
  });

  it('missing HCMUT context cannot create fake exact score', () => {
    const summaries = evaluateApplicantAcrossSchools(profile);
    const hcmut = summaries.find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.evaluation.missingInputs.length).toBeGreaterThan(0);
  });

  it('classifies actionable and official missing requirements without mutating context', () => {
    const frozenContext = deepFreeze({
      uel: { subjectContext: { combinationId: 'A01', subjects: a01.subjects } },
    });
    const incompleteProfile: ApplicantProfile = {
      exams: { vact: { total: 980 } },
      thpt: { scores: { math: 8.8, english: 9 } },
    };

    const summaries = evaluateApplicantAcrossSchools(incompleteProfile, frozenContext);
    const bySchool = Object.fromEntries(summaries.map((summary) => [summary.schoolId, summary]));

    expect(bySchool.hcmut.evaluation.missingRequirements).toContainEqual(
      expect.objectContaining({ kind: 'school-context', code: 'hcmut-context' })
    );
    expect(bySchool.uel.evaluation.missingRequirements).toContainEqual(
      expect.objectContaining({ kind: 'profile-input', code: 'uel-thpt-physics' })
    );
    expect(bySchool.uel.evaluation.missingRequirements?.some((requirement) => requirement.kind === 'official-rule')).toBe(true);
    expect(bySchool.uit.evaluation.missingRequirements?.some((requirement) => requirement.kind === 'official-rule')).toBe(true);
    expect(bySchool.uel.evaluation.explanation.some((step) => step.id === 'uel-thpt-scale-100')).toBe(false);
    expect(frozenContext.uel.subjectContext.combinationId).toBe('A01');

    const completed = evaluateApplicantAcrossSchools(
      { ...incompleteProfile, thpt: { scores: { ...incompleteProfile.thpt?.scores, physics: 8.4 } } },
      frozenContext
    ).find((summary) => summary.schoolId === 'uel')!;
    expect(completed.evaluation.missingRequirements?.some((requirement) => requirement.code === 'uel-thpt-physics')).toBe(false);
    expect(completed.evaluation.explanation.some((step) => step.id === 'uel-thpt-scale-100')).toBe(true);
  });

  it('exact schools expose cutoff gaps only when selected program and scale are compatible', () => {
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(profile, completeContexts()).map((summary) => [summary.schoolId, summary]));
    expect(bySchool.hcmut.cutoffComparison?.difference).toBeDefined();
    expect(bySchool.ueh.cutoffComparison?.difference).toBeDefined();
    expect(bySchool.iu.cutoffComparison?.difference).toBeDefined();
  });

  it('partial schools never expose unsafe cutoff gaps even when programs are selected', () => {
    const bySchool = Object.fromEntries(evaluateApplicantAcrossSchools(profile, completeContexts()).map((summary) => [summary.schoolId, summary]));
    for (const schoolId of ['uel', 'uit', 'hcmus', 'ussh', 'uhs']) {
      expect(bySchool[schoolId].cutoffComparison).toBeUndefined();
      expect(bySchool[schoolId].evaluation.score).toBeUndefined();
    }
    expect(bySchool.hcmus.evaluation.explanation).toContainEqual(
      expect.objectContaining({ id: 'hcmus-program-threshold', output: 24 })
    );
    expect(bySchool.uhs.evaluation.missingRequirements).toContainEqual(
      expect.objectContaining({ kind: 'official-rule', code: 'uhs-method2-weights-range' })
    );
  });

  it('stale HCMUT context with incomplete profile cannot create fake exact score', () => {
    const incompleteProfile: ApplicantProfile = {
      exams: { vact: { total: 980 } },
      thpt: { scores: { math: 8.8, english: 9 } },
    };
    const hcmut = evaluateApplicantAcrossSchools(incompleteProfile, completeContexts()).find((summary) => summary.schoolId === 'hcmut')!;

    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.cutoffComparison).toBeUndefined();
  });

  it('cleared factual profile with persisted contexts stays unavailable, not stale exact', () => {
    const hcmut = evaluateApplicantAcrossSchools({}, completeContexts()).find((summary) => summary.schoolId === 'hcmut')!;

    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.cutoffComparison).toBeUndefined();
  });
});
