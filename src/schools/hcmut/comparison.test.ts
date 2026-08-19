import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from '../../core/subjects';
import { hcmutComparisonAdapter, type HcmutComparisonContext } from './comparison';
import type { HcmutMethodContext } from './applicantProfileAdapter';

/**
 * Trước batch loại bỏ classify-bằng-parse-text, `classifyHcmutMissingInput` đoán loại requirement
 * bằng `error.message.toLowerCase().includes('dgnl'|'thpt'|'học bạ')` — đổi wording message (kể cả
 * chỉ thêm dấu/khoảng trắng) có thể làm gãy classification, và bất kỳ exception KHÔNG liên quan
 * nào cũng bị nhét vào 1 trong các bucket đó. Test dưới đây khóa: classification giờ đến từ
 * `MissingRequirement.code` được gán TẠI ĐÚNG CHỖ phát hiện thiếu dữ liệu (`applicantProfileAdapter.ts`),
 * không phải suy ngược từ text.
 */
const A00 = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === 'A00')!;

const fullMethodContext: HcmutMethodContext = {
  combination: A00,
  bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
  priorityRaw30Scale: 1.5,
};

const validProfile: ApplicantProfile = {
  graduationYear: 2026,
  exams: { vact: { components: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 } } },
  thpt: { scores: { math: 9, physics: 8, chemistry: 7 } },
  transcript: {
    grade10: { math: 9, physics: 8, chemistry: 7 },
    grade11: { math: 9, physics: 8, chemistry: 7 },
    grade12: { math: 9, physics: 8, chemistry: 7 },
  },
};

function evaluateWith(profile: ApplicantProfile, methodContext: HcmutMethodContext | undefined) {
  const context: HcmutComparisonContext = { methodContext };
  return hcmutComparisonAdapter.evaluate(profile, context);
}

describe('hcmutComparisonAdapter — structured missing-requirement classification (no message parsing)', () => {
  it('1. missing ĐGNL (exams.vact.components absent) => code "hcmut-dgnl"', () => {
    const { evaluation } = evaluateWith({ ...validProfile, exams: undefined }, fullMethodContext);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'hcmut-dgnl' }));
  });

  it('1b. missing one ĐGNL component (scientificThinking) => code "hcmut-dgnl"', () => {
    const incomplete: ApplicantProfile = {
      ...validProfile,
      exams: { vact: { components: { vietnamese: 200, english: 220, math: 240 } } },
    };
    const { evaluation } = evaluateWith(incomplete, fullMethodContext);
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'hcmut-dgnl' }));
  });

  it('2. missing THPT subject score => code "hcmut-thpt"', () => {
    const incomplete: ApplicantProfile = { ...validProfile, thpt: { scores: { math: 9 } } };
    const { evaluation } = evaluateWith(incomplete, fullMethodContext);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'hcmut-thpt' }));
  });

  it('3. missing transcript score (grade11) => code "hcmut-transcript"', () => {
    const incomplete: ApplicantProfile = {
      ...validProfile,
      transcript: { ...validProfile.transcript, grade11: { math: 9 } },
    };
    const { evaluation } = evaluateWith(incomplete, fullMethodContext);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'hcmut-transcript' }));
  });

  it('4. changing the display message wording does not change the classification (code is assigned at the source, not parsed downstream)', () => {
    // Không có cách nào từ bên ngoài "đổi message" mà không đổi field bị thiếu — đây chính là điểm
    // của refactor: code luôn khớp field thật (không phải đoán theo text), nên test 2 field khác
    // nhau (đều thuộc cùng nhóm) vẫn ra cùng code, dù message khác nhau.
    const missingSubject2: ApplicantProfile = { ...validProfile, thpt: { scores: { math: 9, physics: 8 } } };
    const missingSubject3: ApplicantProfile = { ...validProfile, thpt: { scores: { math: 9 } } };
    const r1 = evaluateWith(missingSubject2, fullMethodContext);
    const r2 = evaluateWith(missingSubject3, fullMethodContext);
    const req1 = r1.evaluation.missingRequirements?.find((r) => r.code === 'hcmut-thpt');
    const req2 = r2.evaluation.missingRequirements?.find((r) => r.code === 'hcmut-thpt');
    expect(req1?.code).toBe('hcmut-thpt');
    expect(req2?.code).toBe('hcmut-thpt');
    expect(req1?.label).not.toBe(req2?.label);
  });

  it('5. a genuinely unexpected technical error is handled safely and NOT disguised as a specific missing-data code', () => {
    // `combination: undefined` gây TypeError thật khi destructure `context.combination.subjects`
    // — KHÔNG phải `HcmutInputRequirementError`, nên `buildHcmutAdmissionInputResult` re-throw
    // nguyên trạng thay vì trả Result — adapter phải bắt an toàn, gắn `kind: 'unsupported'`.
    const brokenMethodContext = { ...fullMethodContext, combination: undefined } as unknown as HcmutMethodContext;
    expect(() => evaluateWith(validProfile, brokenMethodContext)).not.toThrow();
    const { evaluation } = evaluateWith(validProfile, brokenMethodContext);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'unsupported', code: 'hcmut-unexpected-error' }));
    // Không bị giả thành 1 trong các code missing-data cụ thể.
    expect(evaluation.missingRequirements?.some((r) => ['hcmut-dgnl', 'hcmut-thpt', 'hcmut-transcript'].includes(r.code))).toBe(false);
  });

  it('6. a complete valid profile still produces the same evaluation shape as before (exact-verified with score)', () => {
    const { evaluation } = evaluateWith(validProfile, fullMethodContext);
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score).toBeDefined();
    // Không còn missing-DATA requirement nào — "program" ở đây là do chưa chọn ngành để so cutoff
    // (hành vi có sẵn từ trước, không thuộc scope refactor này), không phải profile-input.
    expect(evaluation.missingRequirements).toEqual([{ kind: 'school-context', code: 'program', label: expect.any(String) }]);
  });

  it('invalid combination shape (contract violation, not user data) => code "hcmut-invalid-combination", kind "school-context"', () => {
    const invalidCombination: HcmutMethodContext = {
      ...fullMethodContext,
      combination: { id: 'invalid', subjects: ['physics', 'chemistry', 'math'] },
    };
    const { evaluation } = evaluateWith(validProfile, invalidCombination);
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'hcmut-invalid-combination' }));
  });

  it('no methodContext at all still reports the pre-existing "hcmut-context" requirement (unrelated to this refactor)', () => {
    const { evaluation } = evaluateWith(validProfile, undefined);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'school-context', code: 'hcmut-context' }));
  });

  it('7. exams.vact.total present but components absent => still evaluates exact-verified via weighted-raw path', () => {
    const totalOnlyProfile: ApplicantProfile = { ...validProfile, exams: { vact: { total: 950, totalSource: 'user-total-input' } } };
    const { evaluation } = evaluateWith(totalOnlyProfile, fullMethodContext);
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score).toBeDefined();
    expect(evaluation.missingRequirements?.some((r) => r.code === 'hcmut-dgnl')).toBe(false);
  });

  it('7b. neither components nor total => still "hcmut-dgnl" missing (no regression)', () => {
    const noVactValueProfile: ApplicantProfile = { ...validProfile, exams: { vact: {} } };
    const { evaluation } = evaluateWith(noVactValueProfile, fullMethodContext);
    expect(evaluation.confidence).toBe('unavailable');
    expect(evaluation.missingRequirements).toContainEqual(expect.objectContaining({ kind: 'profile-input', code: 'hcmut-dgnl' }));
  });
});
