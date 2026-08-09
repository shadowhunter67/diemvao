import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import { calculateAdmissionScore } from './calculator';
import { calculateAdmissionScoreFromWeightedDgnlRaw, calculateRequiredDgnl } from './targetCalculator';
import type { AdmissionInput } from '../types/admission';

const config = activeAdmissionConfig;

function baseInput(overrides: Partial<AdmissionInput> = {}): AdmissionInput {
  return {
    dgnl: { vietnamese: 0, english: 0, math: 0, scientificThinking: 0 },
    thpt: { math: 0, subject2: 0, subject3: 0 },
    transcript: {
      grade10: { math: 0, subject2: 0, subject3: 0 },
      grade11: { math: 0, subject2: 0, subject3: 0 },
      grade12: { math: 0, subject2: 0, subject3: 0 },
    },
    bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
    priorityRaw30Scale: 0,
    ...overrides,
  };
}

describe('calculateRequiredDgnl', () => {
  it('case 1: current final already exceeds target -> possible + alreadyReached', () => {
    const input = baseInput({
      dgnl: { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
      thpt: { math: 10, subject2: 10, subject3: 10 },
      transcript: {
        grade10: { math: 10, subject2: 10, subject3: 10 },
        grade11: { math: 10, subject2: 10, subject3: 10 },
        grade12: { math: 10, subject2: 10, subject3: 10 },
      },
    });
    const result = calculateRequiredDgnl(90, input, config);
    expect(result.possible).toBe(true);
    expect(result.alreadyReached).toBe(true);
    expect(result.requiredNormalizedScore).toBeNull();
  });

  it('case 2: solution exists within 0..100 normalized', () => {
    const otherInputs = {
      thpt: { math: 9, subject2: 8, subject3: 7 },
      transcript: {
        grade10: { math: 8, subject2: 8, subject3: 8 },
        grade11: { math: 8, subject2: 8, subject3: 8 },
        grade12: { math: 8, subject2: 8, subject3: 8 },
      },
      bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
      priorityRaw30Scale: 0,
    };
    const input = baseInput(otherInputs);
    const target = 70;
    const result = calculateRequiredDgnl(target, input, config);

    expect(result.possible).toBe(true);
    expect(result.alreadyReached).toBe(false);
    expect(result.requiredNormalizedScore).not.toBeNull();
    expect(result.requiredNormalizedScore!).toBeGreaterThanOrEqual(0);
    expect(result.requiredNormalizedScore!).toBeLessThanOrEqual(100);
    // công thức đơn giản (không tính priority phi tuyến) dự đoán ~65.00 vì priorityReceived = 0 xuyên suốt ở case này
    expect(result.requiredNormalizedScore!).toBeCloseTo(65, 1);

    const achieved = calculateAdmissionScoreFromWeightedDgnlRaw(result.requiredWeightedRawScore!, otherInputs, config);
    expect(achieved.finalScore).toBeGreaterThanOrEqual(target - 0.01);
  });

  it('case 3: target unreachable even with DGNL normalized = 100', () => {
    const input = baseInput();
    const result = calculateRequiredDgnl(90, input, config);

    expect(result.possible).toBe(false);
    expect(result.requiredNormalizedScore).toBeNull();
    // max achievable = 0.7 * 100 (DGNL max) + 0 (thpt) + 0 (transcript) + 0 (bonus/priority) = 70
    expect(result.maxAchievableFinalScore).toBeCloseTo(70, 1);
  });

  it('case 4: target equals current final -> alreadyReached', () => {
    const input = baseInput({
      dgnl: { vietnamese: 200, english: 200, math: 200, scientificThinking: 200 },
      thpt: { math: 8, subject2: 8, subject3: 8 },
      transcript: {
        grade10: { math: 8, subject2: 8, subject3: 8 },
        grade11: { math: 8, subject2: 8, subject3: 8 },
        grade12: { math: 8, subject2: 8, subject3: 8 },
      },
    });
    const currentFinal = calculateAdmissionScore(input, config).finalScore;
    const result = calculateRequiredDgnl(currentFinal, input, config);

    expect(result.possible).toBe(true);
    expect(result.alreadyReached).toBe(true);
  });

  it('case 6: binary search stays correct when the solution crosses the priority-reduction threshold (75)', () => {
    const otherInputs = {
      thpt: { math: 10, subject2: 10, subject3: 10 },
      transcript: {
        grade10: { math: 10, subject2: 10, subject3: 10 },
        grade11: { math: 10, subject2: 10, subject3: 10 },
        grade12: { math: 10, subject2: 10, subject3: 10 },
      },
      bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
      priorityRaw30Scale: 2.75,
    };
    const input = baseInput(otherInputs);
    const target = 90;
    const result = calculateRequiredDgnl(target, input, config);

    expect(result.possible).toBe(true);
    expect(result.alreadyReached).toBe(false);
    expect(result.requiredNormalizedScore).not.toBeNull();

    const achieved = calculateAdmissionScoreFromWeightedDgnlRaw(result.requiredWeightedRawScore!, otherInputs, config);
    expect(achieved.finalScore).toBeGreaterThanOrEqual(target - 0.01);
    // baseScoreForPriority tại nghiệm phải >= 75 (nằm trong nhánh giảm dần) và
    // priority thực nhận phải nhỏ hơn priority quy đổi => xác nhận đã đi qua ngưỡng.
    expect(achieved.baseScore).toBeGreaterThanOrEqual(75);
    expect(achieved.priority.received).toBeLessThan(achieved.priority.converted);
  });
});
