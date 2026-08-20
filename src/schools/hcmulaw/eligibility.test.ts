import { describe, expect, it } from 'vitest';
import { checkHcmulawThpt5Threshold } from './eligibility';

describe('checkHcmulawThpt5Threshold', () => {
  it('passes at/above the program threshold (Luật, 20/30)', () => {
    expect(checkHcmulawThpt5Threshold(20, '7380101').pass).toBe(true);
    expect(checkHcmulawThpt5Threshold(19.99, '7380101').pass).toBe(false);
  });

  it('applies the correct threshold per program', () => {
    expect(checkHcmulawThpt5Threshold(17, '7220201').pass).toBe(true); // Ngôn ngữ Anh 17
    expect(checkHcmulawThpt5Threshold(16.99, '7220201').pass).toBe(false);
    expect(checkHcmulawThpt5Threshold(16, '7310109').pass).toBe(true); // Kinh tế số 16
  });

  it('fails safely for an unknown program id', () => {
    const result = checkHcmulawThpt5Threshold(30, 'unknown-program' as never);
    expect(result.pass).toBe(false);
  });
});
