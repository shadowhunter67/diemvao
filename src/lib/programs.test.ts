import { describe, expect, it } from 'vitest';
import {
  addProgramToComparison,
  calculateEffectiveTarget,
  calculateGap,
  getLatestComparableCutoff,
  getProgramById,
  removeProgramFromComparison,
} from './programs';

describe('getProgramById', () => {
  it('case 1: trả về đúng ngành khi id hợp lệ', () => {
    const program = getProgramById('khoa-hoc-may-tinh');
    expect(program).toBeDefined();
    expect(program?.name).toBe('Khoa học Máy tính');
  });

  it('case 2: trả về undefined khi id không tồn tại', () => {
    expect(getProgramById('nganh-khong-ton-tai')).toBeUndefined();
  });
});

describe('getLatestComparableCutoff', () => {
  it('case 3: trả về cutoff của năm mới nhất (2026, không phải 2025)', () => {
    const latest = getLatestComparableCutoff('khoa-hoc-may-tinh');
    expect(latest?.year).toBe(2026);
    expect(latest?.score).toBe(85.45);
  });

  it('trả về undefined khi ngành không có cutoff nào', () => {
    expect(getLatestComparableCutoff('nganh-khong-ton-tai')).toBeUndefined();
  });
});

describe('calculateGap', () => {
  it('case 4: âm khi điểm hiện tại thấp hơn cutoff', () => {
    expect(calculateGap(84.72, 85.45)).toBeCloseTo(-0.73, 2);
  });

  it('case 5: dương khi điểm hiện tại cao hơn cutoff', () => {
    expect(calculateGap(86, 85.45)).toBeCloseTo(0.55, 2);
  });

  it('bằng 0 khi điểm hiện tại đúng bằng cutoff', () => {
    expect(calculateGap(85.45, 85.45)).toBe(0);
  });
});

describe('calculateEffectiveTarget', () => {
  it('case 6: cutoff + buffer +1.00', () => {
    expect(calculateEffectiveTarget(85.45, 1, 100)).toBe(86.45);
  });

  it('clamp về scoreScale nếu cutoff + buffer vượt quá', () => {
    expect(calculateEffectiveTarget(99.5, 2, 100)).toBe(100);
  });

  it('buffer 0 giữ nguyên cutoff', () => {
    expect(calculateEffectiveTarget(85.45, 0, 100)).toBe(85.45);
  });
});

describe('addProgramToComparison / removeProgramFromComparison', () => {
  it('case 9: không thêm quá 3 ngành, yêu cầu bỏ bớt trước', () => {
    const threePinned = ['a', 'b', 'c'];
    expect(addProgramToComparison(threePinned, 'd')).toEqual(threePinned);
  });

  it('case 10: không thêm trùng ngành đã pin', () => {
    const pinned = ['a', 'b'];
    expect(addProgramToComparison(pinned, 'a')).toEqual(pinned);
  });

  it('thêm bình thường khi chưa đủ 3 và chưa có trong danh sách', () => {
    expect(addProgramToComparison(['a'], 'b')).toEqual(['a', 'b']);
  });

  it('bỏ ngành khỏi danh sách so sánh cho phép thêm lại ngành khác', () => {
    const afterRemove = removeProgramFromComparison(['a', 'b', 'c'], 'b');
    expect(afterRemove).toEqual(['a', 'c']);
    expect(addProgramToComparison(afterRemove, 'd')).toEqual(['a', 'c', 'd']);
  });
});
