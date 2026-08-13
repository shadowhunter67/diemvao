import { describe, expect, it } from 'vitest';
import { evaluateHcmutAdmission } from './evaluate';
import { calculateAdmissionScore } from './calculator/calculator';
import { activeAdmissionConfig } from './config/admission-2026';
import type { AdmissionInput } from './types/admission';

const config = activeAdmissionConfig;

const input: AdmissionInput = {
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

describe('evaluateHcmutAdmission', () => {
  it('confidence exact-verified, score khớp đúng calculateAdmissionScore (không tính lại công thức lần 2)', () => {
    const evaluation = evaluateHcmutAdmission(input, config);
    const directResult = calculateAdmissionScore(input, config);

    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score).toEqual({ value: directResult.finalScore, scale: 100 });
    expect(evaluation.missingInputs).toEqual([]);
    expect(evaluation.missingRules).toEqual([]);
  });

  it('explanation có đủ 7 bước, bước cuối khớp finalScore', () => {
    const evaluation = evaluateHcmutAdmission(input, config);
    expect(evaluation.explanation).toHaveLength(7);
    expect(evaluation.explanation[evaluation.explanation.length - 1].id).toBe('final');
    expect(evaluation.explanation[evaluation.explanation.length - 1].output).toBe(evaluation.score?.value);
  });

  it('evidence không rỗng (có provenance đi kèm)', () => {
    const evaluation = evaluateHcmutAdmission(input, config);
    expect(evaluation.evidence.length).toBeGreaterThan(0);
  });
});
