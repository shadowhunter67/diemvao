import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../core/applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { getEvaluationDisplayStatus } from './evaluationDisplay';
import { evaluateApplicantAcrossSchools } from './evaluateApplicantAcrossSchools';

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

describe('evaluateApplicantAcrossSchools', () => {
  it('same profile → HCMUT exact, UEH partial, UEL partial, UIT partial', () => {
    const frozen = deepFreeze(structuredClone(profile));
    const summaries = evaluateApplicantAcrossSchools(frozen, {
      hcmut: {
        methodContext: {
          combination: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!,
          bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
          priorityRaw30Scale: 0,
        },
      },
      uel: {
        subjectContext: {
          combinationId: 'A01',
          subjects: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!.subjects,
        },
      },
    });

    const bySchool = Object.fromEntries(summaries.map((summary) => [summary.schoolId, summary]));
    expect(getEvaluationDisplayStatus(bySchool.hcmut.evaluation.confidence)).toBe('exact');
    expect(getEvaluationDisplayStatus(bySchool.ueh.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.uel.evaluation.confidence)).toBe('partial');
    expect(getEvaluationDisplayStatus(bySchool.uit.evaluation.confidence)).toBe('partial');
    expect(bySchool.hcmut.evaluation.score?.scale).toBe(100);
    expect(bySchool.ueh.evaluation.explanation[0].scale).toBe(30);
    expect(bySchool.uel.evaluation.explanation.some((step) => step.id === 'uel-thpt-scale-100')).toBe(true);
  });

  it('không mutate ApplicantProfile', () => {
    const before = structuredClone(profile);
    const frozen = deepFreeze(structuredClone(profile));
    evaluateApplicantAcrossSchools(frozen, {
      uel: {
        subjectContext: {
          combinationId: 'A01',
          subjects: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!.subjects,
        },
      },
    });
    expect(frozen).toEqual(before);
  });

  it('thiếu context HCMUT → không fake exact score', () => {
    const summaries = evaluateApplicantAcrossSchools(profile);
    const hcmut = summaries.find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.evaluation.missingInputs.length).toBeGreaterThan(0);
  });

  it('sort ổn định: exact trước, partial sau, unavailable sau khi caller sort bằng helper UI', () => {
    const summaries = evaluateApplicantAcrossSchools(profile, {
      hcmut: {
        methodContext: {
          combination: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!,
          bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
          priorityRaw30Scale: 0,
        },
      },
      uel: {
        subjectContext: {
          combinationId: 'A01',
          subjects: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!.subjects,
        },
      },
    });
    expect(summaries.map((summary) => summary.schoolId)).toEqual(['hcmut', 'ueh', 'uel', 'uit']);
  });

  it('classifies actionable and official missing requirements without mutating context', () => {
    const a01 = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!;
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
  it('HCMUT exact needs selected program before cutoff comparison becomes meaningful', () => {
    const completeContext = {
      hcmut: {
        methodContext: {
          combination: COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!,
          bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
          priorityRaw30Scale: 0,
        },
      },
    };
    const withoutProgram = evaluateApplicantAcrossSchools(profile, completeContext).find((summary) => summary.schoolId === 'hcmut')!;
    expect(getEvaluationDisplayStatus(withoutProgram.evaluation.confidence)).toBe('exact');
    expect(withoutProgram.cutoffComparison).toBeUndefined();
    expect(withoutProgram.evaluation.missingRequirements).toContainEqual(
      expect.objectContaining({ kind: 'school-context', code: 'program' })
    );

    const withProgram = evaluateApplicantAcrossSchools(profile, {
      hcmut: { ...completeContext.hcmut, selectedProgramId: 'khoa-hoc-may-tinh' },
    }).find((summary) => summary.schoolId === 'hcmut')!;
    expect(withProgram.evaluation.missingRequirements?.some((requirement) => requirement.code === 'program') ?? false).toBe(false);
    expect(withProgram.cutoffComparison?.comparable).toBe(true);
    expect(withProgram.cutoffComparison?.applicantScale).toBe(100);
  });

  it('partial schools never expose unsafe cutoff gaps even when programs are selected', () => {
    const a01 = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!;
    const summaries = evaluateApplicantAcrossSchools(profile, {
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
    });
    const bySchool = Object.fromEntries(summaries.map((summary) => [summary.schoolId, summary]));
    expect(bySchool.hcmut.cutoffComparison?.difference).toBeDefined();
    expect(bySchool.ueh.cutoffComparison).toBeUndefined();
    expect(bySchool.uel.cutoffComparison).toBeUndefined();
    expect(bySchool.uit.cutoffComparison).toBeUndefined();
  });

  it('stale HCMUT context with incomplete profile cannot create fake exact score', () => {
    const a01 = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!;
    const incompleteProfile: ApplicantProfile = {
      exams: { vact: { total: 980 } },
      thpt: { scores: { math: 8.8, english: 9 } },
    };
    const hcmut = evaluateApplicantAcrossSchools(incompleteProfile, {
      hcmut: {
        methodContext: {
          combination: a01,
          bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
          priorityRaw30Scale: 0,
        },
        selectedProgramId: 'khoa-hoc-may-tinh',
      },
    }).find((summary) => summary.schoolId === 'hcmut')!;

    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.cutoffComparison).toBeUndefined();
  });

  it('cleared factual profile with persisted contexts stays unavailable, not stale exact', () => {
    const a01 = COMMON_SUBJECT_COMBINATIONS.find((combination) => combination.id === 'A01')!;
    const emptyProfile: ApplicantProfile = {};
    const hcmut = evaluateApplicantAcrossSchools(emptyProfile, {
      hcmut: {
        methodContext: {
          combination: a01,
          bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
          priorityRaw30Scale: 0,
        },
        selectedProgramId: 'khoa-hoc-may-tinh',
      },
    }).find((summary) => summary.schoolId === 'hcmut')!;

    expect(getEvaluationDisplayStatus(hcmut.evaluation.confidence)).toBe('unavailable');
    expect(hcmut.evaluation.score).toBeUndefined();
    expect(hcmut.cutoffComparison).toBeUndefined();
  });
});
