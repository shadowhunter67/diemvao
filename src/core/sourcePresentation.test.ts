import { describe, expect, it } from 'vitest';
import { formatSourceDate, lifecycleStatusLabel, sourceTypeLabel } from './sourcePresentation';

describe('source presentation helpers', () => {
  it.each([
    ['2026-01-01', '01/01/2026'],
    ['2026-08-13', '13/08/2026'],
    ['2026-12-31', '31/12/2026'],
  ])('formats date-only value without timezone shifting: %s', (input, expected) => {
    expect(formatSourceDate(input)).toBe(expected);
  });

  it('omits malformed or missing dates safely', () => {
    expect(formatSourceDate()).toBeUndefined();
    expect(formatSourceDate('2026-8-13')).toBeUndefined();
    expect(formatSourceDate('not-a-date')).toBeUndefined();
  });

  it('maps lifecycle and source type to Vietnamese labels', () => {
    expect(lifecycleStatusLabel('current')).toBe('Đang áp dụng');
    expect(lifecycleStatusLabel('historical')).toBe('Dữ liệu lịch sử');
    expect(lifecycleStatusLabel('superseded')).toBe('Đã được thay thế');
    expect(sourceTypeLabel('official-school')).toBe('Nguồn chính thức của trường');
    expect(sourceTypeLabel('official-republication')).toBe('Nguồn chính thức được đăng lại');
    expect(sourceTypeLabel('secondary')).toBe('Nguồn đối chiếu');
  });
});
