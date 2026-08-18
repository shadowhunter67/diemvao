import { describe, expect, it } from 'vitest';
import { calculateTdtuCompetencyObject11, calculateTdtuPt1FinalScore, calculateTdtuPt2FinalScore } from './calculator';

/**
 * Tier C (formula-derived) — expected values derive ĐỘC LẬP bằng tay từ công thức công bố
 * (`sources.ts:tdtu-admission-plan-2026`, mục 1.1 Đối tượng 1.1), KHÔNG generate bằng chính hàm
 * đang test. Không có Tier A worked example công khai tìm được trong batch này.
 */
describe('calculateTdtuCompetencyObject11 — Đối tượng 1.1', () => {
  it('matches hand-derived value: THPT(main=8,7,7) 0.75 + transcript(main=9,8,8) 0.25', () => {
    // THPT: (7+7+8*2)*2.5 = 30*2.5 = 75; transcript: (8+8+9*2)*2.5 = 34*2.5 = 85
    // competency = 75*0.75 + 85*0.25 = 56.25 + 21.25 = 77.5
    const result = calculateTdtuCompetencyObject11({
      thpt: { mainSubjectScore: 8, subject2Score: 7, subject3Score: 7 },
      transcript: { mainSubjectScore: 9, subject2Score: 8, subject3Score: 8 },
    });
    expect(result).toBe(77.5);
  });

  it('caps at the theoretical max 100 for perfect scores', () => {
    const result = calculateTdtuCompetencyObject11({
      thpt: { mainSubjectScore: 10, subject2Score: 10, subject3Score: 10 },
      transcript: { mainSubjectScore: 10, subject2Score: 10, subject3Score: 10 },
    });
    expect(result).toBe(100);
  });
});

describe('calculateTdtuPt1FinalScore', () => {
  it('sums competency + bonus + priority and clamps at 100', () => {
    expect(calculateTdtuPt1FinalScore({ competency100: 77.5, bonus100: 10, priority100: 1 })).toBe(88.5);
    expect(calculateTdtuPt1FinalScore({ competency100: 95, bonus100: 10, priority100: 2.5 })).toBe(100);
  });
});

describe('calculateTdtuPt2FinalScore', () => {
  it('sums ĐGNL + priority', () => {
    expect(calculateTdtuPt2FinalScore({ dgnlScore1200: 1000, priority1200: 15 })).toBe(1015);
  });
});
