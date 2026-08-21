import { describe, expect, it } from 'vitest';
import {
  checkHubStandardThreshold,
  checkHubEliteIeltsRequirement,
  checkHubLawThptExamThreshold,
  checkHubStandardComprehensiveVsat2026Eligibility,
  checkHubLawComprehensiveVsat2026Eligibility,
} from './eligibility';

describe('checkHubStandardThreshold', () => {
  it('15 pass, 14.99 fail', () => {
    expect(checkHubStandardThreshold(15).pass).toBe(true);
    expect(checkHubStandardThreshold(14.99).pass).toBe(false);
  });
});

describe('checkHubEliteIeltsRequirement', () => {
  it('5.5 pass, dưới 5.5 fail', () => {
    expect(checkHubEliteIeltsRequirement(5.5).pass).toBe(true);
    expect(checkHubEliteIeltsRequirement(5.49).pass).toBe(false);
  });

  it('chưa có điểm IELTS -> fail', () => {
    expect(checkHubEliteIeltsRequirement(undefined).pass).toBe(false);
  });
});

describe('checkHubLawThptExamThreshold', () => {
  it('KV3, tổng 20, tổ hợp A01 (Toán không Văn), Toán=6 -> pass', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'A01', mathScore: 6, priorityZone: 'KV3' });
    expect(result.pass).toBe(true);
  });

  it('KV3, tổng 19.99 (dưới ngưỡng 20) -> fail', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 19.99, combinationId: 'A01', mathScore: 8, priorityZone: 'KV3' });
    expect(result.pass).toBe(false);
  });

  it('KV3, tổng 20, tổ hợp A00, Toán=5.99 (dưới 6) -> fail', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'A00', mathScore: 5.99, priorityZone: 'KV3' });
    expect(result.pass).toBe(false);
  });

  it('KV3, tổng 20, tổ hợp D07, Toán=6 -> pass', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'D07', mathScore: 6, priorityZone: 'KV3' });
    expect(result.pass).toBe(true);
  });

  it('KV3, tổng 20, tổ hợp C01 (Toán+Văn), Toán=6 và Văn=6 -> pass', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'C01', mathScore: 6, literatureScore: 6, priorityZone: 'KV3' });
    expect(result.pass).toBe(true);
  });

  it('KV3, tổng 20, tổ hợp C01, Toán=6 nhưng Văn=5.99 -> fail', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'C01', mathScore: 6, literatureScore: 5.99, priorityZone: 'KV3' });
    expect(result.pass).toBe(false);
  });

  it('KV3, tổng 20, tổ hợp C02, Toán=6, Văn=6 -> pass; D01 tương tự', () => {
    expect(checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'C02', mathScore: 6, literatureScore: 6, priorityZone: 'KV3' }).pass).toBe(true);
    expect(checkHubLawThptExamThreshold({ totalScore30: 20, combinationId: 'D01', mathScore: 6, literatureScore: 6, priorityZone: 'KV3' }).pass).toBe(true);
  });

  it('đủ điều kiện điểm/môn nhưng KHÔNG phải khu vực 3 -> fail (chưa có ngưỡng khu vực khác)', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 25, combinationId: 'A00', mathScore: 8, priorityZone: 'KV1' });
    expect(result.pass).toBe(false);
  });

  it('tổ hợp không nhận diện được -> fail (không suy đoán điều kiện môn)', () => {
    const result = checkHubLawThptExamThreshold({ totalScore30: 25, combinationId: 'B00', mathScore: 8, priorityZone: 'KV3' });
    expect(result.pass).toBe(false);
  });
});

describe('checkHubStandardComprehensiveVsat2026Eligibility', () => {
  it('rank cả 3 năm khá + tổng 15 -> pass', () => {
    const result = checkHubStandardComprehensiveVsat2026Eligibility({ academicRank10: 'kha', academicRank11: 'kha', academicRank12: 'kha', totalScore30: 15 });
    expect(result.pass).toBe(true);
  });

  it('rank cả 3 năm giỏi + tổng 15 -> pass (giỏi cao hơn khá)', () => {
    const result = checkHubStandardComprehensiveVsat2026Eligibility({ academicRank10: 'gioi', academicRank11: 'gioi', academicRank12: 'gioi', totalScore30: 15 });
    expect(result.pass).toBe(true);
  });

  it('thiếu rank lớp 10 -> fail (không đủ thông tin)', () => {
    const result = checkHubStandardComprehensiveVsat2026Eligibility({ academicRank11: 'kha', academicRank12: 'kha', totalScore30: 15 });
    expect(result.pass).toBe(false);
  });

  it('tổng điểm 14.99 (dưới ngưỡng) dù rank đủ -> fail', () => {
    const result = checkHubStandardComprehensiveVsat2026Eligibility({ academicRank10: 'kha', academicRank11: 'kha', academicRank12: 'kha', totalScore30: 14.99 });
    expect(result.pass).toBe(false);
  });
});

describe('checkHubLawComprehensiveVsat2026Eligibility', () => {
  it('path (a): KV3 + tổng 20 + Toán>=6 -> pass', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ totalScore30: 20, combinationId: 'A01', mathScore: 6, priorityZone: 'KV3' });
    expect(result.pass).toBe(true);
  });

  it('path (b): học lực lớp 12 giỏi + tổng 18 + Toán>=6 -> pass', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ totalScore30: 18, combinationId: 'A01', mathScore: 6, academicRank12: 'gioi' });
    expect(result.pass).toBe(true);
  });

  it('path (b): học lực lớp 12 chỉ khá (dưới giỏi) + tổng 18 -> fail', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ totalScore30: 18, combinationId: 'A01', mathScore: 6, academicRank12: 'kha' });
    expect(result.pass).toBe(false);
  });

  it('path (b): tổng 17.99 (dưới ngưỡng 18) -> fail', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ totalScore30: 17.99, combinationId: 'A01', mathScore: 6, academicRank12: 'gioi' });
    expect(result.pass).toBe(false);
  });

  it('path (c): điểm xét tốt nghiệp THPT 8.5 -> pass', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ graduationScore10: 8.5 });
    expect(result.pass).toBe(true);
  });

  it('path (c): điểm xét tốt nghiệp THPT 8.49 -> fail', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({ graduationScore10: 8.49 });
    expect(result.pass).toBe(false);
  });

  it('không đáp ứng đường nào -> fail', () => {
    const result = checkHubLawComprehensiveVsat2026Eligibility({});
    expect(result.pass).toBe(false);
  });
});
