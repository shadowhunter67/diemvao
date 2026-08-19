import { describe, expect, it } from 'vitest';
import { checkHcmueThptThreshold, getHcmueProgramThreshold } from './eligibility';

describe('HCMUE eligibility', () => {
  it('checks official THPT threshold by selected school-local program id', () => {
    expect(getHcmueProgramThreshold('hcmue-7140209')?.code).toBe('7140209');
    expect(checkHcmueThptThreshold(24, 'hcmue-7140209').pass).toBe(true);
    expect(checkHcmueThptThreshold(23.99, 'hcmue-7140209').pass).toBe(false);
  });

  it('reports no published threshold for branch-campus programs instead of guessing', () => {
    const result = checkHcmueThptThreshold(29, 'hcmue-7140209-longan');
    expect(result.pass).toBe(false);
    expect(result.requiredText).toContain('chưa công bố');
  });
});
