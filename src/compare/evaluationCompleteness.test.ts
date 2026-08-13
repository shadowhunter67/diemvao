import { describe, expect, it } from 'vitest';
import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import { summarizeEvaluationCompleteness } from './evaluationCompleteness';

const baseEvaluation: AdmissionEvaluation = {
  schoolId: 'x',
  year: 2026,
  methodId: 'm',
  confidence: 'partial',
  missingInputs: [],
  missingRules: [],
  explanation: [],
  evidence: [],
};

describe('summarizeEvaluationCompleteness', () => {
  it('counts user-actionable inputs/context separately from official blockers', () => {
    const summary = summarizeEvaluationCompleteness({
      ...baseEvaluation,
      missingRequirements: [
        { kind: 'profile-input', code: 'score', label: 'Nhập điểm' },
        { kind: 'school-context', code: 'program', label: 'Chọn ngành' },
        { kind: 'official-rule', code: 'appendix', label: 'Thiếu phụ lục' },
      ],
    });

    expect(summary).toEqual({
      userCanImprove: true,
      missingUserInputs: 1,
      missingContext: 1,
      blockedByOfficialRules: true,
      unsupported: false,
    });
  });
});
