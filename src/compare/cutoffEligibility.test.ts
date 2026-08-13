import { describe, expect, it } from 'vitest';
import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import { canCompareEvaluationToCutoff } from './cutoffEligibility';

const base: AdmissionEvaluation = {
  schoolId: 'x',
  year: 2026,
  methodId: 'm',
  confidence: 'partial',
  missingInputs: [],
  missingRules: [],
  explanation: [],
  evidence: [],
};

describe('canCompareEvaluationToCutoff', () => {
  it('allows exact final scores only', () => {
    expect(canCompareEvaluationToCutoff({ ...base, confidence: 'exact-verified', score: { value: 84.27, scale: 100 } })).toBe(true);
    expect(canCompareEvaluationToCutoff({ ...base, confidence: 'exact-cross-checked', score: { value: 84.27, scale: 100 } })).toBe(true);
  });

  it('rejects partial/unavailable even if a future bug accidentally attaches score', () => {
    expect(canCompareEvaluationToCutoff({ ...base, confidence: 'partial', score: { value: 84.27, scale: 100 } })).toBe(false);
    expect(canCompareEvaluationToCutoff({ ...base, confidence: 'unavailable', score: { value: 84.27, scale: 100 } })).toBe(false);
  });
});
