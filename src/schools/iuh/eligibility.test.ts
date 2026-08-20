import { describe, expect, it } from 'vitest';
import { checkIuhStandardThreshold } from './eligibility';

describe('IUH eligibility', () => {
  it('passes at exactly the 18/30 threshold', () => {
    expect(checkIuhStandardThreshold(18).pass).toBe(true);
  });

  it('fails just below the threshold', () => {
    expect(checkIuhStandardThreshold(17.99).pass).toBe(false);
  });

  it('passes above the threshold', () => {
    expect(checkIuhStandardThreshold(24).pass).toBe(true);
  });
});
