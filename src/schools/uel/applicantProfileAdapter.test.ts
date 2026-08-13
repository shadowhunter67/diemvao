import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { buildUelEvaluationInput } from './applicantProfileAdapter';

describe('buildUelEvaluationInput', () => {
  it('đọc profile.exams.vact.total giống hệt cách UEH đọc (cùng field, cùng thang)', () => {
    const profile: ApplicantProfile = { exams: { vact: { total: 980 } } };
    expect(buildUelEvaluationInput(profile)).toEqual({ dgnlScore: 980 });
  });

  it('không đọc exams.vact.components — chỉ cần total', () => {
    const profile: ApplicantProfile = {
      exams: { vact: { total: 980, components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 } } },
    };
    const input = buildUelEvaluationInput(profile);
    expect(Object.keys(input)).toEqual(['dgnlScore']);
  });

  it('profile thiếu exams.vact → dgnlScore undefined, không throw', () => {
    expect(() => buildUelEvaluationInput({})).not.toThrow();
    expect(buildUelEvaluationInput({}).dgnlScore).toBeUndefined();
  });

  it('đọc tổng THPT theo đúng tổ hợp user chọn, không lưu tổ hợp vào profile', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8.8, physics: 8.4, english: 9 } } };
    expect(buildUelEvaluationInput(profile, { combinationId: 'A01', subjects: ['math', 'physics', 'english'] })).toEqual({
      dgnlScore: undefined,
      thptSubjectScores: { math: 8.8, physics: 8.4, english: 9 },
      thptRawTotal30: 26.2,
    });
  });

  it('thiếu 1 môn trong tổ hợp → không tự coi là 0 và không tạo tổng THPT', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 8.8, english: 9 } } };
    const input = buildUelEvaluationInput(profile, { combinationId: 'A01', subjects: ['math', 'physics', 'english'] });
    expect(input.thptSubjectScores).toEqual({ math: 8.8, english: 9 });
    expect(input.thptRawTotal30).toBeUndefined();
  });

  it('điểm THPT thật bằng 0 vẫn được giữ khác với missing', () => {
    const profile: ApplicantProfile = { thpt: { scores: { math: 0, physics: 8, english: 9 } } };
    const input = buildUelEvaluationInput(profile, { combinationId: 'A01', subjects: ['math', 'physics', 'english'] });
    expect(input.thptSubjectScores?.math).toBe(0);
    expect(input.thptRawTotal30).toBe(17);
  });
});
