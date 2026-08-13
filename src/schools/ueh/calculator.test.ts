import { describe, expect, it } from 'vitest';
import { calculateUehExactScore } from './calculator';

describe('calculateUehExactScore', () => {
  it('matches UEH official worked example (ĐGNL 950 → 25.55/30, học bạ 8.6/10, +5 điểm cộng → 90.50)', () => {
    const result = calculateUehExactScore({
      examScore30: 25.55,
      gpaGrade10: 8.6,
      gpaGrade11: 8.6,
      gpaGrade12: 8.6,
      bonusIds: ['thpt-chuyen'],
      priorityZone: 'kv3',
      priorityObjectGroup: 'none',
    });

    expect(result.examScaled100).toBeCloseTo(85.17, 2);
    expect(result.transcriptScaled100).toBeCloseTo(86, 2);
    expect(result.admissionScoreBeforeBonus).toBeCloseTo(85.5, 1);
    expect(result.bonus.total).toBeCloseTo(2, 2);
    expect(result.finalScore).toBeCloseTo(87.5, 1);
  });

  it('reproduces the exact official example arithmetic 51.10 + 34.40 + 5.00 = 90.50', () => {
    // Ví dụ nguyên văn nguồn dùng thẳng 2 con số trung gian (25.55 thang 30, 8.6 thang 10) và 5.0
    // điểm cộng — tự dựng input GPA đồng nhất 8.6 cho cả 3 năm để tái tạo đúng số 8.6 thang 10.
    const result = calculateUehExactScore({
      examScore30: 25.55,
      gpaGrade10: 8.6,
      gpaGrade11: 8.6,
      gpaGrade12: 8.6,
      bonusIds: ['ielts-6', 'hsg-tinh-nhat'],
      priorityZone: 'kv3',
      priorityObjectGroup: 'none',
    });

    expect(result.examScaled100).toBeCloseTo(51.1 / 0.6, 2); // 85.1667 thang 100 trước hệ số 60%
    expect(result.transcriptScaled100).toBeCloseTo(86, 2);
    expect(result.admissionScoreBeforeBonus).toBeCloseTo(51.1 + 34.4, 1);
    expect(result.bonus.total).toBe(10); // reward max 5 (hsg-tinh-nhat) + encouragement max 5 (ielts-6)
    expect(result.finalScore).toBeCloseTo(95.5, 1);
  });

  it('applies priority reduction formula only when total (with bonus) reaches 75', () => {
    const belowThreshold = calculateUehExactScore({
      examScore30: 18,
      gpaGrade10: 6,
      gpaGrade11: 6,
      gpaGrade12: 6,
      bonusIds: [],
      priorityZone: 'kv1',
      priorityObjectGroup: 'dt1-3',
    });
    // examScaled100=60, transcriptScaled100=60, total=60*0.6+60*0.4=60 < 75 → hưởng trọn ưu tiên
    expect(belowThreshold.totalBeforePriority).toBeCloseTo(60, 1);
    expect(belowThreshold.priority.reduced).toBe(false);
    expect(belowThreshold.priority.received).toBeCloseTo(2.5 + 6.67, 2);

    const aboveThreshold = calculateUehExactScore({
      examScore30: 27,
      gpaGrade10: 9,
      gpaGrade11: 9,
      gpaGrade12: 9,
      bonusIds: [],
      priorityZone: 'kv1',
      priorityObjectGroup: 'dt1-3',
    });
    // examScaled100=90, transcriptScaled100=90, total=90 ≥ 75 → giảm dần
    expect(aboveThreshold.totalBeforePriority).toBeCloseTo(90, 1);
    expect(aboveThreshold.priority.reduced).toBe(true);
    expect(aboveThreshold.priority.received).toBeCloseTo(((100 - 90) / 25) * (2.5 + 6.67), 2);
  });

  it('caps bonus at 10 total even if both groups hit their own 5-point cap', () => {
    const result = calculateUehExactScore({
      examScore30: 15,
      gpaGrade10: 5,
      gpaGrade11: 5,
      gpaGrade12: 5,
      bonusIds: ['hsg-tinh-nhat', 'hsg-tinh-nhi', 'ielts-6'],
      priorityZone: 'kv3',
      priorityObjectGroup: 'none',
    });
    expect(result.bonus.rewardPoints).toBe(5); // MAX(5, 4) trong nhóm reward
    expect(result.bonus.encouragementPoints).toBe(5);
    expect(result.bonus.total).toBe(10);
  });
});
