import { describe, expect, it } from 'vitest';
import { checkThptThreshold } from './eligibility';

describe('checkThptThreshold', () => {
  it('đạt ngưỡng khi quy đổi thang 100 >= 50', () => {
    // 15/30 * 100/30 = 50
    expect(checkThptThreshold(15).pass).toBe(true);
  });

  it('không đạt khi quy đổi < 50', () => {
    expect(checkThptThreshold(14.9).pass).toBe(false);
  });

  it('đạt rõ ràng với tổng điểm cao', () => {
    expect(checkThptThreshold(25).pass).toBe(true);
  });
});
