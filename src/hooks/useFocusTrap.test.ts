import { describe, expect, it } from 'vitest';
import { computeTrapFocusTarget } from './useFocusTrap';

describe('computeTrapFocusTarget', () => {
  const items = ['a', 'b', 'c'];

  it('Shift+Tab từ phần tử đầu tiên nhảy tới phần tử cuối cùng', () => {
    expect(computeTrapFocusTarget(items, 'a', true)).toBe('c');
  });

  it('Tab từ phần tử cuối cùng nhảy tới phần tử đầu tiên', () => {
    expect(computeTrapFocusTarget(items, 'c', false)).toBe('a');
  });

  it('Tab/Shift+Tab ở giữa danh sách không bị can thiệp', () => {
    expect(computeTrapFocusTarget(items, 'b', false)).toBeUndefined();
    expect(computeTrapFocusTarget(items, 'b', true)).toBeUndefined();
  });

  it('danh sách rỗng không có target nào', () => {
    expect(computeTrapFocusTarget([], null, false)).toBeUndefined();
    expect(computeTrapFocusTarget([], null, true)).toBeUndefined();
  });

  it('danh sách chỉ có 1 phần tử: Tab và Shift+Tab đều quay lại chính nó', () => {
    expect(computeTrapFocusTarget(['only'], 'only', false)).toBe('only');
    expect(computeTrapFocusTarget(['only'], 'only', true)).toBe('only');
  });

  it('activeItem không thuộc rìa danh sách (không phải first/last) thì không có target', () => {
    expect(computeTrapFocusTarget(items, 'z', false)).toBeUndefined();
  });
});
