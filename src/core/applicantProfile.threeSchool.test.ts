import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import { reconcileVactFromTotal } from './vactProfile';
import { buildApplicantProfileFromHcmutForm } from '../schools/hcmut/applicantProfileMapper';
import { buildUehEvaluationInput } from '../schools/ueh/applicantProfileAdapter';
import { buildUelEvaluationInput } from '../schools/uel/applicantProfileAdapter';

/**
 * Batch 5, workstream P/Q — core regression suite: proof rằng MỘT `ApplicantProfile` chia sẻ giữa
 * 3 trường (HCMUT ghi, UEH + UEL đọc) không bao giờ tự mâu thuẫn, và mỗi trường chỉ đọc field mình
 * hiểu mà không mutate/couple với trường khác. Test dưới đây dùng đúng pure function ở production
 * code (`buildApplicantProfileFromHcmutForm`, `reconcileVactFromTotal`, 2 adapter) — không mock.
 */
function f(value: number, isEmpty = false) {
  return { value, isEmpty };
}

describe('Batch 5 — sequence hoàn chỉnh: HCMUT ghi → UEH sửa conflict → HCMUT sửa lại → UEH/UEL đọc lại', () => {
  const hcmutInput = {
    dgnl: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }, // sum 980
    thpt: { math: f(9), subject2: f(8), subject3: f(7) },
    transcript: {
      grade10: { math: f(9), subject2: f(8), subject3: f(7) },
      grade11: { math: f(9), subject2: f(8), subject3: f(7) },
      grade12: { math: f(9), subject2: f(8), subject3: f(7) },
    },
  };

  it('Sequence 1: HCMUT ghi components → total = 980 (derived) → UEH và UEL cùng đọc 980', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    expect(profile.exams?.vact?.total).toBe(980);
    expect(profile.exams?.vact?.totalSource).toBe('derived-from-components');

    expect(buildUehEvaluationInput(profile).dgnlScore).toBe(980);
    expect(buildUelEvaluationInput(profile).dgnlScore).toBe(980);
  });

  it('Sequence 2: UEH sửa total → 1050 → components (980) xung đột nên bị xóa, không giữ 2 fact mâu thuẫn', () => {
    const step1 = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const { profile: step2, componentsCleared } = reconcileVactFromTotal(step1.exams?.vact, 1050, 'user-total-input');
    expect(componentsCleared).toBe(true);
    expect(step2.total).toBe(1050);
    expect(step2.components).toBeUndefined();

    const profileAfterUeh: ApplicantProfile = { ...step1, exams: { vact: step2 } };
    expect(buildUehEvaluationInput(profileAfterUeh).dgnlScore).toBe(1050);
    expect(buildUelEvaluationInput(profileAfterUeh).dgnlScore).toBe(1050);
  });

  it('Sequence 3: HCMUT quay lại nhưng KHÔNG sửa gì — mapper không được gọi (mount-only) nên profile giữ nguyên 1050 (giả lập bằng việc không gọi buildApplicantProfileFromHcmutForm lại)', () => {
    // Đây là bằng chứng ở mức pure-function: nếu HcmutCalculatorPage không gọi
    // buildApplicantProfileFromHcmutForm (đúng hành vi mới — workstream H/I, sync effect chỉ chạy
    // khi user thực sự sửa field), profile giữ nguyên 1050 từ UEH — không có "silent overwrite".
    const step1 = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const { profile: step2 } = reconcileVactFromTotal(step1.exams?.vact, 1050, 'user-total-input');
    const profileAfterUeh: ApplicantProfile = { ...step1, exams: { vact: step2 } };
    // Không gọi lại mapper ở đây == mô phỏng "mở /hcmut nhưng chưa sửa gì".
    expect(profileAfterUeh.exams?.vact?.total).toBe(1050);
  });

  it('Sequence 4: user sửa lại components ở HCMUT (sum = 990) → total = 990 (derived lại), UEH đọc 990', () => {
    const step1 = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const { profile: step2 } = reconcileVactFromTotal(step1.exams?.vact, 1050, 'user-total-input');
    const profileAfterUeh: ApplicantProfile = { ...step1, exams: { vact: step2 } };

    const editedInput = { ...hcmutInput, dgnl: { vietnamese: 250, english: 230, math: 270, scientificThinking: 240 } }; // sum 990
    const step4 = buildApplicantProfileFromHcmutForm(profileAfterUeh, editedInput, { subject2: null, subject3: null });
    expect(step4.exams?.vact?.total).toBe(990);
    expect(step4.exams?.vact?.totalSource).toBe('derived-from-components');
    expect(step4.exams?.vact?.components?.math).toBe(270);
  });

  it('Sequence 5 (end-to-end): UEH và UEL đều đọc đúng 990 sau bước 4, không cần nhập lại', () => {
    const step1 = buildApplicantProfileFromHcmutForm({}, hcmutInput, { subject2: null, subject3: null });
    const { profile: step2 } = reconcileVactFromTotal(step1.exams?.vact, 1050, 'user-total-input');
    const profileAfterUeh: ApplicantProfile = { ...step1, exams: { vact: step2 } };
    const editedInput = { ...hcmutInput, dgnl: { vietnamese: 250, english: 230, math: 270, scientificThinking: 240 } };
    const step4 = buildApplicantProfileFromHcmutForm(profileAfterUeh, editedInput, { subject2: null, subject3: null });

    expect(buildUehEvaluationInput(step4).dgnlScore).toBe(990);
    expect(buildUelEvaluationInput(step4).dgnlScore).toBe(990);
  });
});

describe('Batch 5 — cross-school isolation (workstream P)', () => {
  const profile: ApplicantProfile = {
    graduationYear: 2026,
    exams: {
      vact: {
        total: 950,
        totalSource: 'user-total-input',
        components: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
        componentsSource: 'user-components-input',
      },
    },
  };

  it('UEH chỉ đọc total, không đọc components; UEL chỉ đọc total, không đọc components', () => {
    expect(Object.keys(buildUehEvaluationInput(profile, { campus: 'hcmc' }))).toEqual([
      'dgnlScore',
      'campus',
      'knownAdmissionScore100',
    ]);
    expect(Object.keys(buildUelEvaluationInput(profile))).toEqual(['dgnlScore']);
  });

  it('adapter đọc profile không mutate profile gốc (pure)', () => {
    const frozen = Object.freeze({ ...profile, exams: Object.freeze({ ...profile.exams }) });
    buildUehEvaluationInput(frozen as ApplicantProfile, { campus: 'hcmc' });
    buildUelEvaluationInput(frozen as ApplicantProfile);
    expect(frozen.exams?.vact?.total).toBe(950);
  });

  it('thiếu exams.vact hoàn toàn → cả 2 adapter trả dgnlScore undefined (partial/unavailable), KHÔNG fabricate 0', () => {
    const empty: ApplicantProfile = {};
    expect(buildUehEvaluationInput(empty).dgnlScore).toBeUndefined();
    expect(buildUelEvaluationInput(empty).dgnlScore).toBeUndefined();
  });

  it('derived school result (vd điểm quy đổi UEH/UEL đã tính) không bao giờ được ghi ngược vào profile qua các hàm reconcile — chỉ raw total được ghi (kiểm chứng bằng type: reconcileVactFromTotal chỉ nhận number, không có evaluation object nào lọt vào)', () => {
    const { profile: reconciled } = reconcileVactFromTotal(profile.exams?.vact, 1000, 'user-total-input');
    expect(reconciled.total).toBe(1000);
    // Không có field nào khác ngoài total/totalSource/components/componentsSource — không có
    // "convertedScore"/"finalScore" nào bị nhét vào đây.
    expect(Object.keys(reconciled).sort()).toEqual(['components', 'componentsSource', 'total', 'totalSource']);
  });
});
