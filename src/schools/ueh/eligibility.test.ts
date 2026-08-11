import { describe, expect, it } from 'vitest';
import { checkUehThreshold } from './eligibility';

describe('checkUehThreshold', () => {
  it('KSA: 65 đạt, 64.99 không đạt', () => {
    expect(checkUehThreshold(65, 'hcmc').pass).toBe(true);
    expect(checkUehThreshold(64.99, 'hcmc').pass).toBe(false);
  });

  it('KSV: 60 đạt, 59.99 không đạt', () => {
    expect(checkUehThreshold(60, 'mekong').pass).toBe(true);
    expect(checkUehThreshold(59.99, 'mekong').pass).toBe(false);
  });
});
