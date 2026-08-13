import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import { buildApplicantProfileFromHcmutForm, type HcmutFormFactualInput } from '../schools/hcmut/applicantProfileMapper';
import { buildUehEvaluationInput } from '../schools/ueh/applicantProfileAdapter';
import { evaluateUehAdmission } from '../schools/ueh/evaluate';

/**
 * Batch 4, workstream N — proof luồng THẬT (khác `applicantProfile.crossSchool.test.ts` ở batch 3,
 * vốn dùng total/components KHÔNG khớp nhau có chủ đích để test tính độc lập của 2 adapter). Ở
 * đây: HCMUT ghi profile qua mapper thật (`buildApplicantProfileFromHcmutForm`) → UEH đọc lại
 * đúng con số đó qua adapter thật (`buildUehEvaluationInput`) — không có bước "giả lập" nào.
 */
function f(value: number, isEmpty = false) {
  return { value, isEmpty };
}

describe('Cross-school real flow: HCMUT ghi profile → UEH đọc lại (batch 4)', () => {
  const hcmutInput: HcmutFormFactualInput = {
    dgnl: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 },
    thpt: { math: f(9), subject2: f(8), subject3: f(7) },
    transcript: {
      grade10: { math: f(9), subject2: f(8), subject3: f(7) },
      grade11: { math: f(9), subject2: f(8), subject3: f(7) },
      grade12: { math: f(9), subject2: f(8), subject3: f(7) },
    },
  };

  it('1. HCMUT ghi đúng components từ 4 điểm thành phần', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    expect(profile.exams?.vact?.components).toEqual({
      vietnamese: 250,
      english: 230,
      math: 260,
      scientificThinking: 240,
    });
  });

  it('2. UEH đọc đúng total mà HCMUT vừa ghi (raw thô, KHÔNG qua chuyển đổi nào thêm)', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    // 250+230+260+240 = 980
    expect(profile.exams?.vact?.total).toBe(980);

    const uehInput = buildUehEvaluationInput(profile, { campus: 'hcmc' });
    expect(uehInput.dgnlScore).toBe(980);
  });

  it('3. HCMUT không đọc bất kỳ giá trị converted-score nào của UEH khi build lại input của chính nó', () => {
    // Profile có sẵn dữ liệu UEH tự ghi (vd nếu UEH từng "Thay đổi" thủ công) — mapper HCMUT không
    // đọc field nào từ đó để tính điểm HCMUT, chỉ dùng input form của chính HCMUT.
    const base: ApplicantProfile = { exams: { vact: { total: 1199 } } };
    const profile = buildApplicantProfileFromHcmutForm(base, hcmutInput, { subject2: null, subject3: null });
    // total bị ghi đè bởi raw tự tính từ input HCMUT — không lẫn với 1199 cũ.
    expect(profile.exams?.vact?.total).toBe(980);
  });

  it('4. UEH không bao giờ dùng weightedScore (1500-scale, HCMUT-specific) làm dgnlScore', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const weightedScore1500 = hcmutInput.dgnl!.vietnamese + hcmutInput.dgnl!.english + hcmutInput.dgnl!.math * 2 + hcmutInput.dgnl!.scientificThinking;
    const uehInput = buildUehEvaluationInput(profile, { campus: 'hcmc' });
    expect(uehInput.dgnlScore).not.toBe(weightedScore1500);
    expect(uehInput.dgnlScore).toBe(980); // raw, không nhân hệ số Toán
  });

  it('5. Field lạ (chưa biết ở batch này) trong profile bị 2 adapter bỏ qua an toàn, không crash', () => {
    const profileWithUnknownField = {
      ...buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null }),
      certificates: { ielts: 7.5 }, // field đã có trong ApplicantProfile type nhưng chưa adapter nào dùng
    } as ApplicantProfile;

    expect(() => buildUehEvaluationInput(profileWithUnknownField, { campus: 'hcmc' })).not.toThrow();
    const uehInput = buildUehEvaluationInput(profileWithUnknownField, { campus: 'hcmc' });
    expect(uehInput.dgnlScore).toBe(980);
  });

  it('6. buildApplicantProfileFromHcmutForm không mutate object base (pure, an toàn gọi lại nhiều lần)', () => {
    const base: ApplicantProfile = Object.freeze({ graduationYear: 2026, exams: { vact: { total: 100 } } });
    expect(() => buildApplicantProfileFromHcmutForm(base, hcmutInput, { subject2: null, subject3: null })).not.toThrow();
    expect(base).toEqual({ graduationYear: 2026, exams: { vact: { total: 100 } } });
  });

  it('7. buildUehEvaluationInput là pure function — gọi 2 lần cùng input ra cùng kết quả, không mutate profile', () => {
    const profile = Object.freeze(buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null }));
    const first = buildUehEvaluationInput(profile, { campus: 'hcmc' });
    const second = buildUehEvaluationInput(profile, { campus: 'hcmc' });
    expect(first).toEqual(second);
  });

  it('End-to-end: profile từ HCMUT → UEH evaluate ra confidence partial, có bước quy đổi hợp lệ', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const evaluation = evaluateUehAdmission(buildUehEvaluationInput(profile, { campus: 'hcmc' }));
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined();
    const step = evaluation.explanation.find((s) => s.id === 'dgnl-to-thpt');
    expect(step?.output).toBeGreaterThan(0);
  });
});
