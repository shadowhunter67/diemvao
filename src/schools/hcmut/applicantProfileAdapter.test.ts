import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from '../../core/subjects';
import { activeAdmissionConfig } from './config/admission-2026';
import { calculateAdmissionScore } from './calculator/calculator';
import { buildHcmutAdmissionInput, buildHcmutAdmissionInputResult } from './applicantProfileAdapter';
import type { AdmissionInput } from './types/admission';

const config = activeAdmissionConfig;
const A00 = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === 'A00')!; // [math, physics, chemistry]

const profile: ApplicantProfile = {
  graduationYear: 2026,
  exams: { vact: { components: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 } } },
  thpt: { scores: { math: 9, physics: 8, chemistry: 7 } },
  transcript: {
    grade10: { math: 9, physics: 8, chemistry: 7 },
    grade11: { math: 9, physics: 8, chemistry: 7 },
    grade12: { math: 9, physics: 8, chemistry: 7 },
  },
};

const equivalentManualInput: AdmissionInput = {
  dgnl: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
  thpt: { math: 9, subject2: 8, subject3: 7 },
  transcript: {
    grade10: { math: 9, subject2: 8, subject3: 7 },
    grade11: { math: 9, subject2: 8, subject3: 7 },
    grade12: { math: 9, subject2: 8, subject3: 7 },
  },
  bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
  priorityRaw30Scale: 1.5,
};

describe('buildHcmutAdmissionInput — consumer thật của ApplicantProfile (workstream C)', () => {
  it('map đúng ApplicantProfile + HcmutMethodContext sang AdmissionInput tương đương', () => {
    const built = buildHcmutAdmissionInput(profile, {
      combination: A00,
      bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
      priorityRaw30Scale: 1.5,
    });
    expect(built).toEqual(equivalentManualInput);
  });

  it('kết quả tính điểm từ ApplicantProfile khớp CHÍNH XÁC với gọi calculateAdmissionScore trực tiếp (không đổi calculator)', () => {
    const built = buildHcmutAdmissionInput(profile, {
      combination: A00,
      bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
      priorityRaw30Scale: 1.5,
    });
    const viaProfile = calculateAdmissionScore(built, config);
    const viaManualInput = calculateAdmissionScore(equivalentManualInput, config);
    expect(viaProfile).toEqual(viaManualInput);
  });

  it('ném lỗi rõ ràng khi thiếu điểm môn trong tổ hợp thay vì âm thầm điền 0', () => {
    const incompleteProfile: ApplicantProfile = { ...profile, thpt: { scores: { math: 9 } } };
    expect(() =>
      buildHcmutAdmissionInput(incompleteProfile, {
        combination: A00,
        bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 0,
      })
    ).toThrow(/physics/);
  });

  it('ném lỗi nếu combination không bắt đầu bằng "math"', () => {
    const invalidCombination = { id: 'invalid', subjects: ['physics', 'chemistry', 'math'] as const };
    expect(() =>
      buildHcmutAdmissionInput(profile, {
        combination: invalidCombination,
        bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 0,
      })
    ).toThrow(/Toán/);
  });
});

/**
 * `buildHcmutAdmissionInputResult` — Result-based sibling của `buildHcmutAdmissionInput`, dùng bởi
 * `schools/hcmut/comparison.ts` để tránh dùng exception cho case "user chưa nhập đủ dữ liệu" (đã
 * biết, không phải lỗi bất ngờ). Test trực tiếp cả 2 nhánh success/failure của Result.
 */
describe('buildHcmutAdmissionInputResult — Result-based (không throw cho missing profile input)', () => {
  it('success: trả { ok: true, input } khớp buildHcmutAdmissionInput', () => {
    const context = { combination: A00, bonus: { reward: 2, considerationReward: 1, encouragement: 0 }, priorityRaw30Scale: 1.5 };
    const result = buildHcmutAdmissionInputResult(profile, context);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input).toEqual(equivalentManualInput);
  });

  it('failure: thiếu ĐGNL => { ok: false, requirement: { code: "hcmut-dgnl" } }, KHÔNG throw', () => {
    const noDgnl: ApplicantProfile = { ...profile, exams: undefined };
    const context = { combination: A00, bonus: { reward: 0, considerationReward: 0, encouragement: 0 }, priorityRaw30Scale: 0 };
    expect(() => buildHcmutAdmissionInputResult(noDgnl, context)).not.toThrow();
    const result = buildHcmutAdmissionInputResult(noDgnl, context);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.requirement).toMatchObject({ kind: 'profile-input', code: 'hcmut-dgnl' });
  });

  it('failure: thiếu THPT => { ok: false, requirement: { code: "hcmut-thpt" } }', () => {
    const noThpt: ApplicantProfile = { ...profile, thpt: { scores: { math: 9 } } };
    const context = { combination: A00, bonus: { reward: 0, considerationReward: 0, encouragement: 0 }, priorityRaw30Scale: 0 };
    const result = buildHcmutAdmissionInputResult(noThpt, context);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.requirement).toMatchObject({ kind: 'profile-input', code: 'hcmut-thpt' });
  });

  it('failure: thiếu transcript => { ok: false, requirement: { code: "hcmut-transcript" } }', () => {
    const noTranscript: ApplicantProfile = { ...profile, transcript: { ...profile.transcript, grade12: { math: 9 } } };
    const context = { combination: A00, bonus: { reward: 0, considerationReward: 0, encouragement: 0 }, priorityRaw30Scale: 0 };
    const result = buildHcmutAdmissionInputResult(noTranscript, context);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.requirement).toMatchObject({ kind: 'profile-input', code: 'hcmut-transcript' });
  });

  it('failure: combination sai dạng => { ok: false, requirement: { code: "hcmut-invalid-combination" } }', () => {
    const invalidCombination = { id: 'invalid', subjects: ['physics', 'chemistry', 'math'] as const };
    const context = { combination: invalidCombination, bonus: { reward: 0, considerationReward: 0, encouragement: 0 }, priorityRaw30Scale: 0 };
    const result = buildHcmutAdmissionInputResult(profile, context);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.requirement).toMatchObject({ kind: 'school-context', code: 'hcmut-invalid-combination' });
  });
});
