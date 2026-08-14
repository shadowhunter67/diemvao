import { describe, expect, it } from 'vitest';
import { calculateHcmusAcademicScore } from './academicScore';

describe('calculateHcmusAcademicScore', () => {
  it('route1 (THPT): 0.8×THPT + 0.2×học bạ', () => {
    const result = calculateHcmusAcademicScore({ thptTotal30: 25, transcriptTotal30: 27 });
    expect(result.route1Thpt.available).toBe(true);
    expect(result.route1Thpt.value).toBeCloseTo(0.8 * 25 + 0.2 * 27, 5);
    expect(result.route2Vact.available).toBe(false);
    expect(result.academicScore).toBe(result.route1Thpt.value);
    expect(result.usedRoute).toBe('thpt');
  });

  it('route2 (ĐGNL): 0.8×convertedVact + 0.2×học bạ, dùng thang 30 quy đổi từ bảng phân vị', () => {
    const result = calculateHcmusAcademicScore({ vactRaw1200: 655, transcriptTotal30: 27 });
    expect(result.route2Vact.available).toBe(true);
    expect(result.route2Vact.convertedVact).toBe(20.3);
    expect(result.route2Vact.value).toBeCloseTo(0.8 * 20.3 + 0.2 * 27, 5);
    expect(result.route1Thpt.available).toBe(false);
    expect(result.academicScore).toBe(result.route2Vact.value);
    expect(result.usedRoute).toBe('vact');
  });

  it('cả 2 route sẵn có → academicScore = MAX(route1, route2)', () => {
    const result = calculateHcmusAcademicScore({ thptTotal30: 20, vactRaw1200: 1108, transcriptTotal30: 30 });
    // route1 = 0.8*20+0.2*30=22; route2 = 0.8*29.75+0.2*30=29.8 → route2 thắng
    expect(result.route1Thpt.value).toBeCloseTo(22, 5);
    expect(result.route2Vact.value).toBeCloseTo(29.8, 5);
    expect(result.academicScore).toBe(result.route2Vact.value);
    expect(result.usedRoute).toBe('vact');
  });

  it('route1 thắng khi cao hơn route2', () => {
    const result = calculateHcmusAcademicScore({ thptTotal30: 29, vactRaw1200: 370, transcriptTotal30: 29 });
    expect(result.usedRoute).toBe('thpt');
    expect(result.academicScore).toBe(result.route1Thpt.value);
  });

  it('thiếu học bạ → cả 2 route unavailable dù có THPT/ĐGNL', () => {
    const result = calculateHcmusAcademicScore({ thptTotal30: 25, vactRaw1200: 900 });
    expect(result.route1Thpt.available).toBe(false);
    expect(result.route2Vact.available).toBe(false);
    expect(result.route2Vact.convertedVact).toBeDefined();
    expect(result.academicScore).toBeUndefined();
  });

  it('ĐGNL ngoài phạm vi bảng hỗ trợ (< 370) → route2 unavailable, đánh dấu vactOutOfSupportedRange', () => {
    const result = calculateHcmusAcademicScore({ vactRaw1200: 300, transcriptTotal30: 25 });
    expect(result.route2Vact.available).toBe(false);
    expect(result.route2Vact.vactOutOfSupportedRange).toBe(true);
  });

  it('không có input nào → academicScore undefined', () => {
    const result = calculateHcmusAcademicScore({});
    expect(result.academicScore).toBeUndefined();
    expect(result.usedRoute).toBeUndefined();
  });
});
