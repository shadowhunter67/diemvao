import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import {
  calculateAdmissionScore,
  calculateAdmissionScoreNoDgnl,
  calculateBonus,
  calculatePriority,
  convertDgnlScore,
  convertThptScore,
  convertTranscriptScore,
} from './calculator';
import type { AdmissionInput, TranscriptYear } from '../types/admission';

const config = activeAdmissionConfig;

function fullYear(math: number, subject2: number, subject3: number): TranscriptYear {
  return { math, subject2, subject3 };
}

describe('convertDgnlScore', () => {
  it('returns 100 when all components are maxed out', () => {
    const result = convertDgnlScore(
      { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
      config
    );
    expect(result.normalizedScore).toBe(100);
    expect(result.weightedScore).toBe(1500);
  });

  it('computes weighted math and normalized score correctly for a mixed case', () => {
    const result = convertDgnlScore(
      { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
      config
    );
    // 200 + 220 + 240*2 + 210 = 1110
    expect(result.weightedScore).toBe(1110);
    expect(result.normalizedScore).toBe(74);
  });
});

describe('convertThptScore', () => {
  it('matches the worked example: 9, 8, 7 -> 82.5', () => {
    const result = convertThptScore({ math: 9, subject2: 8, subject3: 7 }, config);
    expect(result.normalizedScore).toBe(82.5);
  });

  it('returns 100 when all subjects are maxed out', () => {
    const result = convertThptScore({ math: 10, subject2: 10, subject3: 10 }, config);
    expect(result.normalizedScore).toBe(100);
  });
});

describe('convertTranscriptScore', () => {
  it('returns 100 when all 9 grades are maxed out', () => {
    const result = convertTranscriptScore(
      {
        grade10: fullYear(10, 10, 10),
        grade11: fullYear(10, 10, 10),
        grade12: fullYear(10, 10, 10),
      },
      config
    );
    expect(result.normalizedScore).toBe(100);
  });

  it('computes weighted total/average for a mixed case', () => {
    const result = convertTranscriptScore(
      {
        grade10: fullYear(8, 7, 8),
        grade11: fullYear(8.5, 7.5, 8),
        grade12: fullYear(9, 8, 8.5),
      },
      config
    );
    // (8*2+7+8) + (8.5*2+7.5+8) + (9*2+8+8.5) = 31 + 32.5 + 34.5 = 98
    expect(result.weightedTotal).toBe(98);
    expect(result.weightedAverage).toBe(8.17);
  });
});

describe('calculateAdmissionScore - academic score', () => {
  it('yields academic score 100 when all three components are maxed out', () => {
    const input: AdmissionInput = {
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
    const result = calculateAdmissionScore(input, config);
    expect(result.academic.score).toBe(100);
    expect(result.finalScore).toBe(100);
    expect(result.abilitySource).toBe('dgnl-vnuhcm');
  });
});

describe('calculateAdmissionScoreNoDgnl (Đối tượng 2.2 — không có ĐGNL)', () => {
  it('ability score = THPT chuẩn hóa × 0.75, tối đa 75 kể cả khi THPT/học bạ tối đa', () => {
    const result = calculateAdmissionScoreNoDgnl(
      {
        thpt: { math: 10, subject2: 10, subject3: 10 },
        transcript: {
          grade10: fullYear(10, 10, 10),
          grade11: fullYear(10, 10, 10),
          grade12: fullYear(10, 10, 10),
        },
        bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 0,
      },
      config
    );
    expect(result.dgnl.normalizedScore).toBe(75);
    // academic = 75*0.7 + 100*0.2 + 100*0.1 = 82.5 — không thể đạt 100 khi không có ĐGNL.
    expect(result.academic.score).toBe(82.5);
    expect(result.finalScore).toBe(82.5);
    // abilitySource đánh dấu rõ đây KHÔNG phải điểm ĐGNL thật (workstream B — domain smell fix).
    expect(result.abilitySource).toBe('thpt-derived');
  });

  it('matches the worked example: THPT 9/8/7 -> ability 61.88, academic 69.82', () => {
    const result = calculateAdmissionScoreNoDgnl(
      {
        thpt: { math: 9, subject2: 8, subject3: 7 },
        transcript: {
          grade10: fullYear(10, 10, 10),
          grade11: fullYear(10, 10, 10),
          grade12: fullYear(10, 10, 10),
        },
        bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 0,
      },
      config
    );
    expect(result.thpt.normalizedScore).toBe(82.5);
    expect(result.dgnl.normalizedScore).toBe(61.88);
    expect(result.academic.score).toBe(69.82);
    expect(result.finalScore).toBe(69.82);
  });
});

describe('calculateBonus', () => {
  it('caps the total bonus at maxTotal', () => {
    const result = calculateBonus({ reward: 5, considerationReward: 5, encouragement: 5 }, config);
    expect(result.raw).toBe(15);
    expect(result.received).toBe(10);
  });

  it('does not cap when under the max', () => {
    const result = calculateBonus({ reward: 1, considerationReward: 1, encouragement: 1 }, config);
    expect(result.raw).toBe(3);
    expect(result.received).toBe(3);
  });
});

describe('calculatePriority', () => {
  it('gives the full converted priority when baseScore is below the threshold', () => {
    const result = calculatePriority(2.75, 70, config);
    expect(result.converted).toBe(9.17);
    expect(result.received).toBe(9.17);
  });

  it('reduces priority proportionally when baseScore is at or above the threshold', () => {
    // converted = raw/3*10, choose raw so converted = 5 exactly (raw = 1.5)
    const result = calculatePriority(1.5, 90, config);
    expect(result.converted).toBe(5);
    // (100 - 90) / 25 * 5 = 2
    expect(result.received).toBe(2);
  });

  it('never returns a negative received priority', () => {
    const result = calculatePriority(2.75, 100, config);
    expect(result.received).toBeGreaterThanOrEqual(0);
  });

  it('yields priorityReceived 0 when baseScoreForPriority exceeds 100 (academic 96 + bonus 10)', () => {
    // baseScoreForPriority = academic (96) + bonus received (10) = 106
    const result = calculatePriority(2.75, 106, config);
    expect(result.received).toBe(0);
  });
});
