import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from './config/admission-2026';
import { calculateAdmissionScore, calculateAdmissionScoreNoDgnl } from './calculator/calculator';
import { calculateAdmissionScoreFromWeightedDgnlRaw } from './calculator/targetCalculator';
import { evaluateHcmutAdmission, evaluateHcmutAdmissionFromWeightedDgnlRaw, evaluateHcmutNoDgnlAdmission } from './evaluate';
import type { AdmissionInput, TranscriptYear } from './types/admission';

const config = activeAdmissionConfig;

function fullYear(math: number, subject2: number, subject3: number): TranscriptYear {
  return { math, subject2, subject3 };
}

const FIELDS_TO_COMPARE = [
  'finalScore',
  'baseScore',
  'academic',
  'bonus',
  'priority',
] as const;

function assertParity(legacy: ReturnType<typeof calculateAdmissionScore>, viaEvaluation: { result: typeof legacy }) {
  for (const field of FIELDS_TO_COMPARE) {
    expect(viaEvaluation.result[field]).toEqual(legacy[field]);
  }
  expect(viaEvaluation.result.dgnl.normalizedScore).toBe(legacy.dgnl.normalizedScore);
  expect(viaEvaluation.result.thpt.normalizedScore).toBe(legacy.thpt.normalizedScore);
  expect(viaEvaluation.result.transcript.normalizedScore).toBe(legacy.transcript.normalizedScore);
}

describe('evaluateHcmutAdmission — parity với calculateAdmissionScore (đối tượng có ĐGNL, nhập chi tiết)', () => {
  const cases: { name: string; input: AdmissionInput }[] = [
    {
      name: 'max values',
      input: {
        dgnl: { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
        thpt: { math: 10, subject2: 10, subject3: 10 },
        transcript: { grade10: fullYear(10, 10, 10), grade11: fullYear(10, 10, 10), grade12: fullYear(10, 10, 10) },
        bonus: { reward: 10, considerationReward: 10, encouragement: 10 },
        priorityRaw30Scale: 2.75,
      },
    },
    {
      name: 'typical values',
      input: {
        dgnl: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
        thpt: { math: 9, subject2: 8, subject3: 7 },
        transcript: { grade10: fullYear(9, 8, 7), grade11: fullYear(9, 8, 7), grade12: fullYear(9, 8, 7) },
        bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
        priorityRaw30Scale: 1.5,
      },
    },
    {
      name: 'quanh priority threshold (baseScore ≈ 75)',
      input: {
        dgnl: { vietnamese: 180, english: 180, math: 180, scientificThinking: 180 },
        thpt: { math: 8, subject2: 8, subject3: 8 },
        transcript: { grade10: fullYear(8, 8, 8), grade11: fullYear(8, 8, 8), grade12: fullYear(8, 8, 8) },
        bonus: { reward: 3, considerationReward: 0, encouragement: 0 },
        priorityRaw30Scale: 2,
      },
    },
    {
      name: 'bonus cap (raw > maxTotal)',
      input: {
        dgnl: { vietnamese: 150, english: 150, math: 150, scientificThinking: 150 },
        thpt: { math: 6, subject2: 6, subject3: 6 },
        transcript: { grade10: fullYear(6, 6, 6), grade11: fullYear(6, 6, 6), grade12: fullYear(6, 6, 6) },
        bonus: { reward: 20, considerationReward: 20, encouragement: 20 },
        priorityRaw30Scale: 0,
      },
    },
    {
      name: 'final cap 100',
      input: {
        dgnl: { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
        thpt: { math: 10, subject2: 10, subject3: 10 },
        transcript: { grade10: fullYear(10, 10, 10), grade11: fullYear(10, 10, 10), grade12: fullYear(10, 10, 10) },
        bonus: { reward: 10, considerationReward: 10, encouragement: 10 },
        priorityRaw30Scale: 2.75,
      },
    },
  ];

  for (const { name, input } of cases) {
    it(`case: ${name}`, () => {
      assertParity(calculateAdmissionScore(input, config), evaluateHcmutAdmission(input, config));
    });
  }

  it('deterministic fuzz — 3000 input ngẫu nhiên (seed cố định) khớp 100% legacy vs evaluation', () => {
    let seed = 42;
    const rand = () => {
      // mulberry32 — PRNG đơn giản, deterministic theo seed cố định
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const score = (max: number) => rand() * max;
    const year = (): TranscriptYear => ({ math: score(10), subject2: score(10), subject3: score(10) });

    for (let i = 0; i < 3000; i++) {
      const input: AdmissionInput = {
        dgnl: { vietnamese: score(300), english: score(300), math: score(300), scientificThinking: score(300) },
        thpt: { math: score(10), subject2: score(10), subject3: score(10) },
        transcript: { grade10: year(), grade11: year(), grade12: year() },
        bonus: { reward: score(5), considerationReward: score(5), encouragement: score(5) },
        priorityRaw30Scale: score(2.75),
      };
      assertParity(calculateAdmissionScore(input, config), evaluateHcmutAdmission(input, config));
    }
  });
});

describe('evaluateHcmutNoDgnlAdmission — parity với calculateAdmissionScoreNoDgnl', () => {
  const otherInputs: Omit<AdmissionInput, 'dgnl'> = {
    thpt: { math: 9, subject2: 8, subject3: 7 },
    transcript: { grade10: fullYear(9, 8, 7), grade11: fullYear(9, 8, 7), grade12: fullYear(9, 8, 7) },
    bonus: { reward: 1, considerationReward: 1, encouragement: 1 },
    priorityRaw30Scale: 1,
  };

  it('typical values', () => {
    assertParity(calculateAdmissionScoreNoDgnl(otherInputs, config), evaluateHcmutNoDgnlAdmission(otherInputs, config));
  });

  it('max values', () => {
    const maxOther: Omit<AdmissionInput, 'dgnl'> = {
      thpt: { math: 10, subject2: 10, subject3: 10 },
      transcript: { grade10: fullYear(10, 10, 10), grade11: fullYear(10, 10, 10), grade12: fullYear(10, 10, 10) },
      bonus: { reward: 10, considerationReward: 10, encouragement: 10 },
      priorityRaw30Scale: 2.75,
    };
    assertParity(calculateAdmissionScoreNoDgnl(maxOther, config), evaluateHcmutNoDgnlAdmission(maxOther, config));
  });

  it('abilitySource = thpt-derived (không bị gọi nhầm là ĐGNL thật)', () => {
    const evaluation = evaluateHcmutNoDgnlAdmission(otherInputs, config);
    expect(evaluation.result.abilitySource).toBe('thpt-derived');
  });
});

describe('evaluateHcmutAdmissionFromWeightedDgnlRaw — parity với calculateAdmissionScoreFromWeightedDgnlRaw (chế độ Nhập tổng điểm ĐGNL)', () => {
  const otherInputs: Omit<AdmissionInput, 'dgnl'> = {
    thpt: { math: 8, subject2: 7, subject3: 9 },
    transcript: { grade10: fullYear(8, 7, 9), grade11: fullYear(8, 7, 9), grade12: fullYear(8, 7, 9) },
    bonus: { reward: 2, considerationReward: 0, encouragement: 1 },
    priorityRaw30Scale: 0.5,
  };

  for (const weightedRaw of [0, 750, 950, 1500]) {
    it(`weightedRaw = ${weightedRaw}`, () => {
      const legacy = calculateAdmissionScoreFromWeightedDgnlRaw(weightedRaw, otherInputs, config);
      const evaluation = evaluateHcmutAdmissionFromWeightedDgnlRaw(weightedRaw, otherInputs, config);
      expect(evaluation.result.finalScore).toBe(legacy.finalScore);
      expect(evaluation.result.baseScore).toBe(legacy.baseScore);
      expect(evaluation.result.academic).toEqual(legacy.academic);
      expect(evaluation.result.bonus).toEqual(legacy.bonus);
      expect(evaluation.result.priority).toEqual(legacy.priority);
      expect(evaluation.result.dgnl.normalizedScore).toBe(legacy.dgnlNormalizedScore);
      expect(evaluation.result.dgnl.weightedScore).toBe(legacy.dgnlWeightedRawScore);
      expect(evaluation.result.abilitySource).toBe('dgnl-vnuhcm');
    });
  }
});
