import { describe, expect, it } from 'vitest';
import { convertDgnlToScale100 } from './dgnlConversion';

describe('convertDgnlToScale100', () => {
  it('quy đổi đúng công thức đã verified (×100/1200)', () => {
    expect(convertDgnlToScale100(1200)).toBe(100);
    expect(convertDgnlToScale100(0)).toBe(0);
    expect(convertDgnlToScale100(600)).toBe(50);
  });

  it('trả null khi ngoài thang hợp lệ 0-1200', () => {
    expect(convertDgnlToScale100(-1)).toBeNull();
    expect(convertDgnlToScale100(1201)).toBeNull();
  });
});
