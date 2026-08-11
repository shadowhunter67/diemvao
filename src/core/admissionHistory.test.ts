import { describe, expect, it } from 'vitest';
import {
  finalCutoffsSortedDesc,
  isYearPublished,
  latestFinalCutoff,
  nearestPreviousFinalCutoff,
} from './admissionHistory';

interface FakeCutoff {
  year: number;
  score: number;
  status?: 'final' | 'superseded';
}

describe('isYearPublished', () => {
  it('true khi có record final đúng năm', () => {
    expect(isYearPublished<FakeCutoff>([{ year: 2026, score: 80 }], 2026)).toBe(true);
  });

  it('false khi không có record nào cho năm đó (đại diện "chưa công bố")', () => {
    expect(isYearPublished<FakeCutoff>([{ year: 2025, score: 80 }], 2026)).toBe(false);
  });

  it('false nếu record duy nhất của năm đó đã superseded', () => {
    expect(isYearPublished<FakeCutoff>([{ year: 2026, score: 60, status: 'superseded' }], 2026)).toBe(false);
  });
});

describe('latestFinalCutoff', () => {
  it('bỏ qua superseded, lấy final mới nhất', () => {
    const records: FakeCutoff[] = [
      { year: 2026, score: 70, status: 'superseded' },
      { year: 2026, score: 71.7, status: 'final' },
      { year: 2025, score: 68 },
    ];
    expect(latestFinalCutoff(records)?.score).toBe(71.7);
  });

  it('undefined nếu rỗng', () => {
    expect(latestFinalCutoff<FakeCutoff>([])).toBeUndefined();
  });
});

describe('nearestPreviousFinalCutoff', () => {
  it('bỏ qua năm liền trước nếu không có dữ liệu, lấy năm gần nhất có final', () => {
    const records: FakeCutoff[] = [
      { year: 2024, score: 65 },
      { year: 2026, score: 80 },
    ];
    // 2025 không tồn tại -> phải nhảy về 2024, không phải mặc định beforeYear-1
    expect(nearestPreviousFinalCutoff(records, 2026)?.year).toBe(2024);
  });

  it('không lấy chính beforeYear dù nó có final', () => {
    const records: FakeCutoff[] = [{ year: 2026, score: 80 }];
    expect(nearestPreviousFinalCutoff(records, 2026)).toBeUndefined();
  });
});

describe('finalCutoffsSortedDesc', () => {
  it('lọc superseded và sort năm giảm dần', () => {
    const records: FakeCutoff[] = [
      { year: 2024, score: 60 },
      { year: 2026, score: 80, status: 'superseded' },
      { year: 2025, score: 70 },
    ];
    expect(finalCutoffsSortedDesc(records).map((r) => r.year)).toEqual([2025, 2024]);
  });
});
