import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { buildApplicantProfileFromHcmutForm, type HcmutFormFactualInput } from './applicantProfileMapper';
import type { HcmutSubjectContext } from './types/subjectContext';

/** Helper — dựng field factual dạng `{ value, isEmpty }` (shape của `FieldValidationResult` bỏ
 * `error`) như `AdmissionFormErrors.thpt`/`.transcript` truyền vào thật trong `HcmutCalculatorPage`. */
function f(value: number, isEmpty = false) {
  return { value, isEmpty };
}

const detailInput: HcmutFormFactualInput = {
  dgnl: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
  thpt: { math: f(9), subject2: f(8), subject3: f(7) },
  transcript: {
    grade10: { math: f(9), subject2: f(8), subject3: f(7) },
    grade11: { math: f(9), subject2: f(8), subject3: f(7) },
    grade12: { math: f(9), subject2: f(8), subject3: f(7) },
  },
};

describe('buildApplicantProfileFromHcmutForm', () => {
  it('ghi exams.vact.components từ 4 điểm thành phần khi có dgnl (chế độ Nhập chi tiết)', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, detailInput, { subject2: null, subject3: null });
    expect(profile.exams?.vact?.components).toEqual({
      vietnamese: 200,
      english: 220,
      math: 240,
      scientificThinking: 210,
    });
  });

  it('ghi exams.vact.total = tổng 4 phần KHÔNG nhân hệ số Toán×2 (raw, đúng thang 1200 của ĐGNL chính thức — không phải weightedScore 1500 riêng HCMUT)', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, detailInput, { subject2: null, subject3: null });
    // 200 + 220 + 240 + 210 = 870 (KHÔNG nhân đôi Toán — khác weightedScore = 200+220+240*2+210 = 1110)
    expect(profile.exams?.vact?.total).toBe(870);
  });

  it('KHÔNG đụng tới profile khi không có input.dgnl (chế độ Nhập tổng điểm — không có breakdown thật)', () => {
    const { dgnl: _dgnl, ...withoutDgnl } = detailInput;
    const profile = buildApplicantProfileFromHcmutForm({}, withoutDgnl, { subject2: null, subject3: null });
    expect(profile.exams).toBeUndefined();
  });

  it('ghi đè total đã có sẵn (vd UEH ghi trước) bằng raw tự tính từ components mới — cùng một fact (điểm ĐGNL thô), last-write-wins hợp lệ', () => {
    const base: ApplicantProfile = { exams: { vact: { total: 950 } } };
    const profile = buildApplicantProfileFromHcmutForm(base, detailInput, { subject2: null, subject3: null });
    expect(profile.exams?.vact?.total).toBe(870);
    expect(profile.exams?.vact?.components?.math).toBe(240);
  });

  it('không ghi thpt/transcript khi chưa xác định subject2/subject3 (tránh gán nhầm môn)', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, detailInput, { subject2: null, subject3: null });
    expect(profile.thpt).toBeUndefined();
    expect(profile.transcript).toBeUndefined();
  });

  it('ghi đúng SubjectId khi đã chọn tổ hợp', () => {
    const subjectContext: HcmutSubjectContext = { subject2: 'physics', subject3: 'chemistry' };
    const profile = buildApplicantProfileFromHcmutForm({}, detailInput, subjectContext);
    expect(profile.thpt?.scores).toEqual({ math: 9, physics: 8, chemistry: 7 });
    expect(profile.transcript?.grade10).toEqual({ math: 9, physics: 8, chemistry: 7 });
    expect(profile.transcript?.grade11).toEqual({ math: 9, physics: 8, chemistry: 7 });
    expect(profile.transcript?.grade12).toEqual({ math: 9, physics: 8, chemistry: 7 });
  });

  it('chỉ ghi field đã biết identity nếu 1 trong 2 môn chưa chọn', () => {
    const profile = buildApplicantProfileFromHcmutForm({}, detailInput, { subject2: 'physics', subject3: null });
    expect(profile.thpt?.scores).toEqual({ math: 9, physics: 8 });
  });

  it('không mutate object base truyền vào (pure)', () => {
    const base: ApplicantProfile = { graduationYear: 2026 };
    const frozenBase = Object.freeze({ ...base });
    expect(() => buildApplicantProfileFromHcmutForm(frozenBase, detailInput, { subject2: null, subject3: null })).not.toThrow();
    expect(frozenBase).toEqual({ graduationYear: 2026 });
  });

  describe('thptNonFactualSubjectIds (batch 6, workstream K — chặn contamination từ quy đổi chứng chỉ)', () => {
    const subjectContext: HcmutSubjectContext = { subject2: 'english', subject3: 'physics' };

    it('KHÔNG loại field nào nếu không truyền thptNonFactualSubjectIds — hành vi cũ giữ nguyên', () => {
      const profile = buildApplicantProfileFromHcmutForm({}, detailInput, subjectContext);
      expect(profile.thpt?.scores).toEqual({ math: 9, english: 8, physics: 7 });
    });

    it('loại đúng SubjectId trong thptNonFactualSubjectIds khỏi profile.thpt.scores (vd điểm Tiếng Anh điền từ IELTS, không phải điểm thi thật)', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        { ...detailInput, thptNonFactualSubjectIds: ['english'] },
        subjectContext
      );
      expect(profile.thpt?.scores).toEqual({ math: 9, physics: 7 });
      expect(profile.thpt?.scores).not.toHaveProperty('english');
    });

    it('KHÔNG ảnh hưởng transcript (quy đổi chứng chỉ chỉ áp cho điểm thi THPT, không áp học bạ)', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        { ...detailInput, thptNonFactualSubjectIds: ['english'] },
        subjectContext
      );
      expect(profile.transcript?.grade10).toEqual({ math: 9, english: 8, physics: 7 });
    });

    it('giá trị điểm thi thật trước đó của môn bị loại (nếu có trong base) không bị suy đoán lại — chỉ đơn giản không ghi giá trị mới', () => {
      const base: ApplicantProfile = { thpt: { scores: { english: 7.5 } } };
      const profile = buildApplicantProfileFromHcmutForm(
        base,
        { ...detailInput, thptNonFactualSubjectIds: ['english'] },
        subjectContext
      );
      // next.thpt bị ghi đè hoàn toàn theo scores mới tính (không giữ base.thpt cũ) — english bị
      // loại nên không xuất hiện, đúng ý "không ghi giá trị cert-derived", KHÔNG phải "giữ giá trị
      // cũ 7.5" (mapper không có đủ ngữ cảnh để biết 7.5 còn đúng hay không ở lượt edit này).
      expect(profile.thpt?.scores).not.toHaveProperty('english');
    });
  });

  describe('Batch 7 — missing ≠ 0 và THPT/transcript ghi độc lập (fix bug ghi đè transcript thành 0)', () => {
    const subjectContext: HcmutSubjectContext = { subject2: 'physics', subject3: 'chemistry' };

    it('field THPT rỗng (isEmpty=true) → KHÔNG xuất hiện trong profile.thpt.scores (không phải 0)', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        { thpt: { math: f(9), subject2: f(0, true), subject3: f(0, true) }, transcript: detailInput.transcript },
        subjectContext
      );
      expect(profile.thpt?.scores).toEqual({ math: 9 });
      expect(profile.thpt?.scores).not.toHaveProperty('physics');
      expect(profile.thpt?.scores).not.toHaveProperty('chemistry');
    });

    it('field THPT thật sự là 0 (isEmpty=false) → ghi đúng giá trị 0, không bị loại', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        { thpt: { math: f(0, false), subject2: f(8), subject3: f(7) }, transcript: detailInput.transcript },
        subjectContext
      );
      expect(profile.thpt?.scores).toEqual({ math: 0, physics: 8, chemistry: 7 });
    });

    it('chỉ truyền input.thpt (không truyền transcript) → chỉ ghi profile.thpt, profile.transcript giữ nguyên base', () => {
      const base: ApplicantProfile = { transcript: { grade10: { math: 5 } } };
      const profile = buildApplicantProfileFromHcmutForm(base, { thpt: detailInput.thpt }, subjectContext);
      expect(profile.thpt?.scores).toEqual({ math: 9, physics: 8, chemistry: 7 });
      expect(profile.transcript).toEqual({ grade10: { math: 5 } });
    });

    it('chỉ truyền input.transcript (không truyền thpt) → chỉ ghi profile.transcript, profile.thpt giữ nguyên base', () => {
      const base: ApplicantProfile = { thpt: { scores: { math: 6 } } };
      const profile = buildApplicantProfileFromHcmutForm(base, { transcript: detailInput.transcript }, subjectContext);
      expect(profile.thpt).toEqual({ scores: { math: 6 } });
      expect(profile.transcript?.grade10).toEqual({ math: 9, physics: 8, chemistry: 7 });
    });

    it('field học bạ rỗng ở 1 năm không ảnh hưởng năm khác, mỗi năm loại field rỗng độc lập', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        {
          transcript: {
            grade10: { math: f(9), subject2: f(0, true), subject3: f(0, true) },
            grade11: { math: f(8), subject2: f(7), subject3: f(0, true) },
            grade12: { math: f(9), subject2: f(8), subject3: f(7) },
          },
        },
        subjectContext
      );
      expect(profile.transcript?.grade10).toEqual({ math: 9 });
      expect(profile.transcript?.grade11).toEqual({ math: 8, physics: 7 });
      expect(profile.transcript?.grade12).toEqual({ math: 9, physics: 8, chemistry: 7 });
    });

    it('field học bạ thật sự là 0 (isEmpty=false) → ghi đúng giá trị 0, không bị loại (khác field rỗng)', () => {
      const profile = buildApplicantProfileFromHcmutForm(
        {},
        {
          transcript: {
            grade10: { math: f(0, false), subject2: f(8), subject3: f(7) },
            grade11: detailInput.transcript!.grade11,
            grade12: detailInput.transcript!.grade12,
          },
        },
        subjectContext
      );
      expect(profile.transcript?.grade10).toEqual({ math: 0, physics: 8, chemistry: 7 });
      expect(profile.transcript?.grade10).toHaveProperty('math', 0);
    });
  });
});
