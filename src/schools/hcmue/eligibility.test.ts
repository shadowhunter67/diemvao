import { describe, expect, it } from 'vitest';
import { checkHcmueThptThreshold, getHcmueProgramThreshold } from './eligibility';

describe('HCMUE eligibility', () => {
  it('checks official THPT threshold by selected school-local program id', () => {
    expect(getHcmueProgramThreshold('hcmue-7140209')?.code).toBe('7140209');
    expect(checkHcmueThptThreshold(24, 'hcmue-7140209').pass).toBe(true);
    expect(checkHcmueThptThreshold(23.99, 'hcmue-7140209').pass).toBe(false);
  });
});
