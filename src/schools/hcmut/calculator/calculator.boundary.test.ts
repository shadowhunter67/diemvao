import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import { calculateAdmissionScore, calculateBonus, calculatePriority } from './calculator';
import type { AdmissionInput, TranscriptYear } from '../types/admission';

const config = activeAdmissionConfig;

function fullYear(math: number, subject2: number, subject3: number): TranscriptYear {
  return { math, subject2, subject3 };
}

const maxInput: AdmissionInput = {
  dgnl: { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
  thpt: { math: 10, subject2: 10, subject3: 10 },
  transcript: {
    grade10: fullYear(10, 10, 10),
    grade11: fullYear(10, 10, 10),
    grade12: fullYear(10, 10, 10),
  },
  bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
  priorityRaw30Scale: 0,
};

describe('calculatePriority — ngưỡng giảm ưu tiên chính xác tại 75', () => {
  it('baseScore = 74.99 (dưới ngưỡng): điểm ưu tiên KHÔNG bị giảm', () => {
    const result = calculatePriority(2.75, 74.99, config);
    expect(result.received).toBe(result.converted);
  });

  it('baseScore = 75 đúng (chạm ngưỡng): rơi vào nhánh giảm nhưng hệ số giảm = 1, chưa giảm thật', () => {
    const result = calculatePriority(2.75, 75, config);
    // (100 - 75) / 25 * converted = 1 * converted -> tại đúng 75, hệ số giảm = 1 (chưa giảm thật)
    expect(result.received).toBeCloseTo(result.converted, 5);
  });

  it('baseScore = 75.01 (trên ngưỡng): điểm ưu tiên giảm theo tỉ lệ, nhỏ hơn baseScore = 75', () => {
    const atThreshold = calculatePriority(2.75, 75, config);
    const overThreshold = calculatePriority(2.75, 75.01, config);
    expect(overThreshold.received).toBeLessThan(atThreshold.received);
  });

  it('baseScore >= scoreScale (100): điểm ưu tiên nhận không bao giờ âm', () => {
    const result = calculatePriority(2.75, 100, config);
    expect(result.received).toBeGreaterThanOrEqual(0);
    const overScale = calculatePriority(2.75, 120, config);
    expect(overScale.received).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateBonus — cap tại maxTotal', () => {
  it('raw vượt maxTotal: received bị cắt đúng maxTotal', () => {
    const result = calculateBonus({ reward: 20, considerationReward: 20, encouragement: 20 }, config);
    expect(result.raw).toBe(60);
    expect(result.received).toBe(config.bonus.maxTotal);
  });

  it('raw dưới maxTotal: received giữ nguyên raw', () => {
    const result = calculateBonus({ reward: 2, considerationReward: 1, encouragement: 0 }, config);
    expect(result.received).toBe(result.raw);
  });
});

describe('calculateAdmissionScore — finalScore không bao giờ vượt scoreScale', () => {
  it('mọi input ở mức max + bonus/priority tối đa: finalScore = scoreScale (100), không vượt', () => {
    const result = calculateAdmissionScore(
      { ...maxInput, bonus: { reward: 10, considerationReward: 10, encouragement: 10 }, priorityRaw30Scale: 2.75 },
      config
    );
    expect(result.finalScore).toBe(config.scoreScale);
  });

  it('monotonicity: tăng bất kỳ thành phần điểm gốc nào không làm giảm finalScore', () => {
    const base = calculateAdmissionScore(
      {
        dgnl: { vietnamese: 150, english: 150, math: 150, scientificThinking: 150 },
        thpt: { math: 5, subject2: 5, subject3: 5 },
        transcript: {
          grade10: fullYear(5, 5, 5),
          grade11: fullYear(5, 5, 5),
          grade12: fullYear(5, 5, 5),
        },
        bonus: { reward: 1, considerationReward: 1, encouragement: 1 },
        priorityRaw30Scale: 1,
      },
      config
    );

    const higherDgnl = calculateAdmissionScore(
      {
        dgnl: { vietnamese: 200, english: 200, math: 200, scientificThinking: 200 },
        thpt: { math: 5, subject2: 5, subject3: 5 },
        transcript: {
          grade10: fullYear(5, 5, 5),
          grade11: fullYear(5, 5, 5),
          grade12: fullYear(5, 5, 5),
        },
        bonus: { reward: 1, considerationReward: 1, encouragement: 1 },
        priorityRaw30Scale: 1,
      },
      config
    );

    expect(higherDgnl.finalScore).toBeGreaterThanOrEqual(base.finalScore);
  });
});
