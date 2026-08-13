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
});
