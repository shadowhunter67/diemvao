import { describe, expect, it } from 'vitest';
import { calculateUmpBonus30, UMP_BONUS_CAP_30 } from './bonus';

describe('calculateUmpBonus30', () => {
  it('không có chứng chỉ nào → 0', () => {
    expect(calculateUmpBonus30({})).toEqual({ englishBonus: 0, satBonus: 0, total30: 0 });
  });

  it('IELTS dưới ngưỡng 6.0 → không tính', () => {
    const result = calculateUmpBonus30({ englishCertificate: { type: 'ielts', score: 5.5 } });
    expect(result.englishBonus).toBe(0);
  });

  it('IELTS đạt ngưỡng → 0,9 × (điểm/9)', () => {
    const result = calculateUmpBonus30({ englishCertificate: { type: 'ielts', score: 9 } });
    expect(result.englishBonus).toBe(0.9);
  });

  it('TOEFL iBT dưới ngưỡng 80 → không tính', () => {
    const result = calculateUmpBonus30({ englishCertificate: { type: 'toefl-ibt', score: 79 } });
    expect(result.englishBonus).toBe(0);
  });

  it('SAT dưới ngưỡng 1340 → không tính', () => {
    const result = calculateUmpBonus30({ satScore: 1339 });
    expect(result.satBonus).toBe(0);
  });

  it('SAT đạt ngưỡng → 0,9 × (điểm/1600)', () => {
    const result = calculateUmpBonus30({ satScore: 1600 });
    expect(result.satBonus).toBe(0.9);
  });

  it('cộng dồn ngoại ngữ + SAT, kẹp trần 1,50', () => {
    const result = calculateUmpBonus30({ englishCertificate: { type: 'ielts', score: 9 }, satScore: 1600 });
    expect(result.englishBonus).toBe(0.9);
    expect(result.satBonus).toBe(0.9);
    expect(result.total30).toBe(UMP_BONUS_CAP_30);
  });
});
